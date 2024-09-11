import { NextFunction, type Request, type Response } from "express";
import {
  deleteDocumentSchema,
  type Document,
  newDocumentSchema,
  type UpdateDocument,
  updateDocumentRequestSchema,
} from "shared/schema/document";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { cDocument } from "$/db/cDocument";
import { DOCUMENT_STATUS } from "shared/enums/document";
import { HttpStatus } from "shared/enums/http-status.enums";
import { HttpError } from "shared/exceptions/HttpError";
import { getS3Config } from "$/utils/s3";
import { validateUserIsOwner } from "$/utils/documentUtils";

/**
 * Create a hashed key, with the original file extension, for upload to s3 so that names are hidden and unique in bucket
 * @param documentName - original documentName
 * @returns
 */
async function _getDocumentKey(key: string) {
  const salt = await bcrypt.genSalt(10);
  const hashedKey = await bcrypt.hash(key, salt);

  console.log(`creating key: ${hashedKey}`);
  return hashedKey;
}

async function beginUpload(req: Request, res: Response, next: NextFunction) {
  try {
    const parse = newDocumentSchema.safeParse(req.body);
    if (parse.error) {
      next(parse.error);
      return;
    }

    const { name } = parse.data;
    //create a hash of the raw doc name + user_id to ensure uniqueness
    const key = await _getDocumentKey(`${uuidv4()}${req.user}`);

    const s3 = new S3Client(getS3Config());
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
    });

    await cDocument.createDocument({
      name: name,
      user_id: req.user,
      s3_key: key,
      status: DOCUMENT_STATUS.PROCESSING,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 5 }); // expires in seconds
    console.log("Presigned URL: ", url);
    res.status(200).send({ presignedUrl: url, s3_key: key });
  } catch (err) {
    console.log(err);
    next(err);
    return;
  }
}

async function updateDocument(req: Request, res: Response, next: NextFunction) {
  try {
    const parse = updateDocumentRequestSchema.safeParse(req.body);
    if (parse.error) {
      next(parse.error);
      return;
    }

    const { s3_key, status } = parse.data;
    if (!validateUserIsOwner(s3_key, req.user)) {
      next(new HttpError({ message: "Invalid request", code: HttpStatus.BAD_REQUEST }));
      return;
    }

    const updateDocRes: UpdateDocument = await cDocument.updateDocument({
      user_id: req.user,
      s3_key: s3_key,
      status: status,
    });
    res.status(201).send(updateDocRes);
  } catch (e) {
    next(e);
    return;
  }
}

async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const user_id = req.user;
    const documents = await cDocument.getAll(user_id);
    res.status(200).send(documents);
  } catch (e) {
    next(e);
    return;
  }
}

async function deleteDocument(req: Request, res: Response, next: NextFunction) {
  try {
    console.log("in delete");
    const parse = deleteDocumentSchema.safeParse(req.body);
    if (parse.error) {
      next(parse.error);
      return;
    }
    const { s3_key } = parse.data;
    console.log(`key: ${s3_key}`);

    const user_id = req.user;
    console.log(`user: ${user_id}`);
    if (!validateUserIsOwner(s3_key, req.user)) {
      next(new HttpError({ message: "Invalid request", code: HttpStatus.BAD_REQUEST }));
      return;
    }

    const s3 = new S3Client(getS3Config());
    const command = new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: s3_key,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 5 });
    console.log(`signed url: ${url}`);

    console.log("begin deleting");
    await cDocument.updateDocument({
      user_id: user_id,
      s3_key: s3_key,
      status: DOCUMENT_STATUS.DELETING,
    });
    const deleteFromS3 = await fetch(url, {
      method: "DELETE",
    });
    if (!deleteFromS3.ok) {
      console.log("s3 delete error");
      console.log(deleteFromS3);
      console.log("resetting document status");
      await cDocument.updateDocument({
        user_id: user_id,
        s3_key: s3_key,
        status: DOCUMENT_STATUS.UPLOADED,
      });
      throw new HttpError({
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Error deleting from S3",
      });
    }
    console.log("finalizing delete");
    await cDocument.deleteDocument(s3_key, user_id);
    res.status(200).send();
  } catch (e) {
    next(e);
    return;
  }
}

export const documentController = {
  beginUpload,
  updateDocument,
  getAll,
  deleteDocument,
};
