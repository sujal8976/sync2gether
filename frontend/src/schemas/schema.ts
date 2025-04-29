import { z } from "zod";

export const signUpSchema = z.object({
  username: z
    .string()
    .min(4, { message: "Username must be at least 4 characters long." })
    .max(12, { message: "Username must be at most 12 charcters long." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
    .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, {
      message: "Password must contain at least one letter and one number.",
    }),
  email: z.string().email({ message: "Invalid email address" }),
});

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string(),
});

export const formatZodErrors = (errors: z.ZodIssue[]) => {
  return errors
    .map((err) => {
      // Join the path and replace underscores with spaces
      const field = err.path.join(".").replace(/_/g, " ");
      // Capitalize the first letter of the field
      const formattedField = field.charAt(0).toUpperCase() + field.slice(1);
      const message = err.message;
      return `• ${formattedField}: ${message}`;
    })
    .join("\n");
};
