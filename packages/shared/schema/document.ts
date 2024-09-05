import { z } from "zod";
import { DOCUMENT_STATUS } from "../enums/document";

export const newDocumentSchema = z.object({
  name: z.string(),
});
export type NewDocument = z.infer<typeof newDocumentSchema>;

export const uploadDocumentSchema = z.object({
  user_id: z.string(),
  name: z.string(),
  s3_key: z.string(),
  status: z.nativeEnum(DOCUMENT_STATUS),
});
export type UploadDocument = z.infer<typeof uploadDocumentSchema>;

export const updateDocumentRequestSchema = z.object({
  s3_key: z.string(),
  status: z.nativeEnum(DOCUMENT_STATUS),
});
export type UpdateDocumentRequest = z.infer<typeof updateDocumentRequestSchema>;

export const updateDocumentSchema = z.object({
  user_id: z.string(),
  s3_key: z.string(),
  status: z.nativeEnum(DOCUMENT_STATUS),
});
export type UpdateDocument = z.infer<typeof updateDocumentSchema>;

export const documentSchema = z.object({
  id: z.string(),
  status: z.nativeEnum(DOCUMENT_STATUS),
  user_id: z.string(),
  name: z.string(),
  s3_key: z.string(),
});
export type Document = z.infer<typeof documentSchema>;

export const documentSignedUrlSchema = z.object({
  presignedUrl: z.string().url(),
  s3_key: z.string(),
});
export type DocumentSignedUrl = z.infer<typeof documentSignedUrlSchema>;

export const deleteDocumentSchema = z.object({
  s3_key: z.string(),
});
export type DeleteDocument = z.infer<typeof deleteDocumentSchema>;
