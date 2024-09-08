import { z } from "zod";
import { MODEL_SOURCE } from "../enums/models";

export const modelSchema = z.object({
  source: z.nativeEnum(MODEL_SOURCE),
  model: z.string(),
  display_name: z.string(),
  key: z.string().or(z.number()),
});

export type Model = z.infer<typeof modelSchema>;
