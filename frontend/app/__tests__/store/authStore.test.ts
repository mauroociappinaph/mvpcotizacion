import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '../../lib/store/authStore';
import * as api from '../../lib/services/api';

// Mock the API module
jest.mock('../../lib/services/api', () => ({
  api: {
    login: jest.fn(),
    register: jest.fn(),
    getProfile: jest.fn(),
  },
}));

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
  writable: true,
});

describe('authStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window.localStorage, 'getItem').mockImplementation(() => null);
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useAuthStore());
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should set authenticated when token exists in localStorage', () => {
    localStorage.setItem('authToken', 'fake-token');

    const { result } = renderHook(() => useAuthStore());
    expect(result.current.isAuthenticated).toBe(true);

    localStorage.removeItem('authToken');
  });

  it('should login successfully', async () => {
    const mockResponse = {
      user: { id: '1', name: 'Test User', email: 'test@example.com' },
      token: 'fake-token',
    };

    (api.api.login as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });

    expect(api.api.login).toHaveBeenCalledWith('test@example.com', 'password');
    expect(result.current.user).toEqual(mockResponse.user);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('should handle login failure', async () => {
    (api.api.login as jest.Mock).mockRejectedValue(new Error('Invalid credentials'));

    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      try {
        await result.current.login('test@example.com', 'wrong-password');
      } catch {}
    });

    expect(api.api.login).toHaveBeenCalledWith('test@example.com', 'wrong-password');
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.error).toBeTruthy();
  });

  it('should register successfully', async () => {
    const mockResponse = {
      user: { id: '1', name: 'New User', email: 'new@example.com' },
      token: 'fake-token',
    };

    (api.api.register as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      await result.current.register({ name: 'New User', email: 'new@example.com', password: 'password' });
    });

    expect(api.api.register).toHaveBeenCalled();
    expect(result.current.user).toEqual(mockResponse.user);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should logout correctly', async () => {
    localStorage.setItem('authToken', 'fake-token');

    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorage.getItem('authToken')).toBeNull();
  });

  it('should check auth status and set user when token exists', async () => {
    localStorage.setItem('authToken', 'fake-token');

    const mockUser = { id: '1', name: 'Test User', email: 'test@example.com' };
    (api.api.getProfile as jest.Mock).mockResolvedValue(mockUser);

    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      await result.current.checkAuthStatus();
    });

    expect(api.api.getProfile).toHaveBeenCalled();
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);

    localStorage.removeItem('authToken');
  });
});
