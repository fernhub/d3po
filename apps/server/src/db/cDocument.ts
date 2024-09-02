import { type UploadDocument, type Document } from "shared/schema/document";
import { db } from "./db";
import { QueryResult } from "pg";

export const cDocument = {
  /**
   * Upload a new document
   * @param document
   * @returns
   */
  createDocument: async function (document: UploadDocument): Promise<Document> {
    const queryResult: QueryResult = await db.query(
      `INSERT INTO documents (user_id, name, s3_key) VALUES ('${document.user_id}', '${document.name}', '${document.s3_key}') RETURNING id`
    );
    if (queryResult.rowCount === 0) {
      throw new Error(`Cannot create document row for user: ${document.user_id}`);
    }
    return {
      ...document,
      document_id: queryResult.rows[0].id,
    };
  },
};
