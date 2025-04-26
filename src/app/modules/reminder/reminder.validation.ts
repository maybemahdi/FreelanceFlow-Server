import { z } from "zod";

export const createReminderValidationSchema = z.object({
  date: z
    .string({ required_error: "Date is required" })
    .regex(/^\d{2}-\d{2}-\d{4}$/, "Date must be in dd-mm-yyyy format"),
  message: z.string({
    required_error: "Message is required",
  }),
  clientId: z.string().uuid("Invalid client ID format"),
  projectId: z.string().uuid("Invalid project ID format"),
});

export const updateReminderValidationSchema = z.object({
  date: z
    .string()
    .regex(/^\d{2}-\d{2}-\d{4}$/, "Date must be in dd-mm-yyyy format")
    .optional(),
  message: z.string().optional(),
  clientId: z.string().uuid("Invalid client ID format").optional(),
  projectId: z.string().uuid("Invalid project ID format").optional(),
});
