import { z } from "zod";

export const createUserValidator = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(2, "Name must be at least 2 characters"),
  lastName: z.string().min(2, "Name must be at least 2 characters"),
  role: z.enum(["USER", "ADMIN"]).optional().default("USER"),
  phoneNumber: z.string().optional(),
});

export const updateUserValidator = z.object({
  email: z.string().email("Invalid email format").optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  role: z.enum(["USER", "ADMIN"]).optional(),
});

export const loginUserValidator = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export type CreateUserInput = z.infer<typeof createUserValidator>;
export type UpdateUserInput = z.infer<typeof updateUserValidator>;
export type LoginUserInput = z.infer<typeof loginUserValidator>;
