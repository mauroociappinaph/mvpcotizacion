import { create } from 'zustand';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  assignedToId?: string;
  projectId?: string;
  phaseId?: string;
  parentTaskId?: string;
  createdById: string;
}

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  isLoading: false,
  error: null,

  // In a real application, these functions would make API calls
  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      // Here we would fetch from the API
      // For now, just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock data
      set({
        tasks: [
          {
            id: '1',
            title: 'Complete project setup',
            description: 'Set up the initial project structure',
            status: 'completed',
            priority: 'high',
            dueDate: '2023-12-01',
            createdById: 'user1'
          },
          {
            id: '2',
            title: 'Design homepage',
            description: 'Create design mockups for the homepage',
            status: 'in-progress',
            priority: 'medium',
            dueDate: '2023-12-10',
            createdById: 'user1'
          },
          {
            id: '3',
            title: 'Implement API endpoints',
            description: 'Create REST API endpoints for the project',
            status: 'todo',
            priority: 'high',
            dueDate: '2023-12-15',
            createdById: 'user1'
          }
        ],
        isLoading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        isLoading: false
      });
    }
  },

  addTask: async (newTask) => {
    set({ isLoading: true, error: null });
    try {
      // Here we would post to the API
      await new Promise(resolve => setTimeout(resolve, 500));

      const taskWithId = {
        ...newTask,
        id: Math.random().toString(36).substr(2, 9) // Simple ID generation
      };

      set(state => ({
        tasks: [...state.tasks, taskWithId],
        isLoading: false
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        isLoading: false
      });
    }
  },

  updateTask: async (id, updatedTask) => {
    set({ isLoading: true, error: null });
    try {
      // Here we would put to the API
      await new Promise(resolve => setTimeout(resolve, 500));

      set(state => ({
        tasks: state.tasks.map(task =>
          task.id === id ? { ...task, ...updatedTask } : task
        ),
        isLoading: false
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        isLoading: false
      });
    }
  },

  deleteTask: async (id) => {
    set({ isLoading: true, error: null });
    try {
      // Here we would delete from the API
      await new Promise(resolve => setTimeout(resolve, 500));

      set(state => ({
        tasks: state.tasks.filter(task => task.id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        isLoading: false
      });
    }
  }
}));
