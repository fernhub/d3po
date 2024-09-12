import { Pool } from "pg";
import { env } from "../config";

console.log(env);

export const db =
  env.NODE_ENV == "development"
    ? new Pool({
        user: env.POSTGRES_USER,
        host: env.POSTGRES_URL,
        password: env.POSTGRES_PASS,
        port: parseInt(env.POSTGRES_PORT!, 10),
        database: env.POSTGRES_DATABASE,
      })
    : new Pool({
        connectionString: process.env.POSTGRES_URL,
      });
