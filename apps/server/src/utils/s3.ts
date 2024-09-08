import { S3ClientConfig } from "@aws-sdk/client-s3";

export function getS3Config(): S3ClientConfig {
  return {
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY!,
      secretAccessKey: process.env.S3_SECRET_KEY!,
    },
    region: process.env.S3_REGION,
  };
}
