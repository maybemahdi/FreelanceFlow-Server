import { ProjectStatus } from "@prisma/client";
import { z } from "zod";

export const createProjectValidationSchema = z.object({
  title: z.string().min(1, "Project name is required"),
  budget: z.number().nonnegative(),
  deadline: z
    .string()
    .regex(/^\d{2}-\d{2}-\d{4}$/, "Deadline must be in dd-mm-yyyy format"),
  clientId: z.string().uuid("Invalid client ID format"),
});

export const updateProjectValidationSchema = z.object({
  title: z.string().optional(),
  budget: z.number().optional(),
  deadline: z
    .string()
    .regex(/^\d{2}-\d{2}-\d{4}$/, "Deadline must be in dd-mm-yyyy format")
    .optional(),
  clientId: z.string().uuid("Invalid client ID format").optional(),
});

export const updateProjectStatusValidationSchema = z.object({
    status: z.nativeEnum(ProjectStatus).optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectValidationSchema>;
export type updateProjectInput = z.infer<typeof updateProjectValidationSchema>;
export type updateProjectStatusInput = z.infer<typeof updateProjectStatusValidationSchema>;
