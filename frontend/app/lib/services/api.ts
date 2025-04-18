import { RegisterRequest, AuthResponse, ProjectData, UserResponse } from '../types/api.types';
import { Project } from '../types/project.types';
import { Task } from '../types/task.types';
import { Quotation, QuotationItem, Client, QuotationData, QuotationItemData, ClientData } from '../types/quotation.types';
import { HttpConfig, HttpResponse, HttpError } from '../types/http.types';
import { http } from 'httplazy';
import axios, { AxiosError } from 'axios';

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

// Helper function to handle API errors
const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{error?: string}>;
    if (axiosError.response?.data?.error) {
      return axiosError.response.data.error;
    }
  }
  return 'An unexpected error occurred';
};

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

  getTasksByProject: async (projectId: string): Promise<Task[]> => {
    const response = await http.get<Task[]>(`/api/projects/${projectId}/tasks`);
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

  // Quotation endpoints
  getQuotations: async (): Promise<Quotation[]> => {
    try {
      const response = await axios.get<{data?: Quotation[]}>('/api/quotations');
      return response.data.data || [];
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getQuotation: async (id: string): Promise<Quotation> => {
    try {
      const response = await axios.get<{data?: Quotation}>(`/api/quotations/${id}`);
      if (!response.data.data) {
        throw new Error('Quotation not found');
      }
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  createQuotation: async (data: QuotationData): Promise<Quotation> => {
    try {
      const response = await axios.post<{data?: Quotation}>('/api/quotations', data);
      if (!response.data.data) {
        throw new Error('Failed to create quotation');
      }
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  updateQuotation: async (id: string, data: Partial<QuotationData>): Promise<Quotation> => {
    try {
      const response = await axios.put<{data?: Quotation}>(`/api/quotations/${id}`, data);
      if (!response.data.data) {
        throw new Error('Failed to update quotation');
      }
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  deleteQuotation: async (id: string): Promise<boolean> => {
    try {
      const response = await axios.delete<{data?: boolean}>(`/api/quotations/${id}`);
      return !!response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Quotation items endpoints
  addQuotationItem: async (quotationId: string, data: QuotationItemData): Promise<QuotationItem> => {
    try {
      const response = await axios.post<{data?: QuotationItem}>(`/api/quotations/${quotationId}/items`, data);
      if (!response.data.data) {
        throw new Error('Failed to add quotation item');
      }
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  updateQuotationItem: async (quotationId: string, itemId: string, data: Partial<QuotationItemData>): Promise<QuotationItem> => {
    try {
      const response = await axios.put<{data?: QuotationItem}>(`/api/quotations/${quotationId}/items/${itemId}`, data);
      if (!response.data.data) {
        throw new Error('Failed to update quotation item');
      }
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  removeQuotationItem: async (quotationId: string, itemId: string): Promise<boolean> => {
    try {
      const response = await axios.delete<{data?: boolean}>(`/api/quotations/${quotationId}/items/${itemId}`);
      return !!response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Client endpoints
  getClients: async (): Promise<Client[]> => {
    try {
      const response = await axios.get<{data?: Client[]}>('/api/clients');
      return response.data.data || [];
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getClient: async (id: string): Promise<Client> => {
    try {
      const response = await axios.get<{data?: Client}>(`/api/clients/${id}`);
      if (!response.data.data) {
        throw new Error('Client not found');
      }
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  createClient: async (data: ClientData): Promise<Client> => {
    try {
      const response = await axios.post<{data?: Client}>('/api/clients', data);
      if (!response.data.data) {
        throw new Error('Failed to create client');
      }
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  updateClient: async (id: string, data: Partial<ClientData>): Promise<Client> => {
    try {
      const response = await axios.put<{data?: Client}>(`/api/clients/${id}`, data);
      if (!response.data.data) {
        throw new Error('Failed to update client');
      }
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  deleteClient: async (id: string): Promise<boolean> => {
    try {
      const response = await axios.delete<{data?: boolean}>(`/api/clients/${id}`);
      return !!response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
};
