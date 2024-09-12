import pg from "pg";
import { env } from "../config";
const { Pool } = pg;

console.log(env);

export const db =
  env.NODE_ENV == "development"
    ? new Pool({
        user: env.POSTGRES_USER,
        host: env.POSTGRES_URL,
        password: env.POSTGRES_PASSWORD,
        port: parseInt(env.POSTGRES_PORT!, 10),
        database: env.POSTGRES_DATABASE,
      })
    : new Pool({
        connectionString: process.env.POSTGRES_URL,
      });
