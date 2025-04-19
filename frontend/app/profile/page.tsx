"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "../lib/store/authStore";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import MainLayout from "../components/layout/MainLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Textarea,
  Avatar,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Alert,
  AlertDescription
} from "../components/ui";
import { Camera, Check, User, Shield, Bell, Key } from "lucide-react";

export default function ProfilePage() {
  const { user, isLoading, error, updateUserProfile } = useAuthStore();

  const [activeTab, setActiveTab] = useState("general");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    image: ""
  });
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
        image: user.image || ""
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await updateUserProfile(formData);
      setSuccessMessage("Perfil actualizado correctamente");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6">Mi Perfil</h1>

          {isLoading && <p>Cargando perfil...</p>}

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {successMessage && (
            <Alert className="mb-4 bg-green-50 border-green-200">
              <Check className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-600">{successMessage}</AlertDescription>
            </Alert>
          )}

          {!isLoading && user && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className="relative">
                        <Avatar className="h-24 w-24">
                          {user.image ? (
                            <img src={user.image} alt={user.name} />
                          ) : (
                            <User className="h-12 w-12" />
                          )}
                        </Avatar>
                        <button className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full">
                          <Camera className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <CardTitle>{user.name}</CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium">Miembro desde</p>
                        <p className="text-sm text-muted-foreground">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Rol</p>
                        <div className="flex items-center">
                          <Shield className="h-4 w-4 mr-2 text-blue-500" />
                          <p className="text-sm text-muted-foreground">Usuario</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="grid grid-cols-3">
                        <TabsTrigger value="general" className="flex items-center">
                          <User className="h-4 w-4 mr-2" /> General
                        </TabsTrigger>
                        <TabsTrigger value="notifications" className="flex items-center">
                          <Bell className="h-4 w-4 mr-2" /> Notificaciones
                        </TabsTrigger>
                        <TabsTrigger value="security" className="flex items-center">
                          <Key className="h-4 w-4 mr-2" /> Seguridad
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </CardHeader>

                  <CardContent>
                    <TabsContent value="general" className="mt-0">
                      <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="name">Nombre</Label>
                              <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email">Email</Label>
                              <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                              id="bio"
                              name="bio"
                              value={formData.bio}
                              onChange={handleChange}
                              placeholder="Cuéntanos sobre ti..."
                              rows={4}
                            />
                          </div>
                        </div>

                        <div className="mt-6">
                          <Button type="submit">Guardar Cambios</Button>
                        </div>
                      </form>
                    </TabsContent>

                    <TabsContent value="notifications" className="mt-0">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Preferencias de Notificaciones</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Notificaciones por Email</p>
                              <p className="text-sm text-muted-foreground">Recibe notificaciones por email</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input type="checkbox" id="email-notifications" className="toggle" />
                            </div>
                          </div>

                          <Separator />

                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Notificaciones Push</p>
                              <p className="text-sm text-muted-foreground">Recibe notificaciones en el navegador</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input type="checkbox" id="push-notifications" className="toggle" defaultChecked />
                            </div>
                          </div>

                          <Separator />

                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Notificación de Tareas Asignadas</p>
                              <p className="text-sm text-muted-foreground">Recibe alertas cuando te asignen una tarea</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input type="checkbox" id="task-notifications" className="toggle" defaultChecked />
                            </div>
                          </div>
                        </div>

                        <div className="mt-6">
                          <Button>Guardar Preferencias</Button>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="security" className="mt-0">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Cambiar Contraseña</h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="current-password">Contraseña Actual</Label>
                            <Input id="current-password" type="password" />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="new-password">Nueva Contraseña</Label>
                            <Input id="new-password" type="password" />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
                            <Input id="confirm-password" type="password" />
                          </div>
                        </div>

                        <div className="mt-6">
                          <Button>Actualizar Contraseña</Button>
                        </div>
                      </div>
                    </TabsContent>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
