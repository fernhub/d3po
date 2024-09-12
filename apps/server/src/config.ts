import dotenv from "dotenv";
dotenv.config();

export const env = {
  POSTGRES_USER: process.env.POSTGRES_USER,
  POSTGRES_URL: process.env.POSTGRES_URL,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
  POSTGRES_PORT: process.env.POSTGRES_PORT,
  POSTGRES_DATABASE: process.env.POSTGRES_DATABASE,
  API_URL: process.env.API_URL || "localhost",
  PORT: process.env.PORT || "5001",
  CLIENT_URL: process.env.CLIENT_URL,
  NODE_ENV: process.env.NODE_ENV,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  MISTRAL_API_KEY: process.env.MISTRAL_API_KEY,
  JWT_SECRET: process.env.JWT_SECRET,
  S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
  S3_SECRET_KEY: process.env.S3_SECRET_KEY,
  S3_BUCKET: process.env.S3_BUCKET,
  S3_REGION: process.env.S3_REGION,
  DOCUMENT_MAX_UPLOADS: 10,
};

console.log(env);
