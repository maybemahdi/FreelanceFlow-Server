import { Client, InteractionType, Project, User } from "@prisma/client";

export interface ICreateInteraction {
  date: string;
  type: InteractionType;
  notes?: string;
  projectId: string;
  clientId: string;
}

export interface IUpdateInteraction {
  date?: string;
  type?: InteractionType;
  notes?: string;
  projectId?: string;
  clientId?: string;
}

export interface IInteraction {
  id: string;
  date: string;
  type: 'CALL' | 'EMAIL' | 'MEET' | 'CHAT';
  notes?: string | null;
  projectId: string;
  clientId: string;
  ownerId?: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  project?: Project[];
  client?: Client[];
  owner?: User | null;
}


export interface IInteractionFilterRequest {
  clientId?: string | undefined;
  projectId?: string | undefined;
  notes?: string | undefined;
  searchTerm?: string | undefined;
};