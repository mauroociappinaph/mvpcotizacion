import express from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { authenticate } from '../middleware/authMiddleware';
import {
  authorizeTeamMember,
  getTeamIdFromParams
} from '../middleware/authorizationMiddleware';
import {
  createChannel,
  updateChannel,
  deleteChannel,
  getTeamChannels,
  createMessage,
  updateMessage,
  deleteMessage,
  getChannelMessages
} from '../controllers/messageController';

const router = express.Router();

// Requiere autenticación para todas las rutas
router.use(authenticate as express.RequestHandler);

// Rutas para canales
router.post('/channels', asyncHandler(createChannel));
router.put('/channels/:channelId', asyncHandler(updateChannel));
router.delete('/channels/:channelId', asyncHandler(deleteChannel));
router.get('/teams/:teamId/channels', authorizeTeamMember(getTeamIdFromParams) as express.RequestHandler, asyncHandler(getTeamChannels));

// Rutas para mensajes
router.post('/messages', asyncHandler(createMessage));
router.put('/messages/:messageId', asyncHandler(updateMessage));
router.delete('/messages/:messageId', asyncHandler(deleteMessage));
router.get('/channels/:channelId/messages', asyncHandler(getChannelMessages));

export default router;
