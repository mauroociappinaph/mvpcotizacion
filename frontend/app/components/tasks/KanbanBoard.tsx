'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import TaskCard from './TaskCard';
import { Task } from '../../lib/types/task.types';
import { useTaskStore } from '../../lib/store/taskStore';

interface KanbanBoardProps {
  projectId?: string;
  onAddTask: () => void;
  onEditTask: (taskId: string) => void;
}

export default function KanbanBoard({ projectId, onAddTask, onEditTask }: KanbanBoardProps) {
  const { tasks, isLoading, error, updateTask, deleteTask, fetchTasks, getTasksByProject } = useTaskStore();
  const [groupedTasks, setGroupedTasks] = useState<Record<string, Task[]>>({
    pending: [],
    in_progress: [],
    completed: []
  });

  useEffect(() => {
    const loadTasks = async () => {
      if (projectId) {
        await getTasksByProject(projectId);
      } else {
        await fetchTasks();
      }
    };

    loadTasks();
  }, [projectId, fetchTasks, getTasksByProject]);

  useEffect(() => {
    // Agrupar tareas por estado
    const grouped: Record<string, Task[]> = {
      pending: [],
      in_progress: [],
      completed: []
    };

    tasks.forEach(task => {
      const status = task.status || 'pending';
      if (grouped[status]) {
        grouped[status].push(task);
      } else {
        grouped.pending.push(task);
      }
    });

    setGroupedTasks(grouped);
  }, [tasks]);

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      await updateTask(taskId, { status: newStatus as TaskStatus });
    } catch (error) {
      console.error('Error al actualizar el estado de la tarea:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      try {
        await deleteTask(taskId);
      } catch (error) {
        console.error('Error al eliminar la tarea:', error);
      }
    }
  };

  const getColumnTitle = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendientes';
      case 'in_progress':
        return 'En Progreso';
      case 'completed':
        return 'Completadas';
      default:
        return 'Tareas';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-4">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Tablero de Tareas</h2>
        <button
          onClick={onAddTask}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus size={18} className="mr-1" />
          Nueva Tarea
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.keys(groupedTasks).map(status => (
          <div key={status} className="bg-gray-100 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-700">{getColumnTitle(status)}</h3>
              <span className="bg-gray-200 text-gray-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {groupedTasks[status].length}
              </span>
            </div>

            <div className="space-y-3 min-h-[200px]">
              {groupedTasks[status].length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No hay tareas en esta columna
                </div>
              ) : (
                groupedTasks[status].map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStatusChange={handleStatusChange}
                    onEdit={onEditTask}
                    onDelete={handleDeleteTask}
                  />
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
