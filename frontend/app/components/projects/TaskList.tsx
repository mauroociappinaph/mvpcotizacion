"use client";

import { useState, useEffect } from 'react';
import { useTaskStore } from '../../lib/store/taskStore';
import { Task, TaskStatus    } from '../../lib/types/task.types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Skeleton
} from '../../components/ui';
import { CheckCircle2, MoreHorizontal, Plus } from 'lucide-react';
import { format, isToday, isYesterday, isThisWeek } from 'date-fns';

interface TaskListProps {
  showAddTask?: boolean;
}

export default function TaskList({ showAddTask = true }: TaskListProps) {
    const { tasks, fetchTasks, isLoading, error, updateTask } = useTaskStore();
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const filteredTasks = activeTab === 'all'
    ? tasks
    : tasks.filter((task: Task) => task.status === activeTab);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string, className: string }> = {
      'todo': { label: 'Por hacer', className: 'bg-slate-400' },
      'in_progress': { label: 'En progreso', className: 'bg-blue-500' },
      'review': { label: 'En revisión', className: 'bg-yellow-500' },
      'done': { label: 'Completada', className: 'bg-green-500' },
      'blocked': { label: 'Bloqueada', className: 'bg-red-500' },
    };

    const defaultStatus = { label: status, className: 'bg-slate-400' };
    return statusMap[status] || defaultStatus;
  };

  const getPriorityBadge = (priority: string) => {
    const priorityMap: Record<string, { label: string, className: string }> = {
      'low': { label: 'Baja', className: 'bg-green-100 text-green-800 border-green-200' },
      'medium': { label: 'Media', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      'high': { label: 'Alta', className: 'bg-red-100 text-red-800 border-red-200' },
    };

    const defaultPriority = { label: priority, className: 'bg-slate-100 text-slate-800 border-slate-200' };
    return priorityMap[priority] || defaultPriority;
  };

  const formatDateFunc = (dateString?: string) => {
    if (!dateString) return 'Sin fecha';
    const date = new Date(dateString);

    if (isToday(date)) {
      return `Today, ${format(date, 'h:mm a')}`;
    } else if (isYesterday(date)) {
      return `Yesterday, ${format(date, 'h:mm a')}`;
    } else if (isThisWeek(date)) {
      return format(date, 'EEEE, h:mm a');
    } else {
      return format(date, 'MMM d, yyyy');
    }
  };

  const getInitialsFunc = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleStatusChangeFunc = async (taskId: string, newStatus: string) => {
    try {
      await updateTask(taskId, { status: newStatus as TaskStatus });
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Tareas</span>
            <div className="h-10 w-40 bg-gray-200 animate-pulse rounded"></div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-md">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-50 border-red-200">
        <CardContent className="pt-6">
          <p className="text-red-700">Error loading tasks: {error}</p>
        </CardContent>
      </Card>
    );
  }

  const TaskCard = ({ task }: { task: Task }) => {
    return (
      <div className="p-4 border rounded-lg shadow-sm hover:shadow transition-shadow duration-200">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium text-lg">{task.title}</h3>
            <p className="text-gray-600 text-sm mt-1">{task.description}</p>
            <div className="flex space-x-2 mt-3">
              {getStatusBadge(task.status).label}
              {task.priority && getPriorityBadge(task.priority).label}
            </div>
          </div>
          <div className="flex items-center">
            {task.assignedTo && (
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage
                      src={''}
                  alt={task.assignedTo}
                />
                <AvatarFallback>{getInitialsFunc(task.assignedTo)}</AvatarFallback>
              </Avatar>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleStatusChangeFunc(task.id, 'todo')}>
                  Marcar como pendiente
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChangeFunc(task.id, 'in_progress')}>
                  Marcar en progreso
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChangeFunc(task.id, 'review')}>
                  Marcar para revisión
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChangeFunc(task.id, 'done')}>
                  Marcar como completada
                </DropdownMenuItem>
                <DropdownMenuItem>Editar tarea</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">Eliminar</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-500 flex justify-between">
          <div>Due: {task.dueDate ? formatDateFunc(task.dueDate) : "No due date"}</div>
          <div>Created: {formatDateFunc(task.createdAt)}</div>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Tareas del Proyecto</CardTitle>
          {showAddTask && (
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Tarea
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="todo">Por hacer</TabsTrigger>
            <TabsTrigger value="in_progress">En progreso</TabsTrigger>
            <TabsTrigger value="review">En revisión</TabsTrigger>
            <TabsTrigger value="done">Completadas</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <div className="mb-2">
                  <CheckCircle2 className="h-12 w-12 mx-auto text-gray-300" />
                </div>
                <p className="text-lg font-medium">No hay tareas</p>
                <p className="mt-1">
                  {activeTab === 'all'
                    ? "No hay tareas creadas para este proyecto todavía"
                    : `No hay tareas con estado "${getStatusBadge(activeTab).label}"`}
                </p>
                {showAddTask && (
                  <Button className="mt-4" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Crear primera tarea
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTasks.map((task: Task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
