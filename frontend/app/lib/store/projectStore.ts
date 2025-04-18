import { create } from 'zustand';
import { api } from '../services/api';

export interface Project {
  id: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  status: string;
  teamId: string;
  createdAt: string;
  updatedAt: string;
  team?: {
    id: string;
    name: string;
  };
  _count?: {
    tasks: number;
  };
}

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  fetchProject: (id: string) => Promise<void>;
  createProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProject: (id: string, project: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const projects = await api.getProjects();
      set({ projects, isLoading: false });
    } catch (error) {
      console.error('Error fetching projects:', error);
      set({
        error: error instanceof Error ? error.message : 'Error al cargar los proyectos',
        isLoading: false
      });
    }
  },

  fetchProject: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const project = await api.getProject(id);
      set({ currentProject: project, isLoading: false });
    } catch (error) {
      console.error('Error fetching project:', error);
      set({
        error: error instanceof Error ? error.message : 'Error al cargar el proyecto',
        isLoading: false
      });
    }
  },

  createProject: async (projectData) => {
    set({ isLoading: true, error: null });
    try {
      const newProject = await api.createProject(projectData);
      set(state => ({
        projects: [...state.projects, newProject],
        isLoading: false
      }));
    } catch (error) {
      console.error('Error creating project:', error);
      set({
        error: error instanceof Error ? error.message : 'Error al crear el proyecto',
        isLoading: false
      });
      throw error;
    }
  },

  updateProject: async (id, projectData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedProject = await api.updateProject(id, projectData);
      set(state => ({
        projects: state.projects.map(project =>
          project.id === id ? { ...project, ...updatedProject } : project
        ),
        currentProject: state.currentProject?.id === id
          ? { ...state.currentProject, ...updatedProject }
          : state.currentProject,
        isLoading: false
      }));
    } catch (error) {
      console.error('Error updating project:', error);
      set({
        error: error instanceof Error ? error.message : 'Error al actualizar el proyecto',
        isLoading: false
      });
      throw error;
    }
  },

  deleteProject: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.deleteProject(id);
      set(state => ({
        projects: state.projects.filter(project => project.id !== id),
        currentProject: state.currentProject?.id === id ? null : state.currentProject,
        isLoading: false
      }));
    } catch (error) {
      console.error('Error deleting project:', error);
      set({
        error: error instanceof Error ? error.message : 'Error al eliminar el proyecto',
        isLoading: false
      });
      throw error;
    }
  }
}));
