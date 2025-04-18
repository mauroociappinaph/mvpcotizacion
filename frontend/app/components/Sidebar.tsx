"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../../lib/utils";
import {
  Home,
  BarChart3,
  CheckSquare,
  MessageSquare,
  Users,
  Folder,
  Calendar,
  Settings,
  LogOut,
  LayoutDashboard
} from "lucide-react";
import { useAuthStore } from "../lib/store/authStore";

const mainNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/tasks", label: "Tareas", icon: CheckSquare },
  { href: "/kanban", label: "Tablero Kanban", icon: LayoutDashboard },
  { href: "/projects", label: "Proyectos", icon: Folder },
  { href: "/teams", label: "Equipos", icon: Users },
  { href: "/messages", label: "Mensajes", icon: MessageSquare },
  { href: "/calendar", label: "Calendario", icon: Calendar },
  { href: "/reports", label: "Reportes", icon: BarChart3 },
];

const configNavItems = [
  { href: "/settings", label: "Configuración", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuthStore();

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-gray-50 border-r border-gray-200 flex flex-col py-4 px-2">
      <div className="px-4 mb-6">
        <h1 className="text-xl font-bold text-primary">MVPCotización</h1>
      </div>

      <div className="flex-1 flex flex-col gap-2">
        <div className="px-2">
          <h2 className="text-xs font-semibold text-gray-500 px-2 py-1 uppercase">Principal</h2>
          <nav className="mt-1 flex flex-col gap-1">
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-gray-700 hover:bg-gray-200/50"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="px-2 mt-4">
          <h2 className="text-xs font-semibold text-gray-500 px-2 py-1 uppercase">Configuración</h2>
          <nav className="mt-1 flex flex-col gap-1">
            {configNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-gray-700 hover:bg-gray-200/50"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="mt-auto px-2">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors text-red-600 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
}
