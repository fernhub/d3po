import { z } from "zod";

export const newUserSchema = z.object({
  name: z
    .string({
      required_error: "user's name is required",
    })
    .trim()
    .min(5)
    .max(50),
  email: z.coerce
    .string({
      required_error: "email is required",
    })
    .email()
    .min(5)
    .max(50),
  password: z
    .string({
      required_error: "password is required",
    })
    .min(8)
    .max(30),
});

export type NewUser = z.infer<typeof newUserSchema>;
