import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import http from 'http';
import { Server as SocketServer } from 'socket.io';

// Importar rutas
import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';
import projectRoutes from './routes/projectRoutes';
import teamRoutes from './routes/teamRoutes';
import messageRoutes from './routes/messageRoutes';
import notificationRoutes from './routes/notificationRoutes';

// Configuración
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

// Crear servidor HTTP y socket.io
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Crear instancia de Prisma y exportarla
export const prisma = new PrismaClient();

// Middlewares
app.use(cors());
app.use(express.json());

// Logging básico
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);

// Configuración básica de Socket.io
io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  // Manejar unión a salas (canales)
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`Usuario ${socket.id} unido a la sala ${roomId}`);
  });

  // Manejar mensajes
  socket.on('send-message', (messageData) => {
    io.to(messageData.channelId).emit('receive-message', messageData);
  });

  // Manejar notificaciones
  socket.on('notification', (notification) => {
    io.to(notification.userId).emit('receive-notification', notification);
  });

  // Manejar desconexión
  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id);
  });
});

// Iniciar servidor
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('Prisma client disconnected');
  process.exit(0);
});
