import { NextFunction, type Request, type Response } from "express";
import {
  type Document,
  newDocumentSchema,
  type UpdateDocument,
  updateDocumentRequestSchema,
} from "shared/schema/document";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { S3Client, GetObjectCommand, S3ClientConfig, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { cDocument } from "$/db/cDocument";
import { DOCUMENT_STATUS } from "shared/enums/document";

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
  const parse = newDocumentSchema.safeParse(req.body);
  if (parse.error) {
    next(parse.error);
    return;
  }
  const { name } = parse.data;
  //create a hash of the raw doc name + user_id to ensure uniqueness
  const key = await _getDocumentKey(`${uuidv4()}${req.user}`);
  try {
    const s3Configuration: S3ClientConfig = {
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY!,
        secretAccessKey: process.env.S3_SECRET_KEY!,
      },
      region: process.env.S3_REGION,
    };
    const s3 = new S3Client(s3Configuration);
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
    next(err);
    return;
  }
}

async function updateDocument(req: Request, res: Response, next: NextFunction) {
  const parse = updateDocumentRequestSchema.safeParse(req.body);
  if (parse.error) {
    next(parse.error);
    return;
  }
  const { s3_key, status } = parse.data;
  try {
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

export const documentController = {
  beginUpload,
  updateDocument,
  getAll,
};
