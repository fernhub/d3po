import { S3Client, GetObjectCommand, S3ClientConfig } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getS3Config } from "./s3";
import { type Document } from "shared/schema/document";
import { cDocument } from "$/db/cDocument";

export async function validateUserIsOwner(
  document_key: string,
  currentUser: string
): Promise<void> {
  const userIsOwner = await cDocument.isUserOwner(document_key, currentUser);
  if (!userIsOwner) {
    throw new Error("Cannot access document for which you are not the owner");
  }
}

export async function getUrlForS3Document(
  document_key: string,
  currentUser: string
): Promise<string> {
  try {
    await validateUserIsOwner(document_key, currentUser);
    console.log("in get doc");
    const s3 = new S3Client(getS3Config());
    console.log(process.env.S3_REGION);
    console.log(getS3Config());
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: document_key,
    });
    console.log("getting url for doc");
    return await getSignedUrl(s3, command, { expiresIn: 10 });
  } catch (e) {
    console.log(e);
    throw new Error("unable to get object from s3");
  }
}
