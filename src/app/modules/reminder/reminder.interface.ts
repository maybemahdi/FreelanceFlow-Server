export interface ICreateReminder {
  date: string;
  message: string;
  clientId?: string;
  projectId?: string;
}

export interface IUpdateReminder {
  date?: string;
  message?: string;
  clientId?: string;
  projectId?: string;
}

export interface IReminderFilterRequest {
  clientId?: string | undefined;
  projectId?: string | undefined;
  ownerId?: string | undefined;
  message?: string | undefined;
  searchTerm?: string | undefined;
};