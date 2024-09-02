import { NextFunction, type Request, type Response } from "express";
import { type Document, newDocumentSchema } from "shared/schema/document";
import bcrypt from "bcryptjs";
import { S3Client, GetObjectCommand, S3ClientConfig, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { cDocument } from "$/db/cDocument";

var fileExtRegex = /(?:\.([^.]+))?$/;

/**
 * Create a hashed key, with the original file extension, for upload to s3 so that names are hidden and unique in bucket
 * @param documentName - original documentName
 * @returns
 */
async function getDocumentKey(documentName: string) {
  const ext = fileExtRegex.exec(documentName);

  const salt = await bcrypt.genSalt(10);
  const hashedName = await bcrypt.hash(documentName, salt);

  const key = `${hashedName}.${ext}`;
  console.log(`creating key: ${key}`);
  return key;
}

async function getPresignedPutUrl(req: Request, res: Response, next: NextFunction) {
  const parse = newDocumentSchema.safeParse(req.body);
  if (parse.error) {
    next(parse.error);
    return;
  }
  const { name } = parse.data;
  //create a hash of the raw doc name + user_id to ensure uniqueness
  const key = await getDocumentKey(`${name}${req.user}`);
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
    const url = await getSignedUrl(s3, command, { expiresIn: 15 * 60 }); // expires in seconds
    console.log("Presigned URL: ", url);
    res.status(200).send({ presignedUrl: url });
  } catch (err) {
    next(err);
    return;
  }
}

async function createDocumentPointer(req: Request, res: Response, next: NextFunction) {
  const parse = newDocumentSchema.safeParse(req.body);
  if (parse.error) {
    next(parse.error);
    return;
  }
  const { name } = parse.data;
  const key = await getDocumentKey(`${name}${req.user}`);
  const newDocument: Document = await cDocument.createDocument({
    name: name,
    s3_key: key,
    user_id: req.user,
  });
  res.status(201).send(newDocument);
  try {
  } catch (err) {
    next(err);
    return;
  }
}

export const documentController = {
  getPresignedPutUrl,
  createDocumentPointer,
};
