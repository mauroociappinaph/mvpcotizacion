import express from 'express';
import { getAllTasks, createTask, updateTask, deleteTask, getTaskById } from '../controllers/taskController';
import { asyncHandler } from '../utils/asyncHandler';

const router = express.Router();

// GET all tasks
router.get('/', asyncHandler(getAllTasks));

// GET a specific task by ID
router.get('/:id', asyncHandler(getTaskById));

// POST create a new task
router.post('/', asyncHandler(createTask));

// PUT update an existing task
router.put('/:id', asyncHandler(updateTask));

// DELETE a task
router.delete('/:id', asyncHandler(deleteTask));

export default router;
