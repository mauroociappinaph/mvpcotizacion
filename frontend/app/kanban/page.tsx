"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import KanbanBoard from '../components/tasks/KanbanBoard';
import TaskForm from '../components/tasks/TaskForm';

export default function KanbanPage() {
  const router = useRouter();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const handleAddTask = () => {
    setEditingTaskId(null);
    setShowTaskForm(true);
  };

  const handleEditTask = (taskId: string) => {
    setEditingTaskId(taskId);
    setShowTaskForm(true);
  };

  const handleCloseForm = () => {
    setShowTaskForm(false);
    setEditingTaskId(null);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Tablero Kanban</h1>
        <p className="text-gray-600">Gestiona tus tareas de forma visual arrastrando las tarjetas entre columnas.</p>
      </div>

      {showTaskForm ? (
        <TaskForm
          taskId={editingTaskId}
          onClose={handleCloseForm}
        />
      ) : (
        <KanbanBoard
          onAddTask={handleAddTask}
          onEditTask={handleEditTask}
        />
      )}
    </div>
  );
}
