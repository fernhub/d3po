import dotenv from "dotenv";
const result = dotenv.config();

if (result.error) {
  throw result.error;
}

const { parsed: envs } = result;
export const env = { ...envs };

Object.assign(env, { NODE_ENV: process.env.NODE_ENV });

if (env.NODE_ENV == "development") {
  Object.assign(env, {
    DB_USER: process.env.DB_USER,
    DB_URL: process.env.DB_URL,
    DB_PORT: process.env.DB_PORT,
    DB_NAME: process.env.DB_NAME,
    BASE_URL: "localhost",
  });
}

console.log(env);
