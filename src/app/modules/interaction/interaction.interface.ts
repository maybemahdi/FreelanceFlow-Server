import { InteractionType } from "@prisma/client";

export interface ICreateInteraction {
  date: string;
  type: InteractionType;
  notes: string;
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
