import { create } from 'zustand';
import { api } from '../services/api';
import { Project, ProjectState } from '../types/project.types';
import { ProjectData } from '../types/api.types';

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

  createProject: async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    set({ isLoading: true, error: null });
    try {
      const newProject = await api.createProject(projectData as ProjectData);
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
