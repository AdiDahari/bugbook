import { z } from "zod";

const requiredString = z.string().trim().min(1, "Required");

export const signUpSchema = z.object({
  email: requiredString.email("Invalid email address"),
  username: requiredString.regex(
    /^[a-zA-Z0-9_-]/,
    "Letters, numbers, '_' and '-' only",
  ),
  password: requiredString.min(8, "Too short, 8 characters minimum"),
});

export const logInSchema = z.object({
  username: requiredString,
  password: requiredString,
});

export type SignUpValues = z.infer<typeof signUpSchema>;
export type LogInValues = z.infer<typeof logInSchema>;
