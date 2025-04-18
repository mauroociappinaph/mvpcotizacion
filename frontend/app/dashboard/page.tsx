"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProjectStore } from "../lib/store/projectStore";
import { useTaskStore } from "../lib/store/taskStore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "../components/ui";
import {
  BarChart,
  PieChart,
  Activity,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Plus,
  Users
} from "lucide-react";
import { format } from "date-fns";

export default function DashboardPage() {
  const router = useRouter();
  const { projects, isLoading: projectsLoading, error: projectsError, fetchProjects } = useProjectStore();
  const { tasks, isLoading: tasksLoading, error: tasksError, fetchTasks } = useTaskStore();

  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchProjects();
    fetchTasks();
  }, [fetchProjects, fetchTasks]);

  const isLoading = projectsLoading || tasksLoading;
  const error = projectsError || tasksError;

  // Calcular estadísticas
  const calculateStats = () => {
    if (!projects || !tasks) {
      return {
        totalProjects: 0,
        activeProjects: 0,
        completedProjects: 0,
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        inProgressTasks: 0,
        recentlyUpdatedProjects: [],
        upcomingDeadlines: []
      };
    }

    const activeProjects = projects.filter(p => p.status === "IN_PROGRESS").length;
    const completedProjects = projects.filter(p => p.status === "COMPLETED").length;
    const completedTasks = tasks.filter(t => t.status === "done").length;
    const pendingTasks = tasks.filter(t => t.status === "todo").length;
    const inProgressTasks = tasks.filter(t => t.status === "in_progress").length;

    // Proyectos recientemente actualizados (últimos 5)
    const recentlyUpdatedProjects = [...projects]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5);

    // Tareas con fechas límite próximas (próximos 7 días)
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const upcomingDeadlines = tasks
      .filter(task => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        return dueDate >= today && dueDate <= nextWeek;
      })
      .sort((a, b) => {
        // Manejar el caso cuando dueDate puede ser undefined
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      })
      .slice(0, 5);

    return {
      totalProjects: projects.length,
      activeProjects,
      completedProjects,
      totalTasks: tasks.length,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      recentlyUpdatedProjects,
      upcomingDeadlines
    };
  };

  const stats = calculateStats();

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "Sin fecha";
    return format(new Date(dateString), "dd MMM yyyy");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Cargando dashboard...</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="bg-gray-100 h-16"></CardHeader>
              <CardContent className="pt-4">
                <div className="bg-gray-100 h-24 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-6">
            <p className="text-red-700">Error cargando datos: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="space-x-2">
          <Button
            onClick={() => router.push('/projects/new')}
            className="inline-flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Proyecto
          </Button>
        </div>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="projects">Proyectos</TabsTrigger>
          <TabsTrigger value="tasks">Tareas</TabsTrigger>
          <TabsTrigger value="analytics">Análisis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Proyectos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-2xl font-bold">{stats.totalProjects}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.activeProjects} activos, {stats.completedProjects} completados
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Tareas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-2xl font-bold">{stats.totalTasks}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.completedTasks} completadas, {stats.pendingTasks} pendientes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Progreso de Tareas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Activity className="h-5 w-5 text-yellow-500 mr-2" />
                  <span className="text-2xl font-bold">
                    {stats.totalTasks > 0
                      ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
                      : 0}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.inProgressTasks} tareas en progreso
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Próximas Fechas Límite
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-2xl font-bold">{stats.upcomingDeadlines.length}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Tareas con vencimiento en los próximos 7 días
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Projects */}
          <Card>
            <CardHeader>
              <CardTitle>Proyectos Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.recentlyUpdatedProjects.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentlyUpdatedProjects.map(project => (
                    <div key={project.id} className="flex justify-between items-center border-b pb-3">
                      <div>
                        <h3 className="font-medium">{project.name}</h3>
                        <p className="text-sm text-muted-foreground">{project.status}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">Última actualización: {formatDate(project.updatedAt)}</p>
                        <Button variant="link" onClick={() => router.push(`/projects/${project.id}`)}>
                          Ver detalles
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-muted-foreground">
                  No hay proyectos para mostrar
                </p>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader>
              <CardTitle>Próximas Fechas Límite</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.upcomingDeadlines.length > 0 ? (
                <div className="space-y-4">
                  {stats.upcomingDeadlines.map(task => (
                    <div key={task.id} className="flex justify-between items-center border-b pb-3">
                      <div>
                        <h3 className="font-medium">{task.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Estado: {task.status}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">Vence: <span className="text-red-500 font-medium">{formatDate(task.dueDate)}</span></p>
                        <Button variant="link" onClick={() => router.push(`/tasks/${task.id}`)}>
                          Ver tarea
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-muted-foreground">
                  No hay fechas límite próximas
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Todos los Proyectos</CardTitle>
              <Button onClick={() => router.push('/projects')}>Ver todos</Button>
            </CardHeader>
            <CardContent>
              {projects.length > 0 ? (
                <div className="space-y-4">
                  {projects.slice(0, 5).map(project => (
                    <div key={project.id} className="flex justify-between items-center border-b pb-3">
                      <div>
                        <h3 className="font-medium">{project.name}</h3>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{project.team?.name || "Sin equipo asignado"}</span>
                        </div>
                      </div>
                      <div>
                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {project.status}
                        </div>
                        <p className="text-sm mt-1">
                          Fecha límite: {formatDate(project.endDate)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-muted-foreground">
                  No hay proyectos para mostrar
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Tareas Pendientes</CardTitle>
              <Button onClick={() => router.push('/tasks')}>Ver todas</Button>
            </CardHeader>
            <CardContent>
              {tasks.filter(t => t.status !== "done").length > 0 ? (
                <div className="space-y-4">
                  {tasks
                    .filter(t => t.status !== "done")
                    .slice(0, 5)
                    .map(task => (
                      <div key={task.id} className="flex justify-between items-center border-b pb-3">
                        <div>
                          <h3 className="font-medium">{task.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {task.description?.substring(0, 50)}
                            {task.description && task.description.length > 50 ? "..." : ""}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${task.status === "in_progress" ? "bg-yellow-100 text-yellow-800" :
                              task.status === "review" ? "bg-purple-100 text-purple-800" :
                              "bg-gray-100 text-gray-800"}`}>
                            {task.status}
                          </div>
                          {task.dueDate && (
                            <p className="text-sm mt-1 flex items-center justify-end">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatDate(task.dueDate)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-center py-4 text-muted-foreground">
                  No hay tareas pendientes
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Estado de Proyectos</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center items-center h-64">
                <div className="text-center">
                  <PieChart className="h-24 w-24 text-gray-400 mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    Próximamente: Gráfico de estado de proyectos
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tareas por Estado</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center items-center h-64">
                <div className="text-center">
                  <BarChart className="h-24 w-24 text-gray-400 mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    Próximamente: Gráfico de tareas por estado
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
