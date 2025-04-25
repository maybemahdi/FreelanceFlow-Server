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
