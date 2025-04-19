import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const prisma = new PrismaClient();

// Esquemas de validación con Zod
export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" })
});

export const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email format" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" })
});

export async function registerUser(userData: z.infer<typeof registerSchema>) {
  // Validar datos
  const validatedData = registerSchema.parse(userData);

  // Comprobar si el usuario ya existe
  const existingUser = await prisma.user.findUnique({
    where: { email: validatedData.email }
  });

  if (existingUser) {
    throw new Error('User already exists');
  }

  // Hashear contraseña
  const hashedPassword = await bcrypt.hash(validatedData.password, 10);

  // Crear usuario
  const user = await prisma.user.create({
    data: {
      name: validatedData.name,
      email: validatedData.email,
      password: hashedPassword
    }
  });

  // Generar token
  const token = generateToken(user.id);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      createdAt: user.createdAt
    },
    token
  };
}

export async function loginUser(credentials: z.infer<typeof loginSchema>) {
  // Validar datos
  const validatedData = loginSchema.parse(credentials);

  // Buscar usuario
  const user = await prisma.user.findUnique({
    where: { email: validatedData.email }
  });

  if (!user || !user.password) {
    throw new Error('Invalid credentials');
  }

  // Verificar contraseña
  const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);

  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  // Generar token
  const token = generateToken(user.id);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      createdAt: user.createdAt
    },
    token
  };
}

export async function getUserProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    throw new Error('User not found');
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    createdAt: user.createdAt
  };
}

// Función para autenticación con OAuth
export async function authenticateWithOAuth(
  provider: string,
  oauthId: string,
  email: string,
  name: string,
  image?: string
) {
  // Buscar si el usuario ya existe con este oauthId
  let user = await prisma.user.findFirst({
    where: {
      OR: [
        { oauthId, oauthProvider: provider },
        { email }
      ]
    }
  });

  if (user) {
    // Si existe pero no tiene los datos de OAuth, actualizar
    if (!user.oauthId || !user.oauthProvider) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          oauthId,
          oauthProvider: provider,
          image: image || user.image
        }
      });
    }
  } else {
    // Si no existe, crear nuevo usuario
    user = await prisma.user.create({
      data: {
        name,
        email,
        oauthId,
        oauthProvider: provider,
        image
      }
    });
  }

  // Generar token
  const token = generateToken(user.id);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      createdAt: user.createdAt
    },
    token
  };
}

// Función para generar tokens JWT
function generateToken(userId: string): string {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '30d' }
  );
}
