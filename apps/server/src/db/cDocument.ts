import { type UploadDocument, type Document } from "shared/schema/document";
import { db } from "./db";

export const cDocument = {
  /**
   * Upload a new document
   * @param document
   * @returns
   */
  uploadDocument: async function (document: UploadDocument): Promise<Document> {
    const queryResult = await db.query(
      `INSERT INTO documents (user_id, name, s3_name) VALUES (${document.user_id}, ${document.name}, ${document.s3_name}) RETURNING document_id`
    );
    return {
      document_id: queryResult.rows[0].document_id,
      ...document,
    };
  },
};
