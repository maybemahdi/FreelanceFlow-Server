import { InteractionType } from "@prisma/client";
import { z } from "zod";

export const createInteractionValidationSchema = z.object({
  date: z
    .string({ required_error: "Date is required" })
    .regex(/^\d{2}-\d{2}-\d{4}$/, "Date must be in dd-mm-yyyy format"),
  type: z.nativeEnum(InteractionType),
  notes: z.string().optional(),
  projectId: z.string().uuid("Invalid project ID format"),
  clientId: z.string().uuid("Invalid client ID format"),
});

export const updateInteractionValidationSchema = z.object({
  date: z
    .string()
    .regex(/^\d{2}-\d{2}-\d{4}$/, "Date must be in dd-mm-yyyy format")
    .optional(),
  type: z.nativeEnum(InteractionType),
  notes: z.string().optional(),
  projectId: z.string().uuid("Invalid project ID format").optional(),
  clientId: z.string().uuid("Invalid client ID format").optional(),
});
