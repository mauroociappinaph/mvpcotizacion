// Tipos para tareas

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  assignedToId?: string;
  assignedTo?: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  projectId?: string;
  project?: {
    id: string;
    name: string;
  };
  createdById: string;
  createdBy?: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  projectTasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  fetchTask: (id: string) => Promise<void>;
  fetchTasksByProject: (projectId: string) => Promise<void>;
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Task>;
  updateTask: (id: string, task: Partial<Task>) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  updateTaskStatus: (id: string, status: string) => Promise<Task>;
  assignTask: (id: string, userId: string) => Promise<Task>;
  clearProjectTasks: () => void;
}
