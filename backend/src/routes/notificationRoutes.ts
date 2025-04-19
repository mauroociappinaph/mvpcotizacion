import express from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { authenticate } from '../middleware/authMiddleware';
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification
} from '../controllers/notificationController';

const router = express.Router();

// Requiere autenticación para todas las rutas
router.use(authenticate as express.RequestHandler);

// Rutas para notificaciones
router.get('/', asyncHandler(getUserNotifications));
router.put('/:notificationId/read', asyncHandler(markNotificationAsRead));
router.put('/read-all', asyncHandler(markAllNotificationsAsRead));
router.delete('/:notificationId', asyncHandler(deleteNotification));

export default router;
