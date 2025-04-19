import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Esquemas de validación
export const notificationSchema = z.object({
  type: z.enum([
    'task_assigned',
    'task_updated',
    'task_due_soon',
    'message_received',
    'project_updated',
    'team_joined',
    'team_left'
  ]),
  content: z.string(),
  userId: z.string()
});

// Funciones principales
export async function createNotification(data: z.infer<typeof notificationSchema>) {
  const validatedData = notificationSchema.parse(data);

  const notification = await prisma.notification.create({
    data: {
      type: validatedData.type,
      content: validatedData.content,
      user: { connect: { id: validatedData.userId } }
    }
  });

  return notification;
}

export async function markNotificationAsRead(id: string, userId: string) {
  // Verificar que la notificación existe y pertenece al usuario
  const notification = await prisma.notification.findUnique({
    where: { id },
    include: { user: true }
  });

  if (!notification) {
    throw new Error('Notification not found');
  }

  if (notification.userId !== userId) {
    throw new Error('You do not have permission to update this notification');
  }

  // Marcar como leída
  const updatedNotification = await prisma.notification.update({
    where: { id },
    data: { isRead: true }
  });

  return updatedNotification;
}

export async function markAllNotificationsAsRead(userId: string) {
  await prisma.notification.updateMany({
    where: {
      userId,
      isRead: false
    },
    data: {
      isRead: true
    }
  });

  return { success: true };
}

export async function deleteNotification(id: string, userId: string) {
  // Verificar que la notificación existe y pertenece al usuario
  const notification = await prisma.notification.findUnique({
    where: { id }
  });

  if (!notification) {
    throw new Error('Notification not found');
  }

  if (notification.userId !== userId) {
    throw new Error('You do not have permission to delete this notification');
  }

  // Eliminar la notificación
  await prisma.notification.delete({
    where: { id }
  });

  return { id };
}

export async function getUserNotifications(
  userId: string,
  options: {
    limit?: number;
    offset?: number;
    unreadOnly?: boolean;
    types?: string[]
  } = {}
) {
  // Construir la consulta
  const where: any = { userId };

  if (options.unreadOnly) {
    where.isRead = false;
  }

  if (options.types && options.types.length > 0) {
    where.type = { in: options.types };
  }

  // Obtener las notificaciones
  const notifications = await prisma.notification.findMany({
    where,
    orderBy: {
      createdAt: 'desc'
    },
    skip: options.offset || 0,
    take: options.limit || 20
  });

  // Obtener el conteo total
  const total = await prisma.notification.count({ where });

  // Conteo de no leídas
  const unreadCount = await prisma.notification.count({
    where: {
      userId,
      isRead: false
    }
  });

  return {
    notifications,
    total,
    unreadCount
  };
}

// Funciones de generación de notificaciones basadas en eventos
export async function notifyTaskAssigned(taskId: string, assignedToId: string, assignedById: string) {
  // Obtener información de la tarea y los usuarios
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      assignedTo: true,
      createdBy: true
    }
  });

  if (!task || !task.assignedTo) {
    throw new Error('Task or assigned user not found');
  }

  // Generar el contenido de la notificación
  const content = `${task.createdBy.name} te asignó la tarea "${task.title}"`;

  // Crear la notificación
  return await createNotification({
    type: 'task_assigned',
    content,
    userId: assignedToId
  });
}

export async function notifyTaskUpdated(taskId: string) {
  // Obtener información de la tarea y usuarios interesados
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      assignedTo: true,
      createdBy: true
    }
  });

  if (!task) {
    throw new Error('Task not found');
  }

  // No notificar si no hay asignado
  if (!task.assignedToId) {
    return null;
  }

  // No notificar al mismo usuario que creó la tarea
  if (task.assignedToId === task.createdById) {
    return null;
  }

  // Generar el contenido de la notificación
  const content = `La tarea "${task.title}" ha sido actualizada`;

  // Crear la notificación para el usuario asignado
  return await createNotification({
    type: 'task_updated',
    content,
    userId: task.assignedToId
  });
}

export async function notifyTaskDueSoon() {
  // Obtener tareas que vencen en las próximas 24 horas y no están completadas
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const today = new Date();

  const tasks = await prisma.task.findMany({
    where: {
      dueDate: {
        gte: today,
        lte: tomorrow
      },
      status: {
        not: 'completed'
      },
      assignedToId: {
        not: null
      }
    },
    include: {
      assignedTo: true
    }
  });

  // Enviar notificaciones para cada tarea
  const notifications = [];

  for (const task of tasks) {
    if (task.assignedToId) {
      const content = `Tu tarea "${task.title}" vence pronto`;

      const notification = await createNotification({
        type: 'task_due_soon',
        content,
        userId: task.assignedToId
      });

      notifications.push(notification);
    }
  }

  return notifications;
}

export async function notifyMessageReceived(messageId: string, excludeUserId: string) {
  // Obtener el mensaje y los miembros del canal
  const message = await prisma.message.findUnique({
    where: { id: messageId },
    include: {
      sender: true,
      channel: {
        include: {
          team: {
            include: {
              members: {
                include: {
                  user: true
                }
              }
            }
          }
        }
      }
    }
  });

  if (!message) {
    throw new Error('Message not found');
  }

  // Obtener los usuarios a notificar (todos los miembros del equipo excepto quien envió)
  const membersToNotify = message.channel.team.members.filter(
    (member: { userId: string }) => member.userId !== excludeUserId
  );

  // Generar notificaciones
  const notifications = [];

  const content = `${message.sender.name} envió un mensaje en #${message.channel.name}`;

  for (const member of membersToNotify) {
    const notification = await createNotification({
      type: 'message_received',
      content,
      userId: member.userId
    });

    notifications.push(notification);
  }

  return notifications;
}

export async function notifyProjectUpdated(projectId: string, updatedById: string) {
  // Obtener el proyecto y los miembros del equipo
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      team: {
        include: {
          members: {
            include: {
              user: true
            }
          }
        }
      }
    }
  });

  if (!project) {
    throw new Error('Project not found');
  }

  // Obtener los usuarios a notificar (todos los miembros del equipo excepto quien actualizó)
  const membersToNotify = project.team.members.filter(
    (member: { userId: string }) => member.userId !== updatedById
  );

  // Generar notificaciones
  const notifications = [];

  const content = `El proyecto "${project.name}" ha sido actualizado`;

  for (const member of membersToNotify) {
    const notification = await createNotification({
      type: 'project_updated',
      content,
      userId: member.userId
    });

    notifications.push(notification);
  }

  return notifications;
}

export async function notifyTeamJoined(teamId: string, userId: string, addedById: string) {
  // Obtener el equipo y el usuario
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: {
      members: {
        include: {
          user: true
        }
      }
    }
  });

  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!team || !user) {
    throw new Error('Team or user not found');
  }

  // Notificar al usuario que fue agregado
  const userNotification = await createNotification({
    type: 'team_joined',
    content: `Has sido agregado al equipo "${team.name}"`,
    userId
  });

  // Notificar a los demás miembros del equipo
  const notifications = [userNotification];

  const content = `${user.name} se ha unido al equipo`;

  const members = team.members.filter((member: { userId: string }) =>
    member.userId !== userId && member.userId !== addedById
  );

  for (const member of members) {
    const notification = await createNotification({
      type: 'team_joined',
      content,
      userId: member.userId
    });

    notifications.push(notification);
  }

  return notifications;
}
