'use client';

import { useState } from 'react';
import { Calendar, Clock, CheckCircle2, AlertCircle, MoreHorizontal, User } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Task } from '../../lib/types/task.types';

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, newStatus: string) => void;
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

export default function TaskCard({ task, onStatusChange, onEdit, onDelete }: TaskCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const getPriorityBadge = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'alta':
      case 'high':
        return <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded">Alta</span>;
      case 'media':
      case 'medium':
        return <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded">Media</span>;
      case 'baja':
      case 'low':
        return <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">Baja</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded">Normal</span>;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy', { locale: es });
    } catch {
      return 'Fecha inválida';
    }
  };

  const isOverdue = (dueDate: string) => {
    try {
      return new Date(dueDate) < new Date() && task.status !== 'completed';
    } catch {
      return false;
    }
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleStatusChange = (newStatus: string) => {
    onStatusChange(task.id, newStatus);
    setShowMenu(false);
  };

  return (
    <div className={`bg-white p-4 rounded-lg shadow mb-3 border-l-4 ${
      task.status === 'completed' ? 'border-green-500' :
      isOverdue(task.dueDate) ? 'border-red-500' : 'border-blue-500'
    }`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-800">{task.title}</h3>
        <div className="relative">
          <button
            onClick={toggleMenu}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Menu de opciones"
          >
            <MoreHorizontal size={16} />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
              <div className="py-1">
                <button
                  onClick={() => handleStatusChange('pending')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Mover a Pendiente
                </button>
                <button
                  onClick={() => handleStatusChange('in_progress')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Mover a En Progreso
                </button>
                <button
                  onClick={() => handleStatusChange('completed')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Mover a Completado
                </button>
                <hr className="my-1 border-gray-200" />
                <button
                  onClick={() => { onEdit(task.id); setShowMenu(false); }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Editar
                </button>
                <button
                  onClick={() => { onDelete(task.id); setShowMenu(false); }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Eliminar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>

      <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
        <div className="flex items-center">
          <User size={14} className="mr-1" />
          <span>{task.assignedToName || 'Sin asignar'}</span>
        </div>
        <div>{getPriorityBadge(task.priority)}</div>
      </div>

      <div className="flex justify-between mt-3 text-xs">
        <div className="flex items-center text-gray-500">
          <Calendar size={14} className="mr-1" />
          <span>{formatDate(task.dueDate)}</span>
        </div>
        <div className="flex items-center">
          {task.status === 'completed' ? (
            <span className="flex items-center text-green-600">
              <CheckCircle2 size={14} className="mr-1" />
              Completado
            </span>
          ) : isOverdue(task.dueDate) ? (
            <span className="flex items-center text-red-600">
              <AlertCircle size={14} className="mr-1" />
              Vencida
            </span>
          ) : (
            <span className="flex items-center text-blue-600">
              <Clock size={14} className="mr-1" />
              Pendiente
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
