import { type UploadDocument, type Document, type UpdateDocument } from "shared/schema/document";
import { db } from "./db";
import { QueryResult } from "pg";
import { DOCUMENT_STATUS } from "shared/enums/document";

export const cDocument = {
  /**
   * Upload a new document
   * @param document
   * @returns
   */
  createDocument: async function (document: UploadDocument): Promise<Document> {
    const queryResult: QueryResult = await db.query(
      `INSERT INTO documents (user_id, name, s3_key, status) VALUES ('${document.user_id}', '${document.name}', '${document.s3_key}', '${DOCUMENT_STATUS.PROCESSING}') RETURNING s3_key`
    );
    if (queryResult.rowCount === 0) {
      throw new Error(`Cannot create document row for user: ${document.user_id}`);
    }
    return {
      ...document,
      id: queryResult.rows[0].id,
    };
  },
  /**
   * Update an existing document based on the passed in parameter
   * @param document
   */
  updateDocument: async function (document: UpdateDocument): Promise<Document> {
    const queryResult: QueryResult = await db.query(
      `UPDATE documents SET status='${document.status}' WHERE user_id='${document.user_id}' AND s3_key='${document.s3_key}' RETURNING id, name`
    );
    if (queryResult.rowCount === 0) {
      throw new Error(`Cannot create document row for user: ${document.user_id}`);
    }
    return {
      ...document,
      name: queryResult.rows[0].name,
      id: queryResult.rows[0].id,
    };
  },
  getAll: async function (user_id: string): Promise<Document[]> {
    const queryResult: QueryResult = await db.query(
      `SELECT 
      id, user_id, name, s3_key, status
      FROM documents 
      WHERE user_id='${user_id}' AND status='${DOCUMENT_STATUS.UPLOADED}'`
    );
    return queryResult.rows;
  },
};
