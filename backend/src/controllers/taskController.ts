import { Request, Response } from 'express';
import { prisma } from '../index';

// Get all tasks
export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

// Get a specific task by ID
export const getTaskById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        phase: true,
        subTasks: true,
      },
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
};

// Create a new task
export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, priority, status, dueDate, projectId, phaseId, assignedToId, parentTaskId } = req.body;

    // In a real app, you would get the user ID from the authenticated session
    const createdById = req.body.createdById || 'user1';

    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        priority,
        status,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        project: projectId ? { connect: { id: projectId } } : undefined,
        phase: phaseId ? { connect: { id: phaseId } } : undefined,
        assignedTo: assignedToId ? { connect: { id: assignedToId } } : undefined,
        parentTask: parentTaskId ? { connect: { id: parentTaskId } } : undefined,
        createdBy: { connect: { id: createdById } },
      },
    });

    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

// Update an existing task
export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, priority, status, dueDate, projectId, phaseId, assignedToId, parentTaskId } = req.body;

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        priority,
        status,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        project: projectId ? { connect: { id: projectId } } : undefined,
        phase: phaseId ? { connect: { id: phaseId } } : undefined,
        assignedTo: assignedToId ? { connect: { id: assignedToId } } : undefined,
        parentTask: parentTaskId ? { connect: { id: parentTaskId } } : undefined,
      },
    });

    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

// Delete a task
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.task.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};
