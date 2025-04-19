import { Request, Response } from 'express';
import * as authService from '../services/authService';

export const register = async (req: Request, res: Response) => {
  try {
    const userData = req.body;

    const result = await authService.registerUser(userData);

    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'User already exists') {
        return res.status(400).json({
          success: false,
          error: error.message
        });
      }
    }

    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      error: 'Error al registrar usuario'
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const credentials = req.body;

    const result = await authService.loginUser(credentials);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Invalid credentials') {
        return res.status(401).json({
          success: false,
          error: error.message
        });
      }
    }

    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Error al iniciar sesión'
    });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    // El userId viene del middleware de autenticación
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no autenticado'
      });
    }

    const user = await authService.getUserProfile(userId);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener perfil'
    });
  }
};

// Método para autenticación con OAuth
export const oauthCallback = async (req: Request, res: Response) => {
  try {
    const { provider, oauthId, email, name, image } = req.body;

    if (!provider || !oauthId || !email || !name) {
      return res.status(400).json({
        success: false,
        error: 'Datos insuficientes para la autenticación OAuth'
      });
    }

    const result = await authService.authenticateWithOAuth(
      provider,
      oauthId,
      email,
      name,
      image
    );

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('OAuth error:', error);
    res.status(500).json({
      success: false,
      error: 'Error en la autenticación OAuth'
    });
  }
};
