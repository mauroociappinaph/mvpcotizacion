const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

import { Task } from '../store/taskStore';

// Define types for API requests
interface ProjectData {
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  teamId: string;
}

// Función helper para obtener el token desde localStorage
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
}

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  // En una aplicación real, obtendríamos el token de un almacenamiento o contexto
  const token = getAuthToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle 401 unauthorized errors
  if (response.status === 401) {
    // In a real app, we would redirect to login or refresh the token
    console.error('Unauthorized access. Please log in again.');
    localStorage.removeItem('authToken');
    window.location.href = '/login';
    return null;
  }

  // For all other error statuses, let the caller handle them
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error! Status: ${response.status}`);
  }

  // For successful responses with no content (204)
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const api = {
  // Auth endpoints
  login: async (email: string, password: string) => {
    return fetchWithAuth('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (userData: { name: string; email: string; password: string }) => {
    return fetchWithAuth('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Task endpoints
  getTasks: async () => {
    return fetchWithAuth('/api/tasks');
  },

  getTask: async (id: string) => {
    return fetchWithAuth(`/api/tasks/${id}`);
  },

  createTask: async (taskData: Omit<Task, 'id'>) => {
    return fetchWithAuth('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  },

  updateTask: async (id: string, taskData: Partial<Task>) => {
    return fetchWithAuth(`/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  },

  deleteTask: async (id: string) => {
    return fetchWithAuth(`/api/tasks/${id}`, {
      method: 'DELETE',
    });
  },

  // Project endpoints
  getProjects: async () => {
    return fetchWithAuth('/api/projects');
  },

  getProject: async (id: string) => {
    return fetchWithAuth(`/api/projects/${id}`);
  },

  createProject: async (projectData: ProjectData) => {
    return fetchWithAuth('/api/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  },

  updateProject: async (id: string, projectData: Partial<ProjectData>) => {
    return fetchWithAuth(`/api/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });
  },

  deleteProject: async (id: string) => {
    return fetchWithAuth(`/api/projects/${id}`, {
      method: 'DELETE',
    });
  },

  // Team endpoints
  getTeams: async () => {
    return fetchWithAuth('/api/teams');
  },

  // User endpoints
  getProfile: async () => {
    return fetchWithAuth('/api/users/profile');
  },
};
