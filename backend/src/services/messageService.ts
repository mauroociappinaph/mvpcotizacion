import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Esquemas de validación
export const messageSchema = z.object({
  content: z.string().min(1, { message: "Message content is required" }),
  channelId: z.string(),
  isTemporary: z.boolean().optional().default(false),
  scheduledFor: z.string().optional().transform(val => val ? new Date(val) : undefined)
});

export const channelSchema = z.object({
  name: z.string().min(1, { message: "Channel name is required" }),
  description: z.string().optional(),
  type: z.enum(['direct', 'group', 'project']),
  teamId: z.string()
});

// Operaciones de Mensajes
export async function createMessage(messageData: z.infer<typeof messageSchema>, userId: string) {
  const validatedData = messageSchema.parse(messageData);

  // Verificar que el canal existe
  const channel = await prisma.channel.findUnique({
    where: { id: validatedData.channelId },
    include: {
      team: {
        include: {
          members: true
        }
      }
    }
  });

  if (!channel) {
    throw new Error('Channel not found');
  }

  // Verificar que el usuario pertenece al equipo del canal
  const isMember = channel.team.members.some((member: { userId: string }) => member.userId === userId);

  if (!isMember) {
    throw new Error('User is not a member of the channel team');
  }

  // Crear el mensaje
  const message = await prisma.message.create({
    data: {
      content: validatedData.content,
      isTemporary: validatedData.isTemporary || false,
      scheduledFor: validatedData.scheduledFor,
      channel: { connect: { id: validatedData.channelId } },
      sender: { connect: { id: userId } }
    },
    include: {
      sender: true,
      channel: true
    }
  });

  return message;
}

export async function updateMessage(id: string, content: string, userId: string) {
  // Verificar que el mensaje existe
  const existingMessage = await prisma.message.findUnique({
    where: { id },
    include: {
      sender: true
    }
  });

  if (!existingMessage) {
    throw new Error('Message not found');
  }

  // Verificar que el usuario es el autor del mensaje
  if (existingMessage.senderId !== userId) {
    throw new Error('Only the message author can update it');
  }

  // Actualizar el mensaje
  const message = await prisma.message.update({
    where: { id },
    data: { content },
    include: {
      sender: true,
      channel: true
    }
  });

  return message;
}

export async function deleteMessage(id: string, userId: string) {
  // Verificar que el mensaje existe
  const existingMessage = await prisma.message.findUnique({
    where: { id },
    include: {
      sender: true,
      channel: {
        include: {
          team: {
            include: {
              members: true
            }
          }
        }
      }
    }
  });

  if (!existingMessage) {
    throw new Error('Message not found');
  }

  // Verificar si el usuario es el autor del mensaje o admin del equipo
  const isAuthor = existingMessage.senderId === userId;
  const isAdmin = existingMessage.channel.team.members.some(
    (member: { userId: string; role: string }) => member.userId === userId && member.role === 'admin'
  );

  if (!isAuthor && !isAdmin) {
    throw new Error('You do not have permission to delete this message');
  }

  // Eliminar el mensaje
  await prisma.message.delete({
    where: { id }
  });

  return { id };
}

export async function getMessageById(id: string) {
  const message = await prisma.message.findUnique({
    where: { id },
    include: {
      sender: true,
      channel: true
    }
  });

  if (!message) {
    throw new Error('Message not found');
  }

  return message;
}

export async function getChannelMessages(
  channelId: string,
  userId: string,
  options: { limit?: number; before?: string; after?: string } = {}
) {
  // Verificar que el canal existe
  const channel = await prisma.channel.findUnique({
    where: { id: channelId },
    include: {
      team: {
        include: {
          members: true
        }
      }
    }
  });

  if (!channel) {
    throw new Error('Channel not found');
  }

  // Verificar que el usuario pertenece al equipo del canal
  const isMember = channel.team.members.some((member: { userId: string }) => member.userId === userId);

  if (!isMember) {
    throw new Error('User is not a member of the channel team');
  }

  // Construir consulta para paginación
  const where: any = { channelId };

  if (options.before) {
    const beforeMessage = await prisma.message.findUnique({
      where: { id: options.before }
    });

    if (beforeMessage) {
      where.createdAt = { lt: beforeMessage.createdAt };
    }
  }

  if (options.after) {
    const afterMessage = await prisma.message.findUnique({
      where: { id: options.after }
    });

    if (afterMessage) {
      where.createdAt = { gt: afterMessage.createdAt };
    }
  }

  // Obtener mensajes del canal
  const messages = await prisma.message.findMany({
    where,
    orderBy: {
      createdAt: 'desc'
    },
    take: options.limit || 50,
    include: {
      sender: true
    }
  });

  return messages.reverse(); // Devolver en orden cronológico
}

