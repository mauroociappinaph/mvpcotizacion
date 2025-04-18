# Turma - Team Collaboration Platform

Turma is a SaaS application designed for small teams (2-20 people) that facilitates internal communication, task management, and project tracking in one place.

## Project Structure

This project is organized into two main parts:

- **Frontend**: Next.js with TypeScript, Zustand for state management, and TailwindCSS for styling.
- **Backend**: Node.js with Express, Prisma ORM with SQLite.

## Features

- User authentication
- Task management
- Project and team organization
- Real-time chat
- Notifications
- Document sharing

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd turma
```

2. Install dependencies for both frontend and backend:

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Set up the database:

```bash
# From the backend directory
npx prisma migrate dev --name init
```

4. Start the development servers:

```bash
# Start the backend (from the backend directory)
npm run dev

# Start the frontend (from the frontend directory)
npm run dev
```

5. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## Development Workflow

### Frontend

The frontend is built with Next.js and follows a component-based architecture. Key directories:

- `app/components`: Reusable UI components
- `app/lib/store`: Zustand state management
- `app/lib/services`: API service functions

### Backend

The backend follows a controller-service-repository pattern:

- `src/controllers`: HTTP request handlers
- `src/services`: Business logic
- `src/repositories`: Data access
- `src/routes`: API route definitions

## API Endpoints

### Tasks

- `GET /api/tasks`: Get all tasks
- `GET /api/tasks/:id`: Get a task by ID
- `POST /api/tasks`: Create a new task
- `PUT /api/tasks/:id`: Update a task
- `DELETE /api/tasks/:id`: Delete a task

### Projects

- `GET /api/projects`: Get all projects
- `GET /api/projects/:id`: Get a project by ID
- `POST /api/projects`: Create a new project

### Teams

- `GET /api/teams`: Get all teams the user belongs to

### Authentication

- `POST /api/auth/login`: User login
- `POST /api/auth/register`: User registration
