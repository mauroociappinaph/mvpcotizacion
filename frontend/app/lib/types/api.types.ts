// Tipos para las peticiones y respuestas de la API

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  statusCode?: number;
}

export interface ProjectData {
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  teamId: string;
  status?: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  image?: string;
  createdAt: string;
}

export interface AuthResponse {
  user: UserResponse;
  token: string;
}
