import { create } from 'zustand';
import { api } from '../services/api';
import { Task, TaskState } from '../types/task.types';

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  currentTask: null,
  projectTasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await api.getTasks();
      set({ tasks, isLoading: false });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      set({
        error: error instanceof Error ? error.message : 'Error al cargar las tareas',
        isLoading: false
      });
    }
  },

  fetchTask: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const task = await api.getTask(id);
      set({ currentTask: task, isLoading: false });
    } catch (error) {
      console.error('Error fetching task:', error);
      set({
        error: error instanceof Error ? error.message : 'Error al cargar la tarea',
        isLoading: false
      });
    }
  },

  fetchTasksByProject: async (projectId: string) => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await api.getTasksByProject(projectId);
      set({ projectTasks: tasks, isLoading: false });
    } catch (error) {
      console.error('Error fetching project tasks:', error);
      set({
        error: error instanceof Error ? error.message : 'Error al cargar las tareas del proyecto',
        isLoading: false
      });
    }
  },

  createTask: async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    set({ isLoading: true, error: null });
    try {
      const newTask = await api.createTask(taskData);
      set(state => ({
        tasks: [...state.tasks, newTask],
        projectTasks: taskData.projectId === state.projectTasks[0]?.projectId
          ? [...state.projectTasks, newTask]
          : state.projectTasks,
        isLoading: false
      }));
      return newTask;
    } catch (error) {
      console.error('Error creating task:', error);
      set({
        error: error instanceof Error ? error.message : 'Error al crear la tarea',
        isLoading: false
      });
      throw error;
    }
  },

  updateTask: async (id: string, taskData: Partial<Task>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedTask = await api.updateTask(id, taskData);
      set(state => ({
        tasks: state.tasks.map(task =>
          task.id === id ? { ...task, ...updatedTask } : task
        ),
        projectTasks: state.projectTasks.map(task =>
          task.id === id ? { ...task, ...updatedTask } : task
        ),
        currentTask: state.currentTask?.id === id
          ? { ...state.currentTask, ...updatedTask }
          : state.currentTask,
        isLoading: false
      }));
      return updatedTask;
    } catch (error) {
      console.error('Error updating task:', error);
      set({
        error: error instanceof Error ? error.message : 'Error al actualizar la tarea',
        isLoading: false
      });
      throw error;
    }
  },

  deleteTask: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await api.deleteTask(id);
      set(state => ({
        tasks: state.tasks.filter(task => task.id !== id),
        projectTasks: state.projectTasks.filter(task => task.id !== id),
        currentTask: state.currentTask?.id === id ? null : state.currentTask,
        isLoading: false
      }));
    } catch (error) {
      console.error('Error deleting task:', error);
      set({
        error: error instanceof Error ? error.message : 'Error al eliminar la tarea',
        isLoading: false
      });
      throw error;
    }
  },

  updateTaskStatus: async (id: string, status: string) => {
    return get().updateTask(id, { status });
  },

  assignTask: async (id: string, userId: string) => {
    return get().updateTask(id, { assignedToId: userId });
  },

  clearProjectTasks: () => {
    set({ projectTasks: [] });
  }
}));
