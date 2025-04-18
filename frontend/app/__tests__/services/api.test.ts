import { api } from '../../lib/services/api';
import { http } from 'httplazy';

// Mock httplazy client
jest.mock('httplazy', () => ({
  http: {
    defaults: {
      baseURL: '',
      headers: {},
    },
    interceptors: {
      request: {
        use: jest.fn(),
      },
      response: {
        use: jest.fn(),
      },
    },
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Authentication Methods', () => {
    it('login should make POST request to correct endpoint with credentials', async () => {
      const mockResponse = {
        data: {
          user: { id: 'user1', name: 'Test User', email: 'test@example.com' },
          token: 'mock-token',
        },
      };
      (http.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await api.login('test@example.com', 'password');

      expect(http.post).toHaveBeenCalledWith('/api/auth/login', {
        email: 'test@example.com',
        password: 'password',
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('register should make POST request to correct endpoint with user data', async () => {
      const userData = {
        name: 'New User',
        email: 'new@example.com',
        password: 'password123',
      };
      const mockResponse = {
        data: {
          user: { id: 'user2', name: 'New User', email: 'new@example.com' },
          token: 'mock-token',
        },
      };
      (http.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await api.register(userData);

      expect(http.post).toHaveBeenCalledWith('/api/auth/register', userData);
      expect(result).toEqual(mockResponse.data);
    });

    it('getProfile should make GET request to correct endpoint', async () => {
      const mockResponse = {
        data: { id: 'user1', name: 'Test User', email: 'test@example.com' },
      };
      (http.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await api.getProfile();

      expect(http.get).toHaveBeenCalledWith('/api/auth/profile');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('Task Methods', () => {
    it('getTasks should make GET request to correct endpoint', async () => {
      const mockTasks = [
        { id: 'task1', title: 'Task 1', status: 'pending' },
        { id: 'task2', title: 'Task 2', status: 'completed' },
      ];
      const mockResponse = { data: mockTasks };
      (http.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await api.getTasks();

      expect(http.get).toHaveBeenCalledWith('/api/tasks');
      expect(result).toEqual(mockTasks);
    });

    it('createTask should make POST request to correct endpoint with task data', async () => {
      const taskData = {
        title: 'New Task',
        description: 'Task description',
        status: 'pending',
        priority: 'medium' as 'medium' | 'low' | 'high',
        createdById: 'user1'
      };
      const mockResponse = {
        data: { id: 'task3', ...taskData, createdAt: '2023-05-01', updatedAt: '2023-05-01' },
      };
      (http.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await api.createTask(taskData);

      expect(http.post).toHaveBeenCalledWith('/api/tasks', taskData);
      expect(result).toEqual(mockResponse.data);
    });

    it('updateTask should make PUT request to correct endpoint with task data', async () => {
      const taskId = 'task1';
      const taskData = {
        status: 'completed',
      };
      const mockResponse = {
        data: { id: taskId, title: 'Task 1', status: 'completed' },
      };
      (http.put as jest.Mock).mockResolvedValue(mockResponse);

      const result = await api.updateTask(taskId, taskData);

      expect(http.put).toHaveBeenCalledWith(`/api/tasks/${taskId}`, taskData);
      expect(result).toEqual(mockResponse.data);
    });

    it('deleteTask should make DELETE request to correct endpoint', async () => {
      const taskId = 'task1';
      (http.delete as jest.Mock).mockResolvedValue({});

      await api.deleteTask(taskId);

      expect(http.delete).toHaveBeenCalledWith(`/api/tasks/${taskId}`);
    });
  });

  describe('Project Methods', () => {
    it('getProjects should make GET request to correct endpoint', async () => {
      const mockProjects = [
        { id: 'proj1', name: 'Project 1', status: 'active' },
        { id: 'proj2', name: 'Project 2', status: 'completed' },
      ];
      const mockResponse = { data: mockProjects };
      (http.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await api.getProjects();

      expect(http.get).toHaveBeenCalledWith('/api/projects');
      expect(result).toEqual(mockProjects);
    });

    it('createProject should make POST request to correct endpoint with project data', async () => {
      const projectData = {
        name: 'New Project',
        description: 'Project description',
        teamId: 'team1',
      };
      const mockResponse = {
        data: { id: 'proj3', ...projectData, status: 'active', createdAt: '2023-05-01', updatedAt: '2023-05-01' },
      };
      (http.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await api.createProject(projectData);

      expect(http.post).toHaveBeenCalledWith('/api/projects', projectData);
      expect(result).toEqual(mockResponse.data);
    });
  });
});
