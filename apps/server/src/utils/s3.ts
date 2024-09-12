import { env } from "$/config";
import { S3ClientConfig } from "@aws-sdk/client-s3";

export function getS3Config(): S3ClientConfig {
  return {
    credentials: {
      accessKeyId: env.S3_ACCESS_KEY!,
      secretAccessKey: env.S3_SECRET_KEY!,
    },
    region: env.S3_REGION,
  };
}
