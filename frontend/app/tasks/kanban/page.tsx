import { useState, useEffect } from 'react';
import { useTaskStore } from '@/lib/store/taskStore';
import { Task } from '@/lib/types/task.types';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Search, Plus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Status constants based on the existing status values in the application
const TASK_STATUSES = {
  todo: { id: 'todo', label: 'Por hacer', color: 'bg-slate-100' },
  in_progress: { id: 'in_progress', label: 'En progreso', color: 'bg-blue-100' },
  review: { id: 'review', label: 'En revisión', color: 'bg-yellow-100' },
  done: { id: 'done', label: 'Completada', color: 'bg-green-100' },
  blocked: { id: 'blocked', label: 'Bloqueada', color: 'bg-red-100' },
};

// Helper to get initials from a name
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Format date for display
const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
};

// Component for a single task card
const TaskCard = ({ task }: { task: Task }) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('taskId', task.id);
  };

  const priorityColors: Record<string, string> = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  return (
    <Card
      className="mb-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
      draggable
      onDragStart={handleDragStart}
    >
      <CardContent className="p-3">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-sm">{task.title}</h3>
          <Badge className={priorityColors[task.priority] || 'bg-gray-100'}>
            {task.priority}
          </Badge>
        </div>

        {task.description && (
          <p className="text-gray-600 text-xs mt-2 line-clamp-2">{task.description}</p>
        )}

        <div className="flex justify-between items-center mt-3">
          {task.dueDate && (
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="h-3 w-3 mr-1" />
              {formatDate(task.dueDate)}
            </div>
          )}

          {task.assignedTo && (
            <Avatar className="h-6 w-6">
              <AvatarImage src={task.assignedTo.image || ''} alt={task.assignedTo.name} />
              <AvatarFallback className="text-xs">{getInitials(task.assignedTo.name)}</AvatarFallback>
            </Avatar>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Column component for each status
const TaskColumn = ({
  status,
  tasks,
  onDrop
}: {
  status: typeof TASK_STATUSES[keyof typeof TASK_STATUSES],
  tasks: Task[],
  onDrop: (taskId: string, newStatus: string) => void
}) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    onDrop(taskId, status.id);
  };

  return (
    <div
      className="flex-1 min-w-[250px] max-w-[350px]"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className={`p-3 rounded-t-md ${status.color}`}>
        <h3 className="font-medium flex items-center">
          {status.label}
          <Badge className="ml-2 bg-white text-gray-800">{tasks.length}</Badge>
        </h3>
      </div>
      <div className="p-2 bg-gray-50 rounded-b-md min-h-[70vh] max-h-[70vh] overflow-y-auto">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default function KanbanPage() {
  const { tasks, fetchTasks, isLoading, error, updateTaskStatus } = useTaskStore();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Filter tasks based on search query
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Group tasks by status
  const tasksByStatus = Object.keys(TASK_STATUSES).reduce<Record<string, Task[]>>((acc, statusKey) => {
    acc[statusKey] = filteredTasks.filter(task => task.status === statusKey);
    return acc;
  }, {});

  const handleDrop = async (taskId: string, newStatus: string) => {
    await updateTaskStatus(taskId, newStatus);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-[70vh]">Cargando tareas...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Tablero Kanban</h1>
        <div className="flex justify-between">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar tareas"
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Tarea
          </Button>
        </div>
      </div>

      <div className="flex space-x-4 overflow-x-auto pb-4">
        {Object.values(TASK_STATUSES).map(status => (
          <TaskColumn
            key={status.id}
            status={status}
            tasks={tasksByStatus[status.id] || []}
            onDrop={handleDrop}
          />
        ))}
      </div>
    </div>
  );
}
