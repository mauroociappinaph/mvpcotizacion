import { useProjectStore } from '../../lib/store/projectStore';
import { api } from '../../lib/services/api';
import { Project } from '../../lib/types/project.types';

// Mock the API service
jest.mock('../../lib/services/api', () => ({
  api: {
    getProjects: jest.fn(),
    getProject: jest.fn(),
    createProject: jest.fn(),
    updateProject: jest.fn(),
    deleteProject: jest.fn(),
  },
}));

describe('Project Store', () => {
  // Example project data for tests
  const mockProjects: Project[] = [
    {
      id: 'proj1',
      name: 'Project 1',
      description: 'Test Project 1',
      status: 'active',
      teamId: 'team1',
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
    },
    {
      id: 'proj2',
      name: 'Project 2',
      description: 'Test Project 2',
      status: 'completed',
      teamId: 'team1',
      createdAt: '2023-01-02',
      updatedAt: '2023-01-02',
    },
  ];

  // Reset all mocks and store before each test
  beforeEach(() => {
    jest.clearAllMocks();

    // Reset the store state
    useProjectStore.setState({
      projects: [],
      currentProject: null,
      isLoading: false,
      error: null,
    });
  });

  describe('fetchProjects', () => {
    it('should set loading state and fetch projects', async () => {
      // Mock API response
      (api.getProjects as jest.Mock).mockResolvedValue(mockProjects);

      // Get store action
      const { fetchProjects } = useProjectStore.getState();

      // Execute action
      await fetchProjects();

      // Verify state was updated
      const state = useProjectStore.getState();
      expect(state.projects).toEqual(mockProjects);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(api.getProjects).toHaveBeenCalled();
    });

    it('should handle errors when fetching projects fails', async () => {
      // Mock API error
      const errorMessage = 'Failed to fetch projects';
      (api.getProjects as jest.Mock).mockRejectedValue(new Error(errorMessage));

      // Get store action
      const { fetchProjects } = useProjectStore.getState();

      // Execute action
      await fetchProjects();

      // Verify error state
      const state = useProjectStore.getState();
      expect(state.error).toBe(errorMessage);
      expect(state.isLoading).toBe(false);
      expect(state.projects).toEqual([]);
    });
  });

  describe('fetchProject', () => {
    it('should fetch a specific project by ID', async () => {
      const projectId = 'proj1';
      const mockProject = mockProjects[0];

      // Mock API response
      (api.getProject as jest.Mock).mockResolvedValue(mockProject);

      // Get store action
      const { fetchProject } = useProjectStore.getState();

      // Execute action
      await fetchProject(projectId);

      // Verify state was updated
      const state = useProjectStore.getState();
      expect(state.currentProject).toEqual(mockProject);
      expect(state.isLoading).toBe(false);
      expect(api.getProject).toHaveBeenCalledWith(projectId);
    });
  });

  describe('createProject', () => {
    it('should create a new project and add it to the list', async () => {
      // New project data
      const newProjectData = {
        name: 'New Project',
        description: 'Test New Project',
        status: 'active',
        teamId: 'team1',
      };

      // Complete project with ID and timestamps that would be returned by API
      const createdProject = {
        ...newProjectData,
        id: 'proj3',
        createdAt: '2023-01-03',
        updatedAt: '2023-01-03',
      };

      // Mock API response
      (api.createProject as jest.Mock).mockResolvedValue(createdProject);

      // Get store action
      const { createProject } = useProjectStore.getState();

      // Execute action
      await createProject(newProjectData);

      // Verify API was called and state was updated
      expect(api.createProject).toHaveBeenCalledWith(newProjectData);

      const state = useProjectStore.getState();
      expect(state.projects).toContainEqual(createdProject);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('updateProject', () => {
    it('should update an existing project', async () => {
      // Setup initial state with projects
      useProjectStore.setState({
        projects: [...mockProjects],
        currentProject: mockProjects[0],
        isLoading: false,
        error: null,
      });

      // Update data
      const projectId = 'proj1';
      const updateData = {
        name: 'Updated Project 1',
        status: 'on-hold',
      };

      // Updated project that would be returned by API
      const updatedProject = {
        ...mockProjects[0],
        ...updateData,
        updatedAt: '2023-01-04',
      };

      // Mock API response
      (api.updateProject as jest.Mock).mockResolvedValue(updatedProject);

      // Get store action
      const { updateProject } = useProjectStore.getState();

      // Execute action
      await updateProject(projectId, updateData);

      // Verify API was called and state was updated
      expect(api.updateProject).toHaveBeenCalledWith(projectId, updateData);

      const state = useProjectStore.getState();
      const projectInList = state.projects.find(p => p.id === projectId);

      expect(projectInList).toEqual(updatedProject);
      expect(state.currentProject).toEqual(updatedProject);
    });
  });

  describe('deleteProject', () => {
    it('should delete a project from the list', async () => {
      // Setup initial state with projects
      useProjectStore.setState({
        projects: [...mockProjects],
        currentProject: null,
        isLoading: false,
        error: null,
      });

      const projectId = 'proj1';

      // Mock API response
      (api.deleteProject as jest.Mock).mockResolvedValue(undefined);

      // Get store action
      const { deleteProject } = useProjectStore.getState();

      // Execute action
      await deleteProject(projectId);

      // Verify API was called and state was updated
      expect(api.deleteProject).toHaveBeenCalledWith(projectId);

      const state = useProjectStore.getState();
      expect(state.projects.find(p => p.id === projectId)).toBeUndefined();
      expect(state.projects).toHaveLength(1); // Only one project should remain
    });

    it('should set current project to null if deleted project was the current one', async () => {
      // Setup initial state with projects and current project
      useProjectStore.setState({
        projects: [...mockProjects],
        currentProject: mockProjects[0], // Set first project as current
        isLoading: false,
        error: null,
      });

      const projectId = 'proj1'; // ID of current project

      // Mock API response
      (api.deleteProject as jest.Mock).mockResolvedValue(undefined);

      // Get store action
      const { deleteProject } = useProjectStore.getState();

      // Execute action
      await deleteProject(projectId);

      // Verify state was updated
      const state = useProjectStore.getState();
      expect(state.currentProject).toBeNull(); // Current project should be null
    });
  });
});
