import { create } from 'zustand';
import { api } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (userData: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
  checkAuthStatus: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('authToken') : null,
  isLoading: false,
  error: null,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.login(email, password);

      localStorage.setItem('authToken', response.token);

      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false
      });
    } catch (error) {
      console.error('Login error:', error);
      set({
        error: error instanceof Error ? error.message : 'Error de inicio de sesión',
        isLoading: false,
        isAuthenticated: false
      });
      throw error;
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.register(userData);

      localStorage.setItem('authToken', response.token);

      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false
      });
    } catch (error) {
      console.error('Registration error:', error);
      set({
        error: error instanceof Error ? error.message : 'Error de registro',
        isLoading: false,
        isAuthenticated: false
      });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('authToken');
    set({
      user: null,
      token: null,
      isAuthenticated: false
    });
  },

  checkAuthStatus: async () => {
    const token = get().token;

    if (!token) {
      set({ isAuthenticated: false });
      return false;
    }

    try {
      const user = await api.getProfile();
      set({ user, isAuthenticated: true });
      return true;
    } catch (error) {
      console.error('Auth check error:', error);
      localStorage.removeItem('authToken');
      set({
        user: null,
        token: null,
        isAuthenticated: false
      });
      return false;
    }
  }
}));
