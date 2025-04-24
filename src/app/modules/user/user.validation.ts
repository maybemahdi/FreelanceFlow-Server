import { UserStatus } from "@prisma/client";
import { z } from "zod";

export const updateUserStatusValidation = z.object({
  id: z.string({ required_error: "User id is required" }),
  status: z.enum([UserStatus.ACTIVE, UserStatus.BLOCKED], {
    required_error: "Status is required",
  }),
});
