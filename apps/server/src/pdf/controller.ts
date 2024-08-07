import { type Request, type Response } from "express";
import { query } from "../db/db";

async function getAll(req: Request, res: Response): Promise<any> {
  const queryResult = await query("SELECT * FROM pdf", []);
  res.status(201).send({
    rows: queryResult.rowCount,
  });
}

export const pdfController = {
  getAll,
};
