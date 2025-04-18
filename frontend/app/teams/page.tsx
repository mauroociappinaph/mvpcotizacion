"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input
} from "../components/ui";
import { Plus, Search, Users, UserPlus, Settings, Trash2 } from "lucide-react";

// Supongamos que esto vendría de una API o store
interface Team {
  id: string;
  name: string;
  description?: string;
  members: number;
  createdAt: string;
}

export default function TeamsPage() {
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Simular carga de datos
    const loadTeams = async () => {
      setIsLoading(true);
      try {
        // En un caso real, esto sería una llamada a la API
        // Datos de ejemplo
        const mockTeams: Team[] = [
          {
            id: "1",
            name: "Desarrollo",
            description: "Equipo de desarrollo de software",
            members: 5,
            createdAt: "2023-01-15"
          },
          {
            id: "2",
            name: "Diseño",
            description: "Equipo de diseño UI/UX",
            members: 3,
            createdAt: "2023-02-20"
          },
          {
            id: "3",
            name: "Marketing",
            description: "Equipo de marketing digital",
            members: 4,
            createdAt: "2023-03-10"
          },
          {
            id: "4",
            name: "Ventas",
            description: "Equipo de ventas y relaciones con clientes",
            members: 6,
            createdAt: "2023-04-05"
          }
        ];

        // Simular retraso de red
        await new Promise(resolve => setTimeout(resolve, 800));
        setTeams(mockTeams);
      } catch (error) {
        console.error("Error cargando equipos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTeams();
  }, []);

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (team.description && team.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Equipos</h1>
        <Button onClick={() => router.push('/teams/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Equipo
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            className="pl-10"
            placeholder="Buscar equipos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="bg-gray-100 h-16"></CardHeader>
              <CardContent className="pt-4">
                <div className="bg-gray-100 h-20 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredTeams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map(team => (
            <TeamCard
              key={team.id}
              team={team}
              onView={() => router.push(`/teams/${team.id}`)}
              onAddMember={() => router.push(`/teams/${team.id}/members/add`)}
              onEdit={() => router.push(`/teams/${team.id}/edit`)}
              onDelete={() => {
                // Mostrar confirmación y eliminar
                if (confirm(`¿Estás seguro de eliminar el equipo "${team.name}"?`)) {
                  console.log("Eliminar equipo:", team.id);
                  // En un caso real, llamaríamos a la API para eliminar
                  setTeams(teams.filter(t => t.id !== team.id));
                }
              }}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-lg font-medium">No se encontraron equipos</p>
            <p className="text-muted-foreground mb-4">
              {searchQuery
                ? `No hay resultados para "${searchQuery}"`
                : "Aún no hay equipos creados"}
            </p>
            <Button
              onClick={() => router.push('/teams/new')}
              className="mx-auto mt-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Crear Nuevo Equipo
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface TeamCardProps {
  team: Team;
  onView: () => void;
  onAddMember: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function TeamCard({ team, onView, onAddMember, onEdit, onDelete }: TeamCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-700 text-white">
        <CardTitle className="flex justify-between items-center">
          <span>{team.name}</span>
          <span className="flex items-center text-sm font-normal">
            <Users className="h-4 w-4 mr-1" />
            {team.members}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-sm text-gray-500 mb-4">
          {team.description || "Sin descripción"}
        </p>
        <div className="flex justify-between items-center">
          <Button variant="outline" size="sm" onClick={onView}>
            Ver Equipo
          </Button>
          <div className="flex space-x-1">
            <Button variant="ghost" size="sm" onClick={onAddMember} title="Añadir miembro">
              <UserPlus className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onEdit} title="Editar equipo">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onDelete} title="Eliminar equipo">
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
