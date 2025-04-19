import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Esquemas de validación
export const teamSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().optional()
});

export const teamMemberSchema = z.object({
  userId: z.string(),
  role: z.enum(['admin', 'member', 'guest'])
});

// Operaciones de Equipo
export async function createTeam(teamData: z.infer<typeof teamSchema>, creatorId: string) {
  const validatedData = teamSchema.parse(teamData);

  // Crear equipo y asignar al creador como admin
  const team = await prisma.$transaction(async (tx: PrismaClient) => {
    // Crear el equipo
    const newTeam = await tx.team.create({
      data: validatedData
    });

    // Crear el registro de miembro para el creador como admin
    await tx.teamMember.create({
      data: {
        team: { connect: { id: newTeam.id } },
        user: { connect: { id: creatorId } },
        role: 'admin'
      }
    });

    return newTeam;
  });

  // Obtener el equipo completo con miembros
  const teamWithMembers = await prisma.team.findUnique({
    where: { id: team.id },
    include: {
      members: {
        include: {
          user: true
        }
      }
    }
  });

  return teamWithMembers;
}

export async function updateTeam(id: string, teamData: Partial<z.infer<typeof teamSchema>>, userId: string) {
  // Verificar que el equipo existe
  const existingTeam = await prisma.team.findUnique({
    where: { id },
    include: {
      members: true
    }
  });

  if (!existingTeam) {
    throw new Error('Team not found');
  }

  // Verificar que el usuario es admin del equipo
  const isAdmin = existingTeam.members.some(
    (member: { userId: string; role: string }) => member.userId === userId && member.role === 'admin'
  );

  if (!isAdmin) {
    throw new Error('Only team admins can update the team');
  }

  // Actualizar el equipo
  const team = await prisma.team.update({
    where: { id },
    data: {
      ...(teamData.name && { name: teamData.name }),
      ...(teamData.description !== undefined && { description: teamData.description })
    },
    include: {
      members: {
        include: {
          user: true
        }
      }
    }
  });

  return team;
}

export async function deleteTeam(id: string, userId: string) {
  // Verificar que el equipo existe
  const existingTeam = await prisma.team.findUnique({
    where: { id },
    include: {
      members: true
    }
  });

  if (!existingTeam) {
    throw new Error('Team not found');
  }

  // Verificar que el usuario es admin del equipo
  const isAdmin = existingTeam.members.some(
    (member: { userId: string; role: string }) => member.userId === userId && member.role === 'admin'
  );

  if (!isAdmin) {
    throw new Error('Only team admins can delete the team');
  }

  // Eliminar el equipo (los miembros, proyectos y canales se eliminarán en cascada)
  await prisma.team.delete({
    where: { id }
  });

  return { id };
}

export async function getTeamById(id: string) {
  const team = await prisma.team.findUnique({
    where: { id },
    include: {
      members: {
        include: {
          user: true
        }
      },
      projects: true,
      channels: true
    }
  });

  if (!team) {
    throw new Error('Team not found');
  }

  return team;
}

export async function getTeams(userId: string) {
  // Obtener equipos donde el usuario es miembro
  const teams = await prisma.team.findMany({
    where: {
      members: {
        some: {
          userId
        }
      }
    },
    include: {
      members: {
        include: {
          user: true
        }
      },
      projects: true
    }
  });

  return teams;
}

// Operaciones de Miembros del Equipo
export async function addTeamMember(teamId: string, memberData: z.infer<typeof teamMemberSchema>, adminId: string) {
  const validatedData = teamMemberSchema.parse(memberData);

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

  // Verificar que el usuario que hace la solicitud es admin del equipo
  const isAdmin = team.members.some(
    (member: { userId: string; role: string }) => member.userId === adminId && member.role === 'admin'
  );

  if (!isAdmin) {
    throw new Error('Only team admins can add members');
  }

  // Verificar que el usuario a agregar existe
  const user = await prisma.user.findUnique({
    where: { id: validatedData.userId }
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Verificar que el usuario no es ya miembro del equipo
  const existingMember = team.members.find((member: { userId: string }) => member.userId === validatedData.userId);

  if (existingMember) {
    throw new Error('User is already a member of this team');
  }

  // Agregar el miembro al equipo
  const teamMember = await prisma.teamMember.create({
    data: {
      team: { connect: { id: teamId } },
      user: { connect: { id: validatedData.userId } },
      role: validatedData.role
    },
    include: {
      user: true,
      team: true
    }
  });

  return teamMember;
}

export async function updateTeamMember(teamId: string, memberId: string, role: string, adminId: string) {
  // Verificar que el rol es válido
  if (!['admin', 'member', 'guest'].includes(role)) {
    throw new Error('Invalid role');
  }

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

  // Verificar que el usuario que hace la solicitud es admin del equipo
  const isAdmin = team.members.some(
    (member: { userId: string; role: string }) => member.userId === adminId && member.role === 'admin'
  );

  if (!isAdmin) {
    throw new Error('Only team admins can update member roles');
  }

  // Verificar que el miembro existe
  const member = await prisma.teamMember.findUnique({
    where: { id: memberId }
  });

  if (!member || member.teamId !== teamId) {
    throw new Error('Team member not found');
  }

  // Verificar que no es el último admin
  if (member.role === 'admin' && role !== 'admin') {
    const adminCount = team.members.filter((m: { role: string }) => m.role === 'admin').length;
    if (adminCount <= 1) {
      throw new Error('Cannot remove the last admin of the team');
    }
  }

  // Actualizar el rol del miembro
  const updatedMember = await prisma.teamMember.update({
    where: { id: memberId },
    data: { role },
    include: {
      user: true,
      team: true
    }
  });

  return updatedMember;
}

export async function removeTeamMember(teamId: string, userId: string, adminId: string) {
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

  // Un usuario puede eliminarse a sí mismo o un admin puede eliminar a otros
  const isSelf = userId === adminId;
  const isAdmin = team.members.some(
    (member: { userId: string; role: string }) => member.userId === adminId && member.role === 'admin'
  );

  if (!isSelf && !isAdmin) {
    throw new Error('Only team admins can remove other members');
  }

  // Verificar que el miembro existe
  const member = team.members.find((m: { userId: string }) => m.userId === userId);

  if (!member) {
    throw new Error('User is not a member of this team');
  }

  // Verificar que no es el último admin
  if (member.role === 'admin' && !isSelf) {
    const adminCount = team.members.filter((m: { role: string })     => m.role === 'admin').length;
    if (adminCount <= 1) {
      throw new Error('Cannot remove the last admin of the team');
    }
  }

  // Eliminar el miembro
  await prisma.teamMember.delete({
    where: { id: member.id }
  });

  return { userId, teamId };
}

export async function getTeamMembers(teamId: string) {
  // Verificar que el equipo existe
  const team = await prisma.team.findUnique({
    where: { id: teamId }
  });

  if (!team) {
    throw new Error('Team not found');
  }

  // Obtener los miembros del equipo
  const members = await prisma.teamMember.findMany({
    where: {
      teamId
    },
    include: {
      user: true
    }
  });

  return members;
}
