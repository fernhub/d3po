import { z } from "zod";
import { Model } from "./model";
import { MODEL_SOURCE } from "../enums/models";

export const socketConnectionQuerySchema = z.object({
  user_id: z.string(),
  document_key: z.string(),
  model_source: z.nativeEnum(MODEL_SOURCE),
  model_key: z.string().or(z.number()),
});

export type SocketConnectionQuery = z.infer<typeof socketConnectionQuerySchema>;

export const chatMessageSchema = z.object({
  actor: z.string(),
  content: z.string(),
  timestamp: z.date(),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;