// Operaciones de Canales
export async function createChannel(channelData: z.infer<typeof channelSchema>, userId: string) {
  const validatedData = channelSchema.parse(channelData);

  // Verificar que el equipo existe
  const team = await prisma.team.findUnique({
    where: { id: validatedData.teamId },
    include: {
      members: true
    }
  });

  if (!team) {
    throw new Error('Team not found');
  }

  // Verificar que el usuario pertenece al equipo
  const isMember = team.members.some((member: { userId: string }) => member.userId === userId);

  if (!isMember) {
    throw new Error('User is not a member of the team');
  }

  // Crear el canal
  const channel = await prisma.channel.create({
    data: {
      name: validatedData.name,
      description: validatedData.description,
      type: validatedData.type,
      team: { connect: { id: validatedData.teamId } }
    },
    include: {
      team: true
    }
  });

  return channel;
}

export async function updateChannel(id: string, channelData: Partial<z.infer<typeof channelSchema>>, userId: string) {
  // Verificar que el canal existe
  const existingChannel = await prisma.channel.findUnique({
    where: { id },
    include: {
      team: {
        include: {
          members: true
        }
      }
    }
  });

  if (!existingChannel) {
    throw new Error('Channel not found');
  }

  // Verificar que el usuario es admin del equipo
  const isAdmin = existingChannel.team.members.some(
    (member: { userId: string; role: string }) => member.userId === userId && member.role === 'admin'
  );

  if (!isAdmin) {
    throw new Error('Only team admins can update channels');
  }

  // Actualizar el canal
  const channel = await prisma.channel.update({
    where: { id },
    data: {
      ...(channelData.name && { name: channelData.name }),
      ...(channelData.description !== undefined && { description: channelData.description }),
      ...(channelData.type && { type: channelData.type })
    },
    include: {
      team: true
    }
  });

  return channel;
}

export async function deleteChannel(id: string, userId: string) {
  // Verificar que el canal existe
  const existingChannel = await prisma.channel.findUnique({
    where: { id },
    include: {
      team: {
        include: {
          members: true
        }
      }
    }
  });

  if (!existingChannel) {
    throw new Error('Channel not found');
  }

  // Verificar que el usuario es admin del equipo
  const isAdmin = existingChannel.team.members.some(
    (member: { userId: string; role: string }) => member.userId === userId && member.role === 'admin'
  );

  if (!isAdmin) {
    throw new Error('Only team admins can delete channels');
  }

  // Eliminar el canal
  await prisma.channel.delete({
    where: { id }
  });

  return { id };
}

export async function getTeamChannels(teamId: string, userId: string) {
  // Verificar que el equipo existe
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: {
      members: true
    }
  });

  if (!team) {
    throw new Error('Team not found');
  }

  // Verificar que el usuario pertenece al equipo
  const isMember = team.members.some((member: { userId: string }) => member.userId === userId);

  if (!isMember) {
    throw new Error('User is not a member of the team');
  }

  // Obtener los canales del equipo
  const channels = await prisma.channel.findMany({
    where: {
      teamId
    },
    include: {
      _count: {
        select: {
          messages: true
        }
      }
    }
  });

  return channels;
}

// Funciones para mensajes programados
export async function getScheduledMessages() {
  const now = new Date();

  const scheduledMessages = await prisma.message.findMany({
    where: {
      scheduledFor: {
        lte: now
      },
      isTemporary: true
    },
    include: {
      sender: true,
      channel: true
    }
  });

  return scheduledMessages;
}

export async function markMessageAsDelivered(id: string) {
  return await prisma.message.update({
    where: { id },
    data: {
      isTemporary: false
    }
  });
}
