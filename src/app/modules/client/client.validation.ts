import { z } from "zod";

export const createClientZodSchema = z.object({
  name: z
    .string({ required_error: "Client name is required" })
    .min(1, "Client name is required"),
  email: z
    .string({ required_error: "Client name is required" })
    .email("Invalid email address"),
  phoneNumber: z
    .string({ required_error: "Client name is required" })
    .min(10, "Phone number is too short"),
  company: z.string().optional(),
  notes: z.string().optional(),
});

export const updateClientZodSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Invalid email address").optional(),
  phoneNumber: z.string().optional(),
  company: z.string().optional(),
  notes: z.string().optional(),
});

// Type inference from schema (optional, but useful)
export type CreateClientZodInput = z.infer<typeof createClientZodSchema>;
export type UpdateClientZodInput = z.infer<typeof updateClientZodSchema>;
