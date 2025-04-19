"use client";

import { useState } from "react";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import MainLayout from "../components/layout/MainLayout";
import {
  Card,
  CardContent,
  CardHeader,
  Button,
  Input,
  Label,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Separator
} from "../components/ui";
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  Palette,
  Globe,
  Key,
  Save
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  // Theme state
  const [theme, setTheme] = useState("light");

  // Language state
  const [language, setLanguage] = useState("es");

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [taskNotifications, setTaskNotifications] = useState(true);
  const [messageNotifications, setMessageNotifications] = useState(true);

  // Security settings
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handleSaveSettings = () => {
    // Save settings logic would go here
    console.log({
      theme,
      language,
      notifications: {
        email: emailNotifications,
        push: pushNotifications,
        tasks: taskNotifications,
        messages: messageNotifications
      },
      security: {
        twoFactor: twoFactorEnabled
      }
    });

    // Show success message or handle errors
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6">Configuración</h1>

          <Card>
            <CardHeader>
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="general" className="flex items-center">
                    <SettingsIcon className="h-4 w-4 mr-2" /> General
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="flex items-center">
                    <Bell className="h-4 w-4 mr-2" /> Notificaciones
                  </TabsTrigger>
                  <TabsTrigger value="appearance" className="flex items-center">
                    <Palette className="h-4 w-4 mr-2" /> Apariencia
                  </TabsTrigger>
                  <TabsTrigger value="security" className="flex items-center">
                    <Shield className="h-4 w-4 mr-2" /> Seguridad
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>

            <CardContent className="pt-6">
              <TabsContent value="general" className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Configuración General</h3>
                  <p className="text-sm text-muted-foreground">
                    Configura las opciones básicas de la aplicación
                  </p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Idioma</Label>
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                      <select
                        id="language"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      >
                        <option value="es">Español</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Zona Horaria</Label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    >
                      <option value="America/Argentina/Buenos_Aires">Argentina (GMT-3)</option>
                      <option value="America/Mexico_City">Mexico (GMT-6)</option>
                      <option value="America/Santiago">Chile (GMT-4)</option>
                      <option value="Europe/Madrid">España (GMT+1)</option>
                    </select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Preferencias de Notificaciones</h3>
                  <p className="text-sm text-muted-foreground">
                    Configura cómo y cuándo recibes notificaciones
                  </p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Notificaciones por Email</p>
                      <p className="text-sm text-muted-foreground">Recibe notificaciones por email</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="email-notifications"
                        checked={emailNotifications}
                        onChange={() => setEmailNotifications(!emailNotifications)}
                        className="toggle"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Notificaciones Push</p>
                      <p className="text-sm text-muted-foreground">Recibe notificaciones en el navegador</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="push-notifications"
                        checked={pushNotifications}
                        onChange={() => setPushNotifications(!pushNotifications)}
                        className="toggle"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Notificación de Tareas</p>
                      <p className="text-sm text-muted-foreground">Recibe alertas sobre tus tareas</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="task-notifications"
                        checked={taskNotifications}
                        onChange={() => setTaskNotifications(!taskNotifications)}
                        className="toggle"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Notificación de Mensajes</p>
                      <p className="text-sm text-muted-foreground">Recibe alertas sobre nuevos mensajes</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="message-notifications"
                        checked={messageNotifications}
                        onChange={() => setMessageNotifications(!messageNotifications)}
                        className="toggle"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="appearance" className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Apariencia</h3>
                  <p className="text-sm text-muted-foreground">
                    Personaliza la apariencia de la aplicación
                  </p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Tema</Label>
                    <div className="flex flex-wrap gap-4">
                      <div
                        className={`border rounded-md p-4 cursor-pointer flex items-center justify-center ${
                          theme === "light" ? "bg-blue-50 border-blue-500" : ""
                        }`}
                        onClick={() => setTheme("light")}
                      >
                        <div className="bg-white border rounded-full h-8 w-8 mr-2"></div>
                        <span>Claro</span>
                      </div>

                      <div
                        className={`border rounded-md p-4 cursor-pointer flex items-center justify-center ${
                          theme === "dark" ? "bg-blue-50 border-blue-500" : ""
                        }`}
                        onClick={() => setTheme("dark")}
                      >
                        <div className="bg-gray-800 border rounded-full h-8 w-8 mr-2"></div>
                        <span>Oscuro</span>
                      </div>

                      <div
                        className={`border rounded-md p-4 cursor-pointer flex items-center justify-center ${
                          theme === "system" ? "bg-blue-50 border-blue-500" : ""
                        }`}
                        onClick={() => setTheme("system")}
                      >
                        <div className="bg-gradient-to-r from-white to-gray-800 border rounded-full h-8 w-8 mr-2"></div>
                        <span>Sistema</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="security" className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Seguridad</h3>
                  <p className="text-sm text-muted-foreground">
                    Configura opciones de seguridad de tu cuenta
                  </p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Autenticación de Dos Factores</p>
                      <p className="text-sm text-muted-foreground">
                        Aumenta la seguridad de tu cuenta requiriendo un segundo factor de autenticación
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="two-factor"
                        checked={twoFactorEnabled}
                        onChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
                        className="toggle"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="current-password">Cambiar Contraseña</Label>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Input type="password" id="current-password" placeholder="Contraseña actual" />
                      </div>
                      <div className="space-y-2">
                        <Input type="password" id="new-password" placeholder="Nueva contraseña" />
                      </div>
                      <div className="space-y-2">
                        <Input type="password" id="confirm-password" placeholder="Confirmar contraseña" />
                      </div>
                      <Button>
                        <Key className="h-4 w-4 mr-2" />
                        Actualizar Contraseña
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </CardContent>

            <div className="px-6 py-4 border-t flex justify-end">
              <Button onClick={handleSaveSettings}>
                <Save className="h-4 w-4 mr-2" />
                Guardar Configuración
              </Button>
            </div>
          </Card>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
