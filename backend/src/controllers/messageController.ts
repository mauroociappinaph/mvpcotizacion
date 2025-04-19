import { Request, Response } from 'express';
import * as messageService from '../services/messageService';

// Controladores de canales
export const createChannel = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no autenticado'
      });
    }

    const channelData = req.body;

    const channel = await messageService.createChannel(channelData, userId);

    res.status(201).json({
      success: true,
      data: channel
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Team not found') {
        return res.status(404).json({
          success: false,
          error: 'Equipo no encontrado'
        });
      }

      if (error.message === 'User is not a member of the team') {
        return res.status(403).json({
          success: false,
          error: 'No eres miembro de este equipo'
        });
      }
    }

    console.error('Create channel error:', error);
    res.status(500).json({
      success: false,
      error: 'Error al crear canal'
    });
  }
};

export const updateChannel = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no autenticado'
      });
    }

    const channelId = req.params.channelId;
    const channelData = req.body;

    const channel = await messageService.updateChannel(channelId, channelData, userId);

    res.status(200).json({
      success: true,
      data: channel
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Channel not found') {
        return res.status(404).json({
          success: false,
          error: 'Canal no encontrado'
        });
      }

      if (error.message === 'Only team admins can update channels') {
        return res.status(403).json({
          success: false,
          error: 'Solo los administradores pueden actualizar canales'
        });
      }
    }

    console.error('Update channel error:', error);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar canal'
    });
  }
};

export const deleteChannel = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no autenticado'
      });
    }

    const channelId = req.params.channelId;

    await messageService.deleteChannel(channelId, userId);

    res.status(200).json({
      success: true,
      message: 'Canal eliminado correctamente'
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Channel not found') {
        return res.status(404).json({
          success: false,
          error: 'Canal no encontrado'
        });
      }

      if (error.message === 'Only team admins can delete channels') {
        return res.status(403).json({
          success: false,
          error: 'Solo los administradores pueden eliminar canales'
        });
      }
    }

    console.error('Delete channel error:', error);
    res.status(500).json({
      success: false,
      error: 'Error al eliminar canal'
    });
  }
};

export const getTeamChannels = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no autenticado'
      });
    }

    const teamId = req.params.teamId;

    const channels = await messageService.getTeamChannels(teamId, userId);

    res.status(200).json({
      success: true,
      data: channels
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Team not found') {
        return res.status(404).json({
          success: false,
          error: 'Equipo no encontrado'
        });
      }

      if (error.message === 'User is not a member of the team') {
        return res.status(403).json({
          success: false,
          error: 'No eres miembro de este equipo'
        });
      }
    }

    console.error('Get team channels error:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener canales del equipo'
    });
  }
};

// Controladores de mensajes
export const createMessage = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no autenticado'
      });
    }

    const messageData = req.body;

    const message = await messageService.createMessage(messageData, userId);

    // Emitir evento de Socket.io (se hará en el cliente o en una capa intermedia)

    res.status(201).json({
      success: true,
      data: message
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Channel not found') {
        return res.status(404).json({
          success: false,
          error: 'Canal no encontrado'
        });
      }

      if (error.message === 'User is not a member of the channel team') {
        return res.status(403).json({
          success: false,
          error: 'No eres miembro del equipo de este canal'
        });
      }
    }

    console.error('Create message error:', error);
    res.status(500).json({
      success: false,
      error: 'Error al crear mensaje'
    });
  }
};

export const updateMessage = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no autenticado'
      });
    }

    const messageId = req.params.messageId;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        error: 'Se requiere contenido para el mensaje'
      });
    }

    const message = await messageService.updateMessage(messageId, content, userId);

    // Emitir evento de Socket.io (se hará en el cliente o en una capa intermedia)

    res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Message not found') {
        return res.status(404).json({
          success: false,
          error: 'Mensaje no encontrado'
        });
      }

      if (error.message === 'Only the message author can update it') {
        return res.status(403).json({
          success: false,
          error: 'Solo el autor puede actualizar el mensaje'
        });
      }
    }

    console.error('Update message error:', error);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar mensaje'
    });
  }
};

export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no autenticado'
      });
    }

    const messageId = req.params.messageId;

    await messageService.deleteMessage(messageId, userId);

    // Emitir evento de Socket.io (se hará en el cliente o en una capa intermedia)

    res.status(200).json({
      success: true,
      message: 'Mensaje eliminado correctamente'
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Message not found') {
        return res.status(404).json({
          success: false,
          error: 'Mensaje no encontrado'
        });
      }

      if (error.message === 'You do not have permission to delete this message') {
        return res.status(403).json({
          success: false,
          error: 'No tienes permiso para eliminar este mensaje'
        });
      }
    }

    console.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      error: 'Error al eliminar mensaje'
    });
  }
};

export const getChannelMessages = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no autenticado'
      });
    }

    const channelId = req.params.channelId;
    const { limit, before, after } = req.query;

    const options = {
      limit: limit ? parseInt(limit as string) : undefined,
      before: before as string | undefined,
      after: after as string | undefined
    };

    const messages = await messageService.getChannelMessages(channelId, userId, options);

    res.status(200).json({
      success: true,
      data: messages
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Channel not found') {
        return res.status(404).json({
          success: false,
          error: 'Canal no encontrado'
        });
      }

      if (error.message === 'User is not a member of the channel team') {
        return res.status(403).json({
          success: false,
          error: 'No eres miembro del equipo de este canal'
        });
      }
    }

    console.error('Get channel messages error:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener mensajes del canal'
    });
  }
};
