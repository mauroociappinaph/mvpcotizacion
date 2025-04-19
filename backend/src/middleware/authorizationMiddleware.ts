import { Request, Response, NextFunction } from 'express';
import { prisma } from '../index';

// Extender la interfaz Request para incluir el usuario
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
      };
    }
  }
}

/**
 * Middleware para verificar el rol del usuario en un equipo
 * @param requiredRoles Roles permitidos para acceder al recurso
 * @param getTeamIdFromRequest Función para extraer el ID del equipo de la solicitud
 */
export function authorizeTeamRole(
  requiredRoles: string[],
  getTeamIdFromRequest: (req: Request) => string
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Verificar que el usuario está autenticado
      if (!req.user || !req.user.userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const userId = req.user.userId;
      const teamId = getTeamIdFromRequest(req);

      if (!teamId) {
        return res.status(400).json({ error: 'Team ID is required' });
      }

      // Verificar si el usuario tiene el rol requerido en el equipo
      const teamMember = await prisma.teamMember.findFirst({
        where: {
          userId,
          teamId
        }
      });

      if (!teamMember) {
        return res.status(403).json({ error: 'You are not a member of this team' });
      }

      if (!requiredRoles.includes(teamMember.role)) {
        return res.status(403).json({
          error: `This action requires one of these roles: ${requiredRoles.join(', ')}`
        });
      }

      // El usuario tiene el rol requerido, continuar
      next();
    } catch (error) {
      console.error('Authorization error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}

/**
 * Middleware para verificar si el usuario es dueño del recurso
 * @param getResourceOwnerId Función para obtener el ID del dueño del recurso
 */
export function authorizeResourceOwner(
  getResourceOwnerId: (req: Request) => Promise<string | null>
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Verificar que el usuario está autenticado
      if (!req.user || !req.user.userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const userId = req.user.userId;
      const ownerId = await getResourceOwnerId(req);

      if (!ownerId) {
        return res.status(404).json({ error: 'Resource not found' });
      }

      if (ownerId !== userId) {
        return res.status(403).json({ error: 'You do not have permission to access this resource' });
      }

      // El usuario es dueño del recurso, continuar
      next();
    } catch (error) {
      console.error('Authorization error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}

/**
 * Middleware para verificar si el usuario es administrador a nivel de aplicación
 * @returns Middleware
 */
export function authorizeAdmin() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Verificar que el usuario está autenticado
      if (!req.user || !req.user.userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const userId = req.user.userId;

      // Verificar si el usuario es un administrador del sistema
      // Esto es solo un ejemplo, podrías tener una tabla separada para roles globales o una columna isAdmin en User
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      // Comprobar si el usuario tiene el rol de administrador global
      // Esta lógica puede cambiar según cómo implementes los roles de administrador
      const isAdmin = false; // Implementar tu lógica aquí

      if (!isAdmin) {
        return res.status(403).json({ error: 'Administrator privileges required' });
      }

      // El usuario es administrador, continuar
      next();
    } catch (error) {
      console.error('Authorization error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}

/**
 * Ayudantes para extracción de ID desde diferentes partes de la solicitud
 */
export const getTeamIdFromParams = (req: Request): string => req.params.teamId;
export const getTeamIdFromBody = (req: Request): string => req.body.teamId;
export const getTeamIdFromQuery = (req: Request): string => req.query.teamId as string;

/**
 * Middleware para verificar si el usuario es miembro del equipo (cualquier rol)
 * @param getTeamIdFromRequest Función para extraer el ID del equipo
 */
export function authorizeTeamMember(getTeamIdFromRequest: (req: Request) => string) {
  return authorizeTeamRole(['admin', 'member', 'guest'], getTeamIdFromRequest);
}

/**
 * Middleware para verificar si el usuario es administrador del equipo
 * @param getTeamIdFromRequest Función para extraer el ID del equipo
 */
export function authorizeTeamAdmin(getTeamIdFromRequest: (req: Request) => string) {
  return authorizeTeamRole(['admin'], getTeamIdFromRequest);
}

/**
 * Middleware para verificar si el usuario es administrador o miembro del equipo
 * @param getTeamIdFromRequest Función para extraer el ID del equipo
 */
export function authorizeTeamAdminOrMember(getTeamIdFromRequest: (req: Request) => string) {
  return authorizeTeamRole(['admin', 'member'], getTeamIdFromRequest);
}
