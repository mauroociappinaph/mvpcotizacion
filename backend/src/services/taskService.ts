import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Esquemas de validación
export const taskSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  priority: z.enum(['high', 'medium', 'low']),
  status: z.enum(['todo', 'in-progress', 'completed', 'blocked']),
  dueDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
  projectId: z.string().optional(),
  phaseId: z.string().optional(),
  assignedToId: z.string().optional(),
  parentTaskId: z.string().optional()
});

export async function createTask(taskData: z.infer<typeof taskSchema>, userId: string) {
  const validatedData = taskSchema.parse(taskData);

  const task = await prisma.task.create({
    data: {
      ...validatedData,
      createdBy: { connect: { id: userId } },
      project: validatedData.projectId ? { connect: { id: validatedData.projectId } } : undefined,
      phase: validatedData.phaseId ? { connect: { id: validatedData.phaseId } } : undefined,
      assignedTo: validatedData.assignedToId ? { connect: { id: validatedData.assignedToId } } : undefined,
      parentTask: validatedData.parentTaskId ? { connect: { id: validatedData.parentTaskId } } : undefined
    },
    include: {
      assignedTo: true,
      project: true,
      phase: true,
      parentTask: true
    }
  });

  return task;
}

export async function updateTask(id: string, taskData: Partial<z.infer<typeof taskSchema>>, userId: string) {
  // Verificar que la tarea existe
  const existingTask = await prisma.task.findUnique({
    where: { id },
    include: { createdBy: true }
  });

  if (!existingTask) {
    throw new Error('Task not found');
  }

  // Actualizar la tarea
  const task = await prisma.task.update({
    where: { id },
    data: {
      ...(taskData.title && { title: taskData.title }),
      ...(taskData.description !== undefined && { description: taskData.description }),
      ...(taskData.priority && { priority: taskData.priority }),
      ...(taskData.status && { status: taskData.status }),
      ...(taskData.dueDate !== undefined && { dueDate: taskData.dueDate }),
      ...(taskData.projectId && { project: { connect: { id: taskData.projectId } } }),
      ...(taskData.phaseId && { phase: { connect: { id: taskData.phaseId } } }),
      ...(taskData.assignedToId && { assignedTo: { connect: { id: taskData.assignedToId } } }),
      ...(taskData.parentTaskId && { parentTask: { connect: { id: taskData.parentTaskId } } })
    },
    include: {
      assignedTo: true,
      project: true,
      phase: true,
      parentTask: true,
      subTasks: true
    }
  });

  return task;
}

export async function deleteTask(id: string) {
  // Verificar que la tarea existe
  const existingTask = await prisma.task.findUnique({
    where: { id }
  });

  if (!existingTask) {
    throw new Error('Task not found');
  }

  // Eliminar la tarea
  await prisma.task.delete({
    where: { id }
  });

  return { id };
}

export async function getTaskById(id: string) {
  const task = await prisma.task.findUnique({
    where: { id },
    include: {
      assignedTo: true,
      createdBy: true,
      project: true,
      phase: true,
      parentTask: true,
      subTasks: true
    }
  });

  if (!task) {
    throw new Error('Task not found');
  }

  return task;
}

export async function getTasks(filters: {
  userId?: string;
  assignedToId?: string;
  projectId?: string;
  teamId?: string;
  status?: string;
  priority?: string;
  search?: string;
}) {
  // Construir condiciones de filtrado
  const where: any = {};

  if (filters.userId) {
    where.createdById = filters.userId;
  }

  if (filters.assignedToId) {
    where.assignedToId = filters.assignedToId;
  }

  if (filters.projectId) {
    where.projectId = filters.projectId;
  }

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.priority) {
    where.priority = filters.priority;
  }

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search } },
      { description: { contains: filters.search } }
    ];
  }

  // Filtrar por equipo (más complejo, requiere joins)
  if (filters.teamId) {
    const tasks = await prisma.task.findMany({
      where: {
        project: {
          teamId: filters.teamId
        }
      },
      include: {
        assignedTo: true,
        createdBy: true,
        project: true,
        phase: true,
        parentTask: true
      }
    });
    return tasks;
  }

  // Consulta normal sin filtro de equipo
  const tasks = await prisma.task.findMany({
    where,
    include: {
      assignedTo: true,
      createdBy: true,
      project: true,
      phase: true,
      parentTask: true
    }
  });

  return tasks;
}

// Métodos para manejar subtareas
export async function getSubtasks(taskId: string) {
  const subtasks = await prisma.task.findMany({
    where: {
      parentTaskId: taskId
    },
    include: {
      assignedTo: true
    }
  });

  return subtasks;
}

export async function addSubtask(parentTaskId: string, taskData: z.infer<typeof taskSchema>, userId: string) {
  // Verificar que la tarea padre existe
  const parentTask = await prisma.task.findUnique({
    where: { id: parentTaskId }
  });

  if (!parentTask) {
    throw new Error('Parent task not found');
  }

  // Crear la subtarea
  const subtask = await prisma.task.create({
    data: {
      ...taskData,
      createdBy: { connect: { id: userId } },
      parentTask: { connect: { id: parentTaskId } },
      // Heredar proyecto y fase de la tarea padre
      project: parentTask.projectId ? { connect: { id: parentTask.projectId } } : undefined,
      phase: parentTask.phaseId ? { connect: { id: parentTask.phaseId } } : undefined,
      assignedTo: taskData.assignedToId ? { connect: { id: taskData.assignedToId } } : undefined
    },
    include: {
      assignedTo: true,
      parentTask: true
    }
  });

  return subtask;
}
