import { NextFunction, type Request, type Response } from "express";
import { newDocumentSchema, UploadDocument, uploadDocumentSchema } from "shared/schema/document";
import bcrypt from "bcryptjs";
import aws from "aws-sdk";
import { HttpError } from "shared/exceptions/HttpError";
import { HttpStatus } from "shared/enums/http-status.enums";

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

async function getPresignedUploadLink(req: Request, res: Response, next: NextFunction) {
  const parse = newDocumentSchema.safeParse(req.body);
  if (parse.error) {
    next(parse.error);
    return;
  }
  const { name } = parse.data;
  const _credentials = {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  };
  try {
    aws.config.update({ credentials: _credentials, region: process.env.region });
    const s3 = new aws.S3();
    const key = await getDocumentKey(name);
    const signedUrl = s3.getSignedUrl("putObject", {
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Expires: 10,
    });

    res.status(200).send({ signedUrl: signedUrl });
  } catch (err) {
    next(err);
    return;
  }
}

async function upload(req: Request, res: Response) {
  const document: UploadDocument = uploadDocumentSchema.parse(req.body);
}

export const documentController = {
  getPresignedUploadLink,
  upload,
};
