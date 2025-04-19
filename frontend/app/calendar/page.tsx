"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import MainLayout from "../components/layout/MainLayout";
import { useTaskStore } from "../lib/store/taskStore";
import { useProjectStore } from "../lib/store/projectStore";
import { format, startOfMonth, endOfMonth, eachDayOfInterval,
         startOfWeek, endOfWeek, isSameMonth, isSameDay, isToday,
         addMonths, subMonths } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../components/ui";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  Plus
} from "lucide-react";

export default function CalendarPage() {
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { tasks, isLoading: tasksLoading, fetchTasks } = useTaskStore();
  const { isLoading: projectsLoading, fetchProjects } = useProjectStore();

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, [fetchTasks, fetchProjects]);

  const isLoading = tasksLoading || projectsLoading;

  // Navigation functions
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  // Get days for month view
  const getDaysInMonth = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    return eachDayOfInterval({ start: startDate, end: endDate });
  };

  // Get tasks for specific date
  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      return isSameDay(new Date(task.dueDate), date);
    });
  };

  // Get class for calendar day
  const getDayClass = (day: Date) => {
    let classes = "h-12 w-full border p-1 relative ";

    if (!isSameMonth(day, currentDate)) {
      classes += "text-gray-300 ";
    } else {
      classes += "text-gray-800 ";
    }

    if (isToday(day)) {
      classes += "bg-blue-50 font-bold ";
    }

    if (isSameDay(day, selectedDate)) {
      classes += "bg-blue-100 border-blue-500 border-2 ";
    }

    const tasksForDay = getTasksForDate(day);
    if (tasksForDay.length > 0) {
      classes += "font-semibold ";
    }

    return classes;
  };

  // Format date as YYYY-MM-DD
  const formatTaskDate = (dateString: string | Date) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return format(date, "yyyy-MM-dd");
  };

  // Get task priority color
  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-700 border-red-300";
      case "medium": return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "low": return "bg-green-100 text-green-700 border-green-300";
      default: return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  // Get status class
  const getStatusClass = (status: string) => {
    switch (status) {
      case "todo": return "text-gray-600";
      case "in-progress": return "text-blue-600";
      case "completed": return "text-green-600";
      case "blocked": return "text-red-600";
      default: return "";
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "todo": return <Clock className="h-4 w-4" />;
      case "in-progress": return <Clock className="h-4 w-4" />;
      case "completed": return <CheckCircle2 className="h-4 w-4" />;
      case "blocked": return <AlertCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Calendario</h1>
            <div className="flex items-center space-x-4">
              <Button onClick={goToToday} variant="outline" size="sm">
                Hoy
              </Button>
              <div className="flex items-center space-x-2">
                <Button onClick={prevMonth} variant="outline" size="icon" className="h-8 w-8 p-0">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="font-medium min-w-24 text-center">
                  {format(currentDate, 'MMMM yyyy')}
                </span>
                <Button onClick={nextMonth} variant="outline" size="icon" className="h-8 w-8 p-0">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <Select
                value={view}
                onValueChange={(value: string) => setView(value as "month" | "week" | "day")}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="View" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Mes</SelectItem>
                  <SelectItem value="week">Semana</SelectItem>
                  <SelectItem value="day">Día</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center p-10">
              <p>Cargando calendario...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {/* Calendar header - days of week */}
              {["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"].map((day) => (
                <div
                  key={day}
                  className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wide font-semibold text-center py-2"
                >
                  {day}
                </div>
              ))}

              {/* Calendar days */}
              {getDaysInMonth().map((day, idx) => (
                <div
                  key={idx}
                  className={getDayClass(day)}
                  onClick={() => setSelectedDate(day)}
                >
                  <span className="absolute top-1 left-1 text-sm">{format(day, "d")}</span>

                  {getTasksForDate(day).length > 0 && (
                    <div className="absolute bottom-1 right-1 flex">
                      <span className="inline-flex h-4 w-4 rounded-full bg-blue-400 text-xs text-white justify-center items-center">
                        {getTasksForDate(day).length}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Tasks for selected date */}
          <div className="mt-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                  Tareas para {format(selectedDate, "d 'de' MMMM, yyyy")}
                </CardTitle>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Tarea
                </Button>
              </CardHeader>
              <CardContent>
                {getTasksForDate(selectedDate).length === 0 ? (
                  <p className="text-center py-6 text-gray-500">
                    No hay tareas programadas para esta fecha
                  </p>
                ) : (
                  <div className="space-y-4">
                    {getTasksForDate(selectedDate).map((task) => (
                      <div
                        key={task.id}
                        className="border rounded-lg p-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium">{task.title}</h3>
                            {task.description && (
                              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                            )}
                            <div className="flex items-center space-x-2 mt-2">
                              <span
                                className={`inline-flex items-center px-2 py-1 text-xs font-medium border rounded-full ${getStatusClass(
                                  task.status
                                )}`}
                              >
                                {getStatusIcon(task.status)}
                                <span className="ml-1">{task.status}</span>
                              </span>
                              <span
                                className={`inline-flex items-center px-2 py-1 text-xs font-medium border rounded-full ${getPriorityClass(
                                  task.priority
                                )}`}
                              >
                                {task.priority}
                              </span>
                              {task.dueDate && (
                                <span className="text-xs text-gray-500">
                                  {formatTaskDate(task.dueDate)}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              Editar
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
