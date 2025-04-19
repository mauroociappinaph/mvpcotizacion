/**
 * Definición de tipos para tareas
 */

/**
 * Estado de una tarea
 */
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

/**
 * Prioridad de una tarea
 */
export type TaskPriority = 'low' | 'medium' | 'high' | 'baja' | 'media' | 'alta';

/**
 * Modelo de una tarea
 */
export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  projectId?: string;
  assignedTo?: string;
  assignedToName?: string; // Nombre del usuario asignado (si está disponible)
  teamId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

/**
 * Datos para crear una tarea
 */
export interface TaskData {
  title: string;
  description: string;
  status?: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  projectId?: string;
  assignedTo?: string;
  teamId?: string;
}

/**
 * Estado del store de tareas
 */
export interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  isLoading: boolean;
  error: string | null;

  // Acciones
  fetchTasks: () => Promise<void>;
  getTask: (id: string) => Promise<void>;
  getTasksByProject: (projectId: string) => Promise<void>;
  createTask: (data: TaskData) => Promise<void>;
  updateTask: (id: string, data: Partial<TaskData>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  clearError: () => void;
}
