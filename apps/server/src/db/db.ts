import { Pool } from "pg";
import { env } from "../config";

console.log(env);

export const db = new Pool({
  user: env.POSTGRES_USER,
  host: env.POSTGRES_URL,
  password: env.POSTGRES_PASS,
  port: 5432,
  database: env.POSTGRES_DATABASE,
});
