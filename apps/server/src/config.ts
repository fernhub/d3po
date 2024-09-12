import dotenv from "dotenv";
const result = dotenv.config();

if (result.error) {
  throw result.error;
}

const { parsed: envs } = result;
export const env = { ...envs };

Object.assign(env, {
  NODE_ENV: process.env.NODE_ENV,
  POSTGRES_USER: process.env.POSTGRES_USER,
  POSTGRES_URL: process.env.POSTGRES_URL,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
  POSTGRES_DATABASE: process.env.POSTGRES_DATABASE,
});

Object.assign(env, {
  BASE_URL: env.NODE_ENV === "development" ? "localhost" : process.env.BASE_URL,
});

console.log(env);
