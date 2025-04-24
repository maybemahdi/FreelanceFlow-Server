/* eslint-disable @typescript-eslint/no-explicit-any */
// types/User.ts

import { UserRole, UserStatus } from "@prisma/client";

export interface IUser {
  id: string;
  name: string;
  email: string;
  profilePhoto: string;
  password: string;
  phoneNumber: string;
  role: UserRole;
  status: UserStatus;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;

  Client?: any[];
  Project?: any[];
  Interaction?: any[];
  Reminder?: any[];
}
