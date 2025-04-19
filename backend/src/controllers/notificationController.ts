import { Request, Response } from 'express';
import * as notificationService from '../services/notificationService';

export const getUserNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no autenticado'
      });
    }

    const { limit, offset, unreadOnly, types } = req.query;

    const options = {
      limit: limit ? parseInt(limit as string) : undefined,
      offset: offset ? parseInt(offset as string) : undefined,
      unreadOnly: unreadOnly === 'true',
      types: types ? (Array.isArray(types) ? types.map(t => String(t)) : [String(types)]) : undefined
    };

    const notifications = await notificationService.getUserNotifications(userId, options);

    res.status(200).json({
      success: true,
      data: notifications
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener notificaciones'
    });
  }
};

export const markNotificationAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no autenticado'
      });
    }

    const notificationId = req.params.notificationId;

    const notification = await notificationService.markNotificationAsRead(notificationId, userId);

    res.status(200).json({
      success: true,
      data: notification
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Notification not found') {
        return res.status(404).json({
          success: false,
          error: 'Notificación no encontrada'
        });
      }

      if (error.message === 'You do not have permission to update this notification') {
        return res.status(403).json({
          success: false,
          error: 'No tienes permiso para actualizar esta notificación'
        });
      }
    }

    console.error('Mark notification as read error:', error);
    res.status(500).json({
      success: false,
      error: 'Error al marcar notificación como leída'
    });
  }
};

export const markAllNotificationsAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no autenticado'
      });
    }

    await notificationService.markAllNotificationsAsRead(userId);

    res.status(200).json({
      success: true,
      message: 'Todas las notificaciones marcadas como leídas'
    });
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    res.status(500).json({
      success: false,
      error: 'Error al marcar todas las notificaciones como leídas'
    });
  }
};

export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no autenticado'
      });
    }

    const notificationId = req.params.notificationId;

    await notificationService.deleteNotification(notificationId, userId);

    res.status(200).json({
      success: true,
      message: 'Notificación eliminada correctamente'
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Notification not found') {
        return res.status(404).json({
          success: false,
          error: 'Notificación no encontrada'
        });
      }

      if (error.message === 'You do not have permission to delete this notification') {
        return res.status(403).json({
          success: false,
          error: 'No tienes permiso para eliminar esta notificación'
        });
      }
    }

    console.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      error: 'Error al eliminar notificación'
    });
  }
};
