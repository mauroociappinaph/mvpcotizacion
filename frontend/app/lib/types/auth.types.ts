// Tipos para autenticación

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  createdAt?: string;
  bio?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (userData: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
  checkAuthStatus: () => Promise<boolean>;
  updateUserProfile: (userData: { name: string; bio?: string; image?: string }) => Promise<User>;
}
