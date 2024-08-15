import { Pool, type QueryResult } from "pg";

const pool = new Pool({
  user: "zack",
  host: "localhost",
  port: 5432,
  database: "pdfhelper",
});

export function query(text: string, params: any): Promise<QueryResult> {
  return pool.query(text, params);
}
