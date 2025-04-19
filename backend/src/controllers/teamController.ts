import { Request, Response } from 'express';
import * as teamService from '../services/teamService';

// Controladores de equipo
export const createTeam = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no autenticado'
      });
    }

    const teamData = req.body;

    const team = await teamService.createTeam(teamData, userId);

    res.status(201).json({
      success: true,
      data: team
    });
  } catch (error) {
    console.error('Create team error:', error);
    res.status(500).json({
      success: false,
      error: 'Error al crear equipo'
    });
  }
};

export const getTeams = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no autenticado'
      });
    }

    const teams = await teamService.getTeams(userId);

    res.status(200).json({
      success: true,
      data: teams
    });
  } catch (error) {
    console.error('Get teams error:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener equipos'
    });
  }
};

export const getTeamById = async (req: Request, res: Response) => {
  try {
    const teamId = req.params.teamId;

    const team = await teamService.getTeamById(teamId);

    res.status(200).json({
      success: true,
      data: team
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Team not found') {
      return res.status(404).json({
        success: false,
        error: 'Equipo no encontrado'
      });
    }

    console.error('Get team error:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener equipo'
    });
  }
};

export const updateTeam = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no autenticado'
      });
    }

    const teamId = req.params.teamId;
    const teamData = req.body;

    const team = await teamService.updateTeam(teamId, teamData, userId);

    res.status(200).json({
      success: true,
      data: team
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Team not found') {
        return res.status(404).json({
          success: false,
          error: 'Equipo no encontrado'
        });
      }

      if (error.message === 'Only team admins can update the team') {
        return res.status(403).json({
          success: false,
          error: 'Solo los administradores pueden actualizar el equipo'
        });
      }
    }

    console.error('Update team error:', error);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar equipo'
    });
  }
};

export const deleteTeam = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no autenticado'
      });
    }

    const teamId = req.params.teamId;

    await teamService.deleteTeam(teamId, userId);

    res.status(200).json({
      success: true,
      message: 'Equipo eliminado correctamente'
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Team not found') {
        return res.status(404).json({
          success: false,
          error: 'Equipo no encontrado'
        });
      }

      if (error.message === 'Only team admins can delete the team') {
        return res.status(403).json({
          success: false,
          error: 'Solo los administradores pueden eliminar el equipo'
        });
      }
    }

    console.error('Delete team error:', error);
    res.status(500).json({
      success: false,
      error: 'Error al eliminar equipo'
    });
  }
};

// Controladores de miembros del equipo
export const getTeamMembers = async (req: Request, res: Response) => {
  try {
    const teamId = req.params.teamId;

    const members = await teamService.getTeamMembers(teamId);

    res.status(200).json({
      success: true,
      data: members
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Team not found') {
      return res.status(404).json({
        success: false,
        error: 'Equipo no encontrado'
      });
    }

    console.error('Get team members error:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener miembros del equipo'
    });
  }
};

export const addTeamMember = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no autenticado'
      });
    }

    const teamId = req.params.teamId;
    const memberData = req.body;

    const member = await teamService.addTeamMember(teamId, memberData, userId);

    res.status(201).json({
      success: true,
      data: member
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Team not found') {
        return res.status(404).json({
          success: false,
          error: 'Equipo no encontrado'
        });
      }

      if (error.message === 'User not found') {
        return res.status(404).json({
          success: false,
          error: 'Usuario no encontrado'
        });
      }

      if (error.message === 'Only team admins can add members') {
        return res.status(403).json({
          success: false,
          error: 'Solo los administradores pueden agregar miembros'
        });
      }

      if (error.message === 'User is already a member of this team') {
        return res.status(400).json({
          success: false,
          error: 'El usuario ya es miembro de este equipo'
        });
      }
    }

    console.error('Add team member error:', error);
    res.status(500).json({
      success: false,
      error: 'Error al agregar miembro al equipo'
    });
  }
};

export const updateTeamMember = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no autenticado'
      });
    }

    const teamId = req.params.teamId;
    const memberId = req.params.memberId;
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({
        success: false,
        error: 'Se requiere especificar el rol'
      });
    }

    const member = await teamService.updateTeamMember(teamId, memberId, role, userId);

    res.status(200).json({
      success: true,
      data: member
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Team not found') {
        return res.status(404).json({
          success: false,
          error: 'Equipo no encontrado'
        });
      }

      if (error.message === 'Team member not found') {
        return res.status(404).json({
          success: false,
          error: 'Miembro no encontrado'
        });
      }

      if (error.message === 'Only team admins can update member roles') {
        return res.status(403).json({
          success: false,
          error: 'Solo los administradores pueden actualizar roles'
        });
      }

      if (error.message === 'Invalid role') {
        return res.status(400).json({
          success: false,
          error: 'Rol inválido'
        });
      }

      if (error.message === 'Cannot remove the last admin of the team') {
        return res.status(400).json({
          success: false,
          error: 'No se puede eliminar el último administrador del equipo'
        });
      }
    }

    console.error('Update team member error:', error);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar miembro del equipo'
    });
  }
};

export const removeTeamMember = async (req: Request, res: Response) => {
  try {
    const adminId = req.user?.userId;

    if (!adminId) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no autenticado'
      });
    }

    const teamId = req.params.teamId;
    const userId = req.params.userId;

    await teamService.removeTeamMember(teamId, userId, adminId);

    res.status(200).json({
      success: true,
      message: 'Miembro eliminado correctamente'
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Team not found') {
        return res.status(404).json({
          success: false,
          error: 'Equipo no encontrado'
        });
      }

      if (error.message === 'User is not a member of this team') {
        return res.status(404).json({
          success: false,
          error: 'El usuario no es miembro de este equipo'
        });
      }

      if (error.message === 'Only team admins can remove other members') {
        return res.status(403).json({
          success: false,
          error: 'Solo los administradores pueden eliminar miembros'
        });
      }

      if (error.message === 'Cannot remove the last admin of the team') {
        return res.status(400).json({
          success: false,
          error: 'No se puede eliminar el último administrador del equipo'
        });
      }
    }

    console.error('Remove team member error:', error);
    res.status(500).json({
      success: false,
      error: 'Error al eliminar miembro del equipo'
    });
  }
};
