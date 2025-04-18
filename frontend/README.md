# Frontend de Turma

Este es el frontend de la aplicación Turma, desarrollado con Next.js, TypeScript y React.

## Estructura del Proyecto

```
frontend/
├── app/
│   ├── api/                   # API routes
│   ├── auth/                  # Páginas de autenticación
│   │   ├── login/             # Página de login
│   │   └── register/          # Página de registro
│   ├── components/            # Componentes reutilizables
│   │   ├── auth/              # Componentes de autenticación
│   │   └── layout/            # Componentes de layout
│   ├── lib/                   # Bibliotecas y utilidades
│   │   ├── services/          # Servicios para comunicación con API
│   │   ├── store/             # Estados globales (Zustand)
│   │   └── types/             # Interfaces TypeScript
│   ├── projects/              # Páginas de proyectos
│   ├── tasks/                 # Páginas de tareas
│   └── page.tsx               # Página principal (Dashboard)
├── public/                    # Archivos estáticos
└── next.config.js             # Configuración de Next.js
```

## Tecnologías Principales

- **Next.js**: Framework de React para aplicaciones web.
- **TypeScript**: Superset tipado de JavaScript.
- **Zustand**: Manejo de estado global.
- **Tailwind CSS**: Framework CSS para estilos.
- **httplazy**: Cliente HTTP para comunicación con la API.
- **shadcn/ui**: Componentes UI.

## Uso de httplazy

Este proyecto utiliza `httplazy` como cliente HTTP para todas las comunicaciones con el backend. `httplazy` es una biblioteca ligera y fácil de usar para realizar peticiones HTTP.

### Configuración

La configuración de `httplazy` se encuentra en `app/lib/services/api.ts`:

```typescript
import { http } from "httplazy";

// Configurar la URL base para las peticiones
http.defaults.baseURL = BASE_URL;
http.defaults.headers["Content-Type"] = "application/json";

// Configurar interceptores para añadir el token de autenticación
http.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
  }
  return config;
});

// Interceptores para manejar errores de autenticación
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);
```

### Ejemplo de uso

```typescript
// Obtener todos los proyectos
const getProjects = async (): Promise<Project[]> => {
  const response = await http.get<Project[]>("/api/projects");
  return response.data;
};

// Crear un nuevo proyecto
const createProject = async (projectData: ProjectData): Promise<Project> => {
  const response = await http.post<Project>("/api/projects", projectData);
  return response.data;
};
```

## Estructura de tipos

Todas las interfaces de TypeScript están definidas en archivos separados en el directorio `app/lib/types/`:

- `api.types.ts`: Tipos para peticiones y respuestas de la API.
- `auth.types.ts`: Tipos para autenticación y usuarios.
- `project.types.ts`: Tipos para proyectos.
- `task.types.ts`: Tipos para tareas.

## Estados Globales

Los estados globales se manejan con Zustand y están definidos en el directorio `app/lib/store/`:

- `authStore.ts`: Estado de autenticación.
- `projectStore.ts`: Estado de proyectos.
- `taskStore.ts`: Estado de tareas.

## Desarrollo

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

Para compilar el proyecto:

```bash
npm run build
```

Para iniciar el servidor en producción:

```bash
npm start
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.
