import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Esquemas de validación
export const projectSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().optional(),
  startDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
  endDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
  status: z.enum(['active', 'completed', 'on-hold']),
  teamId: z.string()
});

export const projectPhaseSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().optional(),
  startDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
  endDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
  order: z.number().int().min(0)
});

// Operaciones de Proyecto
export async function createProject(projectData: z.infer<typeof projectSchema>) {
  const validatedData = projectSchema.parse(projectData);

  // Verificar que el equipo existe
  const team = await prisma.team.findUnique({
    where: { id: validatedData.teamId }
  });

  if (!team) {
    throw new Error('Team not found');
  }

  const project = await prisma.project.create({
    data: {
      ...validatedData,
      team: { connect: { id: validatedData.teamId } }
    },
    include: {
      team: true
    }
  });

  return project;
}

export async function updateProject(id: string, projectData: Partial<z.infer<typeof projectSchema>>) {
  // Verificar que el proyecto existe
  const existingProject = await prisma.project.findUnique({
    where: { id }
  });

  if (!existingProject) {
    throw new Error('Project not found');
  }

  // Actualizar el proyecto
  const project = await prisma.project.update({
    where: { id },
    data: {
      ...(projectData.name && { name: projectData.name }),
      ...(projectData.description !== undefined && { description: projectData.description }),
      ...(projectData.startDate !== undefined && { startDate: projectData.startDate }),
      ...(projectData.endDate !== undefined && { endDate: projectData.endDate }),
      ...(projectData.status && { status: projectData.status }),
      ...(projectData.teamId && { team: { connect: { id: projectData.teamId } } })
    },
    include: {
      team: true,
      phases: {
        orderBy: {
          order: 'asc'
        }
      }
    }
  });

  return project;
}

export async function deleteProject(id: string) {
  // Verificar que el proyecto existe
  const existingProject = await prisma.project.findUnique({
    where: { id }
  });

  if (!existingProject) {
    throw new Error('Project not found');
  }

  // Eliminar el proyecto (las tareas y fases se eliminarán en cascada)
  await prisma.project.delete({
    where: { id }
  });

  return { id };
}

export async function getProjectById(id: string) {
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      team: true,
      phases: {
        orderBy: {
          order: 'asc'
        }
      },
      tasks: {
        include: {
          assignedTo: true
        }
      }
    }
  });

  if (!project) {
    throw new Error('Project not found');
  }

  return project;
}

export async function getProjects(filters: {
  teamId?: string;
  status?: string;
  search?: string;
}) {
  // Construir condiciones de filtrado
  const where: any = {};

  if (filters.teamId) {
    where.teamId = filters.teamId;
  }

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search } },
      { description: { contains: filters.search } }
    ];
  }

  const projects = await prisma.project.findMany({
    where,
    include: {
      team: true,
      phases: {
        orderBy: {
          order: 'asc'
        }
      },
      tasks: {
        include: {
          assignedTo: true
        }
      }
    }
  });

  return projects;
}

// Operaciones de Fases de Proyecto
export async function createProjectPhase(projectId: string, phaseData: z.infer<typeof projectPhaseSchema>) {
  const validatedData = projectPhaseSchema.parse(phaseData);

  // Verificar que el proyecto existe
  const project = await prisma.project.findUnique({
    where: { id: projectId }
  });

  if (!project) {
    throw new Error('Project not found');
  }

  // Crear la fase
  const phase = await prisma.projectPhase.create({
    data: {
      ...validatedData,
      project: { connect: { id: projectId } }
    },
    include: {
      project: true
    }
  });

  return phase;
}

export async function updateProjectPhase(id: string, phaseData: Partial<z.infer<typeof projectPhaseSchema>>) {
  // Verificar que la fase existe
  const existingPhase = await prisma.projectPhase.findUnique({
    where: { id }
  });

  if (!existingPhase) {
    throw new Error('Project phase not found');
  }

  // Actualizar la fase
  const phase = await prisma.projectPhase.update({
    where: { id },
    data: {
      ...(phaseData.name && { name: phaseData.name }),
      ...(phaseData.description !== undefined && { description: phaseData.description }),
      ...(phaseData.startDate !== undefined && { startDate: phaseData.startDate }),
      ...(phaseData.endDate !== undefined && { endDate: phaseData.endDate }),
      ...(phaseData.order !== undefined && { order: phaseData.order })
    },
    include: {
      project: true,
      tasks: true
    }
  });

  return phase;
}

export async function deleteProjectPhase(id: string) {
  // Verificar que la fase existe
  const existingPhase = await prisma.projectPhase.findUnique({
    where: { id }
  });

  if (!existingPhase) {
    throw new Error('Project phase not found');
  }

  // Eliminar la fase
  await prisma.projectPhase.delete({
    where: { id }
  });

  return { id };
}

export async function getProjectPhases(projectId: string) {
  // Verificar que el proyecto existe
  const project = await prisma.project.findUnique({
    where: { id: projectId }
  });

  if (!project) {
    throw new Error('Project not found');
  }

  // Obtener las fases del proyecto
  const phases = await prisma.projectPhase.findMany({
    where: {
      projectId
    },
    orderBy: {
      order: 'asc'
    },
    include: {
      tasks: {
        include: {
          assignedTo: true
        }
      }
    }
  });

  return phases;
}
