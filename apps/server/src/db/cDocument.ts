import { type UploadDocument, type Document, type UpdateDocument } from "shared/schema/document";
import { db } from "./db";
import { QueryResult } from "pg";
import { DOCUMENT_STATUS } from "shared/enums/document";
import { SQLError } from "shared/exceptions/SQLError";

export const cDocument = {
  /**
   * Upload a new document
   * @param document
   * @returns
   */
  createDocument: async function (document: UploadDocument): Promise<Document> {
    const doc_limit = process.env.DOCUMENT_MAX_UPLOADS || 10;
    const queryResult: QueryResult = await db.query(
      `INSERT INTO 
      documents (user_id, name, s3_key, status) 
      SELECT $1, $2, $3, $4
      WHERE (SELECT COUNT(*)
      FROM documents 
      WHERE user_id = $1) < $5 returning documents.id`,
      [document.user_id, document.name, document.s3_key, document.status, doc_limit]
    );
    if (queryResult.rowCount === 0) {
      console.log(queryResult);
      throw new SQLError({
        message: `Cannot upload, document limit exceeded: ${doc_limit}`,
      });
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
      "UPDATE documents SET status=$1 WHERE user_id=$2 AND s3_key=$3 RETURNING id, name",
      [document.status, document.user_id, document.s3_key]
    );
    if (queryResult.rowCount === 0) {
      throw new SQLError({
        message: `Unable to update document, row not found`,
      });
    }
    return {
      ...document,
      name: queryResult.rows[0].name,
      id: queryResult.rows[0].id,
    };
  },
  getAll: async function (user_id: string): Promise<Document[]> {
    const queryResult: QueryResult = await db.query(
      "SELECT id, user_id, name, s3_key, status FROM documents WHERE user_id=$1 AND status=$2",
      [user_id, DOCUMENT_STATUS.UPLOADED]
    );
    return queryResult.rows;
  },
  deleteDocument: async function (s3_key: string, user_id: string) {
    const queryResult: QueryResult = await db.query(
      "DELETE FROM documents WHERE user_id=$1 AND s3_key=$2",
      [user_id, s3_key]
    );
    if (queryResult.rowCount !== 1) {
      throw new SQLError({
        message: `Could not delete document`,
      });
    }
  },
  isUserOwner: async function (document_key: string, user_id: string): Promise<boolean> {
    const queryResult: QueryResult = await db.query(
      "SELECT user_id FROM documents WHERE s3_key=$1",
      [document_key]
    );
    if (queryResult.rowCount !== 1) {
      throw new SQLError({
        message: `No matching document found for user`,
      });
    }
    return queryResult.rows[0].user_id === user_id;
  },
};
