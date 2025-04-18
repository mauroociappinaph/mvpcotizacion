'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Calendar, Clock } from 'lucide-react';
import { useProjectStore } from '../lib/store/projectStore';
import MainLayout from '../components/layout/MainLayout';
import ProtectedRoute from '../components/auth/ProtectedRoute';

export default function ProjectsPage() {
  const { projects, isLoading, error, fetchProjects } = useProjectStore();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Filtrar proyectos por nombre
  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Sin fecha';
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Activo';
      case 'completed':
        return 'Completado';
      case 'on-hold':
        return 'En espera';
      default:
        return status;
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="max-w-7xl mx-auto">
          <p className="text-center">Cargando proyectos...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-red-500">Error: {error}</p>
        </div>
      );
    }

    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Proyectos</h1>

          <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Buscar proyectos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-5 w-5 mr-2" />
              Nuevo Proyecto
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200"
              >
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    {project.name}
                  </h3>
                  <span
                    className={`inline-flex mt-2 items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                      project.status
                    )}`}
                  >
                    {getStatusLabel(project.status)}
                  </span>
                </div>
                <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                    {project.description || 'Sin descripción'}
                  </p>
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Inicio: {formatDate(project.startDate)}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Fin: {formatDate(project.endDate)}</span>
                    </div>
                  </div>
                  {project._count && (
                    <div className="mt-3 text-sm text-gray-500">
                      {project._count.tasks} tareas
                    </div>
                  )}
                </div>
                <div className="border-t border-gray-200 px-4 py-3">
                  <a
                    href={`/projects/${project.id}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    Ver detalles
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-8 text-center">
              <p className="text-gray-500">
                No se encontraron proyectos. Crea un nuevo proyecto para comenzar.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        {renderContent()}
      </MainLayout>
    </ProtectedRoute>
  );
}
