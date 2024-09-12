import dotenv from "dotenv";
const result = dotenv.config();

if (result.error) {
  throw result.error;
}

const { parsed: envs } = result;
export const env = { ...envs };

const BASE_URL = process.env.NODE_ENV == "production" ? "prod" : "localhost";

Object.assign(env, { BASE_URL: BASE_URL, NODE_ENV: process.env.NODE_ENV });

if (env.NODE_ENV == "development") {
  Object.assign(env, {
    DB_USER: process.env.DB_USER,
    DB_URL: process.env.DB_URL,
    DB_PORT: process.env.DB_PORT,
  });
}

console.log(env);
