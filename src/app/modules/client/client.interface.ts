import { Interaction, Project, Reminder, User } from "@prisma/client";

export interface IClient {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  company?: string;
  notes?: string;
  ownerId: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;

  projects?: Project[];
  Interaction?: Interaction[];
  Reminder?: Reminder[];
  user?: User;
}

export interface ICreateClient {
  name: string;
  email: string;
  phoneNumber: string;
  company?: string;
  notes?: string;
}


export interface IClientFilterRequest {
  name?: string | undefined;
  email?: string | undefined;
  phoneNumber?: string | undefined;
  company?: string | undefined;
  notes?: string | undefined;
  searchTerm?: string | undefined;
};