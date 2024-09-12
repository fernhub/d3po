import dotenv from "dotenv";
const result = dotenv.config();

if (result.error) {
  throw result.error;
}

const { parsed: envs } = result;
export const env = { ...envs };

Object.assign(env, {
  POSTGRES_USER: process.env.POSTGRES_USER,
  POSTGRES_URL: process.env.POSTGRES_URL,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
  POSTGRES_DATABASE: process.env.POSTGRES_DATABASE,
  API_URL: process.env.API_URL,
  PORT: process.env.PORT,
  CLIENT_PORT: process.env.CLIENT_PORT,
});

console.log(env);
