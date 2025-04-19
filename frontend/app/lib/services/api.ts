import { RegisterRequest, AuthResponse, ProjectData, UserResponse } from '../types/api.types';
import { Project } from '../types/project.types';
import { Task } from '../types/task.types';
import { Quotation, QuotationItem, ClientInfo, QuotationData, QuotationItemData, ClientData } from '../types/quotation.types';
import { http } from 'httplazy/client';


// API base URL from environment variable or default to localhost
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';





// API Services
export const api = {
  // Auth endpoints
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    return response.json();
  },

  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await http.post<AuthResponse>('/auth/register', userData);
    return response.data;
  },

  getProfile: async (): Promise<UserResponse> => {
    const response = await http.get<UserResponse>('/auth/profile');
    return response.data;
  },

  updateProfile: async (userData: { name: string; bio?: string; image?: string }) => {
    const response = await http.put<UserResponse>('/auth/profile', userData);
    return response.data;
  },

  // Task endpoints
  getTasks: async (): Promise<Task[]> => {
    const response = await http.get<Task[]>('/tasks');
    return response.data;
  },

  getTask: async (id: string): Promise<Task> => {
    const response = await http.get<Task>(`/tasks/${id}`);
    return response.data;
  },

  getTasksByProject: async (projectId: string): Promise<Task[]> => {
    const response = await http.get<Task[]>(`/projects/${projectId}/tasks`);
    return response.data;
  },

  createTask: async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
    const response = await http.post<Task>('/tasks', taskData);
    return response.data;
  },

  updateTask: async (id: string, taskData: Partial<Task>): Promise<Task> => {
    const response = await http.put<Task>(`/tasks/${id}`, taskData);
    return response.data;
  },

  deleteTask: async (id: string): Promise<void> => {
    await http.delete(`/tasks/${id}`);
  },

  // Project endpoints
  getProjects: async (): Promise<Project[]> => {
    const response = await http.get<Project[]>('/projects');
    return response.data;
  },

  getProject: async (id: string): Promise<Project> => {
    const response = await http.get<Project>(`/projects/${id}`);
    return response.data;
  },

  createProject: async (projectData: ProjectData): Promise<Project> => {
    const response = await http.post<Project>('/projects', projectData);
    return response.data;
  },

  updateProject: async (id: string, projectData: Partial<ProjectData>): Promise<Project> => {
    const response = await http.put<Project>(`/projects/${id}`, projectData);
    return response.data;
  },

  deleteProject: async (id: string): Promise<void> => {
    await http.delete(`/projects/${id}`);
  },

  // Team endpoints
  getTeams: async () => {
    const response = await http.get('/teams');
    return response.data;
  },

  // Quotation endpoints
  getQuotations: async ( ): Promise<Quotation[]> => {
    const response = await http.get<Quotation>('/quotations');
    return response.data;
  },

  getQuotation: async (id: string): Promise<Quotation> => {
    const response = await http.get<Quotation>(`/quotations/${id}`);
    return response.data;
  },

  createQuotation: async (data: QuotationData): Promise<Quotation> => {
    const response = await http.post<Quotation>('/quotations', data);
    return response.data;
  },

  updateQuotation: async (id: string, data: Partial<QuotationData>): Promise<Quotation> => {
    const response = await http.put<Quotation>(`/quotations/${id}`, data);
    return response.data;
  },

  deleteQuotation: async (id: string): Promise<boolean> => {
    const response = await http.delete<{data?: boolean}>(`/quotations/${id}`);
      return !!response.data.data;
  },

  // Quotation items endpoints
  addQuotationItem: async (quotationId: string, data: QuotationItemData): Promise<QuotationItem> => {
    const response = await http.post<{data?: QuotationItem}>(`/quotations/${quotationId}/items`, data);
    return response.data.data;
  },

  updateQuotationItem: async (quotationId: string, itemId: string, data: Partial<QuotationItemData>): Promise<QuotationItem> => {
    const response = await http.put<{data?: QuotationItem}>(`/quotations/${quotationId}/items/${itemId}`, data);
    return response.data.data;
  },

  removeQuotationItem: async (quotationId: string, itemId: string): Promise<boolean> => {
    const response = await http.delete<{data?: boolean}>(`/quotations/${quotationId}/items/${itemId}`);
    return !!response.data.data;
  },

  // Client endpoints
  getClients: async (): Promise<ClientInfo[]> => {
    const response = await http.get<{data?: ClientInfo[]}>('/clients');
    return response.data.data || [];
  },

  getClient: async (id: string): Promise<ClientInfo> => {
    const response = await http.get<{data?: ClientInfo}>(`/clients/${id}`);
    return response.data.data;
  },

  createClient: async (data: ClientData): Promise<ClientInfo> => {
    const response = await http.post<{data?: ClientInfo}>('/clients', data);
    return response.data.data;
  },

    updateClient: async (id: string, data: Partial<ClientData>): Promise<ClientInfo> => {
    const response = await http.put<{data?: ClientInfo}>(`/clients/${id}`, data);
    return response.data.data;
  },

  deleteClient: async (id: string): Promise<boolean> => {
    const response = await http.delete<{data?: boolean}>(`/clients/${id}`);
    return !!response.data.data;
  },



};
