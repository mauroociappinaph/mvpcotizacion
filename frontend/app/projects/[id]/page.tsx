"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProjectStore } from "../../../lib/store/projectStore";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Skeleton
} from "../../../components/ui";
import { CalendarIcon, Edit, Users, X } from "lucide-react";
import { format } from "date-fns";
import TaskList from "../../../components/projects/TaskList";

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { currentProject, fetchProject, error } = useProjectStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProject = async () => {
      setIsLoading(true);
      await fetchProject(id);
      setIsLoading(false);
    };

    loadProject();
  }, [id, fetchProject]);

  const getStatusClass = (status: string) => {
    switch (status) {
      case "NOT_STARTED":
        return "bg-gray-400";
      case "IN_PROGRESS":
        return "bg-blue-500";
      case "COMPLETED":
        return "bg-green-500";
      case "ON_HOLD":
        return "bg-yellow-500";
      case "CANCELLED":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "NOT_STARTED":
        return "Not Started";
      case "IN_PROGRESS":
        return "In Progress";
      case "COMPLETED":
        return "Completed";
      case "ON_HOLD":
        return "On Hold";
      case "CANCELLED":
        return "Cancelled";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not set";
    return format(new Date(dateString), "PPP");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-24" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-full max-w-md mb-2" />
            <Skeleton className="h-4 w-20" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-6">
            <div className="flex items-center text-red-500 mb-2">
              <X className="mr-2 h-5 w-5" />
              <h3 className="text-lg font-medium">Error</h3>
            </div>
            <p>{error}</p>
            <Button
              className="mt-4"
              variant="outline"
              onClick={() => router.push("/projects")}
            >
              Back to Projects
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="container mx-auto p-6">
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="pt-6">
            <p className="text-yellow-700">Project not found</p>
            <Button
              className="mt-4"
              variant="outline"
              onClick={() => router.push("/projects")}
            >
              Back to Projects
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Project Details</h1>
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={() => router.push("/projects")}
          >
            Back to Projects
          </Button>
          <Button onClick={() => router.push(`/projects/${id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Project
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">{currentProject.name}</CardTitle>
              <Badge className={getStatusClass(currentProject.status)}>
                {getStatusLabel(currentProject.status)}
              </Badge>
            </div>
            <div className="text-sm text-gray-500">
              <p>Created: {formatDate(currentProject.createdAt)}</p>
              <p>Last updated: {formatDate(currentProject.updatedAt)}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-line">{currentProject.description || "No description provided."}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  Timeline
                </h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Start Date:</span> {formatDate(currentProject.startDate)}</p>
                  <p><span className="font-medium">End Date:</span> {formatDate(currentProject.endDate)}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Team
                </h3>
                <p>
                  {currentProject.team
                    ? currentProject.team.name
                    : "No team assigned"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <TaskList projectId={id} />
    </div>
  );
}
