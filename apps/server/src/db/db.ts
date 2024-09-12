import { Pool } from "pg";
import { env } from "../config";

console.log(env);

export const db = new Pool({
  user: env.DB_USER,
  host: env.DB_URL,
  port: parseInt(env.DB_PORT, 10),
  database: "pdfhelper",
});
