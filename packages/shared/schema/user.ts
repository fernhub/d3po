import { z } from "zod";

export const newUserSchema = z.object({
  name: z
    .string({
      required_error: "user's name is required",
    })
    .trim()
    .min(5)
    .max(50),
  email: z
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

export const userSchema = z.object({
  id: z.string(),
  name: z
    .string({
      required_error: "user's name is required",
    })
    .trim(),
  email: z
    .string({
      required_error: "email is required",
    })
    .email(),
  password: z.string({
    required_error: "password is required",
  }),
});

export const userInfoSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email("Must be a valid email address"),
});

export type NewUser = z.infer<typeof newUserSchema>;
export type User = z.infer<typeof userSchema>;
export type UserInfo = z.infer<typeof userInfoSchema>;
