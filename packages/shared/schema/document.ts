import { z } from "zod";

export const newDocumentSchema = z.object({
  name: z.string(),
});
export type newDocumentSchema = z.infer<typeof newDocumentSchema>;

export const uploadDocumentSchema = z.object({
  user_id: z.string(),
  name: z.string(),
  s3_name: z.string(),
});
export type UploadDocument = z.infer<typeof uploadDocumentSchema>;

export const documentSchema = z.object({
  document_id: z.string(),
  user_id: z.string(),
  name: z.string(),
  s3_name: z.string(),
});
export type Document = z.infer<typeof documentSchema>;

export const documentUploadLinkSchema = z.object({
  presignedUrl: z.string().url(),
});
export type DocumentUploadLink = z.infer<typeof documentUploadLinkSchema>;
