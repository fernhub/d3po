import { Pool } from "pg";

export const db = new Pool({
  user: "zack",
  host: "localhost",
  port: 5432,
  database: "pdfhelper",
});