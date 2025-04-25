import { Interaction, ProjectStatus, Reminder } from "@prisma/client";

export interface IProject {
  id: string;
  title: string;
  budget: number;
  deadline: string;
  status: ProjectStatus;
  clientId: string;
  ownerId: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;

  Interaction?: Interaction[];
  Reminder?: Reminder[];
}

export interface ICreateProject {
  title: string;
  budget: number;
  deadline: string;
  clientId: string;
}
