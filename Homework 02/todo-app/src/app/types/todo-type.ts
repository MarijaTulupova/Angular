export enum TodoStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In_Progress',
  COMPLETED = 'Completed',
}

export interface Todo {
  id: number;
  title: string;
  description: string;
  status: TodoStatus;
}
