import { RegisterRequest, AuthResponse, ProjectData, UserResponse } from '../types/api.types';
import { Project } from '../types/project.types';
import { Task } from '../types/task.types';
import { HttpConfig, HttpResponse, HttpError } from '../types/http.types';
import { http } from 'httplazy';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Configurar la URL base para las peticiones
http.defaults.baseURL = BASE_URL;
http.defaults.headers['Content-Type'] = 'application/json';

// Configurar interceptores
http.interceptors.request.use((config: HttpConfig) => {
  // Añadir token de autenticación si existe
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
  }
  return config;
});

http.interceptors.response.use(
  (response: HttpResponse<unknown>) => response,
  (error: HttpError) => {
    // Manejar error de autenticación
    if (error.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// API Services
export const api = {
  // Auth endpoints
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await http.post<AuthResponse>('/api/auth/login', { email, password });
    return response.data;
  },

  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await http.post<AuthResponse>('/api/auth/register', userData);
    return response.data;
  },

  getProfile: async (): Promise<UserResponse> => {
    const response = await http.get<UserResponse>('/api/auth/profile');
    return response.data;
  },

  // Task endpoints
  getTasks: async (): Promise<Task[]> => {
    const response = await http.get<Task[]>('/api/tasks');
    return response.data;
  },

  getTask: async (id: string): Promise<Task> => {
    const response = await http.get<Task>(`/api/tasks/${id}`);
    return response.data;
  },

  createTask: async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
    const response = await http.post<Task>('/api/tasks', taskData);
    return response.data;
  },

  updateTask: async (id: string, taskData: Partial<Task>): Promise<Task> => {
    const response = await http.put<Task>(`/api/tasks/${id}`, taskData);
    return response.data;
  },

  deleteTask: async (id: string): Promise<void> => {
    await http.delete(`/api/tasks/${id}`);
  },

  // Project endpoints
  getProjects: async (): Promise<Project[]> => {
    const response = await http.get<Project[]>('/api/projects');
    return response.data;
  },

  getProject: async (id: string): Promise<Project> => {
    const response = await http.get<Project>(`/api/projects/${id}`);
    return response.data;
  },

  createProject: async (projectData: ProjectData): Promise<Project> => {
    const response = await http.post<Project>('/api/projects', projectData);
    return response.data;
  },

  updateProject: async (id: string, projectData: Partial<ProjectData>): Promise<Project> => {
    const response = await http.put<Project>(`/api/projects/${id}`, projectData);
    return response.data;
  },

  deleteProject: async (id: string): Promise<void> => {
    await http.delete(`/api/projects/${id}`);
  },

  // Team endpoints
  getTeams: async () => {
    const response = await http.get('/api/teams');
    return response.data;
  },
};
