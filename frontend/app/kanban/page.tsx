"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useTaskStore } from "../../lib/store/taskStore";
import { cn } from "../../lib/utils";
import { Search, Plus, AlertCircle } from "lucide-react";

// Definir los estados de las columnas
const columns = [
  { id: "TODO", title: "Por Hacer", color: "bg-blue-100" },
  { id: "IN_PROGRESS", title: "En Progreso", color: "bg-yellow-100" },
  { id: "REVIEW", title: "En Revisión", color: "bg-purple-100" },
  { id: "DONE", title: "Completado", color: "bg-green-100" }
];

export default function KanbanPage() {
  const { tasks, loading, error, fetchTasks, updateTask } = useTaskStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTasks, setFilteredTasks] = useState<any[]>([]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    if (tasks) {
      setFilteredTasks(
        tasks.filter((task: any) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [tasks, searchQuery]);

  // Organizar tareas por columna
  const getTasksByStatus = (status: string) => {
    return filteredTasks.filter(task => task.status === status);
  };

  // Manejar el arrastre de tareas
  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    // Si no hay destino o es el mismo, no hacemos nada
    if (!destination ||
        (destination.droppableId === source.droppableId &&
         destination.index === source.index)) {
      return;
    }

    // Actualizar el estado de la tarea
    const taskId = draggableId;
    const newStatus = destination.droppableId;

    // Encontrar la tarea y actualizarla
    const taskToUpdate = tasks.find(t => t.id.toString() === taskId);
    if (taskToUpdate) {
      updateTask(taskToUpdate.id, {
        ...taskToUpdate,
        status: newStatus
      });
    }
  };

  // Renderizar esqueletos de carga
  const renderSkeletons = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
      {columns.map(column => (
        <div key={column.id} className={cn("rounded-lg p-4", column.color)}>
          <h3 className="font-medium mb-3">{column.title}</h3>
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white h-24 rounded-md p-3 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Tablero Kanban</h2>
        {renderSkeletons()}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Tablero Kanban</h2>
        <div className="bg-red-50 p-4 rounded-md flex items-center text-red-700">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>Error al cargar las tareas: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">Tablero Kanban</h2>

        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar tareas..."
              className="pl-9 py-2 pr-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 w-full md:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button className="bg-primary text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-primary/90 transition-colors">
            <Plus className="h-4 w-4" />
            <span>Nueva Tarea</span>
          </button>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {columns.map(column => (
            <div key={column.id} className={cn("rounded-lg p-4", column.color)}>
              <h3 className="font-medium mb-3">
                {column.title} ({getTasksByStatus(column.id).length})
              </h3>

              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-2 min-h-[50vh]"
                  >
                    {getTasksByStatus(column.id).map((task, index) => (
                      <Draggable
                        key={task.id.toString()}
                        draggableId={task.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white rounded-md p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                          >
                            <h4 className="font-medium mb-1 truncate">{task.title}</h4>
                            <p className="text-sm text-gray-500 line-clamp-2">{task.description}</p>

                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-gray-500">
                                {new Date(task.dueDate).toLocaleDateString()}
                              </span>

                              {task.priority && (
                                <span className={cn(
                                  "text-xs px-2 py-1 rounded-full",
                                  task.priority === "HIGH" ? "bg-red-100 text-red-800" :
                                  task.priority === "MEDIUM" ? "bg-yellow-100 text-yellow-800" :
                                  "bg-green-100 text-green-800"
                                )}>
                                  {task.priority === "HIGH" ? "Alta" :
                                   task.priority === "MEDIUM" ? "Media" : "Baja"}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
