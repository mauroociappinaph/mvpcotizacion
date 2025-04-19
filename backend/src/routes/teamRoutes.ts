import express from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { authenticate } from '../middleware/authMiddleware';
import {
  authorizeTeamAdmin,
  authorizeTeamMember,
  getTeamIdFromParams
} from '../middleware/authorizationMiddleware';
import {
  createTeam,
  getTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
  addTeamMember,
  updateTeamMember,
  removeTeamMember,
  getTeamMembers
} from '../controllers/teamController';

const router = express.Router();

// Requiere autenticación para todas las rutas
router.use(authenticate as express.RequestHandler);

// Rutas para equipos
router.post('/', asyncHandler(createTeam));
router.get('/', asyncHandler(getTeams));
router.get('/:teamId', authorizeTeamMember(getTeamIdFromParams) as express.RequestHandler, asyncHandler(getTeamById));
router.put('/:teamId', authorizeTeamAdmin(getTeamIdFromParams) as express.RequestHandler, asyncHandler(updateTeam));
router.delete('/:teamId', authorizeTeamAdmin(getTeamIdFromParams) as express.RequestHandler, asyncHandler(deleteTeam));

// Rutas para miembros del equipo
router.get('/:teamId/members', authorizeTeamMember(getTeamIdFromParams) as express.RequestHandler, asyncHandler(getTeamMembers));
router.post('/:teamId/members', authorizeTeamAdmin(getTeamIdFromParams) as express.RequestHandler, asyncHandler(addTeamMember));
router.put('/:teamId/members/:memberId', authorizeTeamAdmin(getTeamIdFromParams) as express.RequestHandler, asyncHandler(updateTeamMember));
router.delete('/:teamId/members/:userId', authorizeTeamAdmin(getTeamIdFromParams) as express.RequestHandler, asyncHandler(removeTeamMember));

export default router;
