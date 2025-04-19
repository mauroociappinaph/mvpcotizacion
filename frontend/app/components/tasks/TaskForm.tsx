'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useTaskStore } from '../../lib/store/taskStore';
import { useProjectStore } from '../../lib/store/projectStore';
import { TaskData } from '../../lib/types/task.types';

interface TaskFormProps {
  taskId?: string | null;
  onClose: () => void;
}

export default function TaskForm({ taskId, onClose }: TaskFormProps) {
  const { getTask, currentTask, createTask, updateTask, isLoading, error, clearError } = useTaskStore();
  const { fetchProjects, projects } = useProjectStore();

  const [formData, setFormData] = useState<TaskData>({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: new Date().toISOString().split('T')[0],
    projectId: '',
    assignedTo: ''
  });

  useEffect(() => {
    // Cargar proyectos
    fetchProjects();

    // Si estamos editando, cargar los datos de la tarea
    if (taskId) {
      getTask(taskId);
    }
  }, [taskId, getTask, fetchProjects]);

  // Actualizar el formulario cuando se carga la tarea a editar
  useEffect(() => {
    if (currentTask && taskId) {
      setFormData({
        title: currentTask.title,
        description: currentTask.description,
        status: currentTask.status,
        priority: currentTask.priority,
        dueDate: new Date(currentTask.dueDate).toISOString().split('T')[0],
        projectId: currentTask.projectId || '',
        assignedTo: currentTask.assignedTo || ''
      });
    }
  }, [currentTask, taskId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (taskId) {
        await updateTask(taskId, formData);
      } else {
        await createTask(formData);
      }
      onClose();
    } catch (err) {
      console.error('Error al crear/actualizar la tarea:', err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          {taskId ? 'Editar Tarea' : 'Nueva Tarea'}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Cerrar"
        >
          <X size={20} />
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{error}</p>
          <button
            onClick={clearError}
            className="text-sm underline mt-1"
          >
            Descartar
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Título *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Escribe un título descriptivo"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe los detalles de la tarea"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">Pendiente</option>
                <option value="in_progress">En Progreso</option>
                <option value="completed">Completado</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                Prioridad *
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Vencimiento *
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="projectId" className="block text-sm font-medium text-gray-700 mb-1">
                Proyecto
              </label>
              <select
                id="projectId"
                name="projectId"
                value={formData.projectId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Ninguno</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-1">
              Asignado a
            </label>
            <input
              type="text"
              id="assignedTo"
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ID del usuario asignado"
            />
            <p className="text-xs text-gray-500 mt-1">
              Deja en blanco si no está asignado a nadie.
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-8">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 rounded-md text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Guardando...' : (taskId ? 'Actualizar' : 'Crear')}
          </button>
        </div>
      </form>
    </div>
  );
}
