import { create } from 'zustand';
import { TaskData, TaskState } from '../types/task.types';
import * as api from '../services/api';

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  currentTask: null,
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    try {
      set({ isLoading: true, error: null });
      const tasks = await api.api.getTasks();
      set({ tasks, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al cargar las tareas',
        isLoading: false
      });
    }
  },

  getTask: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const task = await api.api.getTask(id);
      set({ currentTask: task, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : `Error al cargar la tarea ${id}`,
        isLoading: false
      });
    }
  },

  getTasksByProject: async (projectId: string) => {
    try {
      set({ isLoading: true, error: null });
      const tasks = await api.api.getTasksByProject(projectId);
      set({ tasks, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : `Error al cargar las tareas del proyecto ${projectId}`,
        isLoading: false
      });
    }
  },

  createTask: async (data: TaskData) => {
    try {
      set({ isLoading: true, error: null });
      const task = await api.api.createTask(data as Omit<Task, "id" | "createdAt" | "updatedAt">);
      set(state => ({
        tasks: [...state.tasks, task],
        isLoading: false
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al crear la tarea',
        isLoading: false
      });
    }
  },

  updateTask: async (id: string, data: Partial<TaskData>) => {
    try {
      set({ isLoading: true, error: null });
      const updatedTask = await api.api.updateTask(id, data);

      set(state => ({
        tasks: state.tasks.map(task => task.id === id ? updatedTask : task),
        currentTask: state.currentTask?.id === id ? updatedTask : state.currentTask,
        isLoading: false
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : `Error al actualizar la tarea ${id}`,
        isLoading: false
      });
    }
  },

  deleteTask: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      await api.api.deleteTask(id);

      set(state => ({
        tasks: state.tasks.filter(task => task.id !== id),
        currentTask: state.currentTask?.id === id ? null : state.currentTask,
        isLoading: false
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : `Error al eliminar la tarea ${id}`,
        isLoading: false
      });
    }
  },

  clearError: () => set({ error: null })
}));
