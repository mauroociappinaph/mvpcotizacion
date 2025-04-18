import { login, register, getProfile } from '../../controllers/authController';
import { Request, Response } from 'express';
import { prisma } from '../../index';
import * as jwt from 'jsonwebtoken';

// Mock Prisma and jwt
jest.mock('../../index', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mocked-token'),
}));

describe('Auth Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {
      body: {},
    };
    mockResponse = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return 401 if user not found', async () => {
      mockRequest.body = { email: 'test@example.com', password: 'password' };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await login(mockRequest as Request, mockResponse as Response);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
    });

    it('should return 401 if user found but password is missing', async () => {
      mockRequest.body = { email: 'test@example.com', password: 'password' };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        password: null,
      });

      await login(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
    });

    // Additional tests would include password verification and successful login
  });

  describe('register', () => {
    it('should return 400 if user already exists', async () => {
      mockRequest.body = {
        name: 'Test User',
        email: 'existing@example.com',
        password: 'password123',
      };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: '1',
        email: 'existing@example.com',
      });

      await register(mockRequest as Request, mockResponse as Response);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'existing@example.com' },
      });
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'User with this email already exists' });
    });

    it('should create user and return token if valid data', async () => {
      mockRequest.body = {
        name: 'Test User',
        email: 'new@example.com',
        password: 'password123',
      };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: '1',
        name: 'Test User',
        email: 'new@example.com',
        image: null,
        createdAt: new Date(),
      });

      await register(mockRequest as Request, mockResponse as Response);

      expect(prisma.user.create).toHaveBeenCalled();
      expect(jwt.sign).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        user: expect.objectContaining({
          id: '1',
          name: 'Test User',
          email: 'new@example.com',
        }),
        token: 'mocked-token',
      });
    });
  });

  describe('getProfile', () => {
    it('should return 401 if userId not in request', async () => {
      mockRequest.user = undefined;

      await getProfile(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    });

    it('should return 404 if user not found', async () => {
      mockRequest.user = { userId: 'nonexistent-user' };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await getProfile(mockRequest as Request, mockResponse as Response);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'nonexistent-user' },
        select: expect.objectContaining({
          id: true,
          name: true,
          email: true,
        }),
      });
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    it('should return user profile if found', async () => {
      mockRequest.user = { userId: 'valid-user' };
      const mockUser = {
        id: 'valid-user',
        name: 'Test User',
        email: 'test@example.com',
        image: null,
        createdAt: new Date(),
      };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      await getProfile(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
    });
  });
});
