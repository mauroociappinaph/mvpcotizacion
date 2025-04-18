import express from 'express';
import { getAllProjects, getProjectById, createProject, updateProject, deleteProject } from '../controllers/projectController';
import { asyncHandler } from '../utils/asyncHandler';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

// Aplicar el middleware de autenticación a todas las rutas
router.use(authenticate as express.RequestHandler);

// GET todos los proyectos
router.get('/', asyncHandler(getAllProjects));

// GET un proyecto específico por ID
router.get('/:id', asyncHandler(getProjectById));

// POST crear un nuevo proyecto
router.post('/', asyncHandler(createProject));

// PUT actualizar un proyecto existente
router.put('/:id', asyncHandler(updateProject));

// DELETE eliminar un proyecto
router.delete('/:id', asyncHandler(deleteProject));

export default router;
