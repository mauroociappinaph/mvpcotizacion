import { Request, Response } from 'express';
import { prisma } from '../index';

// Obtener todos los proyectos
export const getAllProjects = async (req: Request, res: Response) => {
  try {
    // @ts-ignore - Assuming auth middleware is used to add user to req
    const userId = req.user?.userId;

    // Obtener proyectos asociados a los equipos del usuario
    const projects = await prisma.project.findMany({
      where: {
        team: {
          members: {
            some: {
              userId: userId,
            },
          },
        },
      },
      include: {
        team: {
          select: {
            id: true,
            name: true,
          },
        },
        phases: {
          orderBy: {
            order: 'asc',
          },
        },
        _count: {
          select: {
            tasks: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

// Obtener un proyecto específico por ID
export const getProjectById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        team: {
          select: {
            id: true,
            name: true,
            members: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                  },
                },
              },
            },
          },
        },
        phases: {
          orderBy: {
            order: 'asc',
          },
        },
        tasks: {
          include: {
            assignedTo: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Verificar si el usuario pertenece al equipo del proyecto
    // @ts-ignore - Assuming auth middleware is used
    const userId = req.user?.userId;
    const userIsMember = project.team.members.some(
      (member: { user: { id: string } }) => member.user.id === userId
    );

    if (!userIsMember) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
};

// Crear un nuevo proyecto
export const createProject = async (req: Request, res: Response) => {
  try {
    const { name, description, teamId, startDate, endDate } = req.body;

    // Verificar si el usuario pertenece al equipo
    // @ts-ignore - Assuming auth middleware is used
    const userId = req.user?.userId;
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        members: true,
      },
    });

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    const userIsMember = team.members.some((member: { userId: string }) => member.userId === userId);
    if (!userIsMember) {
      return res.status(403).json({ error: 'User is not a member of this team' });
    }

    // Crear el proyecto
    const newProject = await prisma.project.create({
      data: {
        name,
        description,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        status: 'active',
        team: {
          connect: { id: teamId },
        },
      },
    });

    res.status(201).json(newProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
};

// Actualizar un proyecto existente
export const updateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, status, startDate, endDate } = req.body;

    // Verificar si el proyecto existe
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        team: {
          include: {
            members: true,
          },
        },
      },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Verificar si el usuario pertenece al equipo del proyecto
    // @ts-ignore - Assuming auth middleware is used
    const userId = req.user?.userId;
    const userIsMember = project.team.members.some(
      (member: { userId: string }) => member.userId === userId
    );

    if (!userIsMember) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Actualizar el proyecto
    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        name,
        description,
        status,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      },
    });

    res.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
};

// Eliminar un proyecto
export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Verificar si el proyecto existe
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        team: {
          include: {
            members: true,
          },
        },
      },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Verificar si el usuario pertenece al equipo del proyecto y tiene rol de admin
    // @ts-ignore - Assuming auth middleware is used
    const userId = req.user?.userId;
    const userMembership = project.team.members.find(
      (member: { userId: string }) => member.userId === userId
    );

    if (!userMembership) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Solo permitir que administradores eliminen proyectos
    if (userMembership.role !== 'admin') {
      return res.status(403).json({ error: 'Only team admins can delete projects' });
    }

    // Eliminar el proyecto
    await prisma.project.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
};
