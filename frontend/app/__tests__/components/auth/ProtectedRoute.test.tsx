import '@testing-library/jest-dom';
import React from 'react';
import { render } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../../components/auth/ProtectedRoute';
import { useAuthStore } from '../../../lib/store/authStore';

// Mock the router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the auth store
jest.mock('../../../lib/store/authStore', () => ({
  useAuthStore: jest.fn(),
}));

describe('ProtectedRoute', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Set up router mock
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    // Set up auth store mock with default unauthenticated state
    ((useAuthStore as unknown) as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      checkAuthStatus: jest.fn(),
    });
  });

  it('renders loading state initially', () => {
    ((useAuthStore as unknown) as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
      checkAuthStatus: jest.fn(),
    });

    const { getByText, queryByText } = render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(getByText('Loading...')).toBeInTheDocument();
    expect(queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('redirects to login if user is not authenticated', () => {
    ((useAuthStore as unknown) as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      checkAuthStatus: jest.fn(),
    });

    const { queryByText } = render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    // Should redirect to login
    expect(mockPush).toHaveBeenCalledWith('/login');
    expect(queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('renders children if user is authenticated', () => {
    // Mock authenticated user
    ((useAuthStore as unknown) as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      checkAuthStatus: jest.fn().mockResolvedValue(true),
    });

    const { getByText } = render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    // Should render protected content
    expect(getByText('Protected Content')).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should check authentication status on mount', () => {
    const mockCheckAuthStatus = jest.fn();

    ((useAuthStore as unknown) as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      checkAuthStatus: mockCheckAuthStatus,
    });

    render(<ProtectedRoute>Protected Content</ProtectedRoute>);

    expect(mockCheckAuthStatus).toHaveBeenCalled();
  });
});
