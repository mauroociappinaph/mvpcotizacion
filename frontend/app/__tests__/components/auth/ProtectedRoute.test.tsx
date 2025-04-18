import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
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

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('redirects to login if user is not authenticated', async () => {
    ((useAuthStore as unknown) as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      checkAuthStatus: jest.fn(),
    });

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    // Wait for authentication check
    await screen.findByText('Loading...');

    // Should redirect to login
    expect(mockPush).toHaveBeenCalledWith('/login');
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('renders children if user is authenticated', async () => {
    // Mock authenticated user
    ((useAuthStore as unknown) as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      checkAuthStatus: jest.fn().mockResolvedValue(true),
    });

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    // Wait for authentication check to complete
    await screen.findByText('Protected Content');

    // Should render protected content
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
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
