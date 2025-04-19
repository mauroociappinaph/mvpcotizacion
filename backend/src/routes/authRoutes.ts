import express from 'express';
import { login, register, getProfile, oauthCallback } from '../controllers/authController';
import { asyncHandler } from '../utils/asyncHandler';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

// Registro
router.post('/register', asyncHandler(register));

// Login
router.post('/login', asyncHandler(login));

// OAuth callback
router.post('/oauth', asyncHandler(oauthCallback));

// Obtener perfil del usuario actual (requiere autenticación)
router.get('/profile', authenticate as express.RequestHandler, asyncHandler(getProfile));

export default router;
