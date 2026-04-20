# Kanban Backend API

Node.js backend for Trello-like kanban board.

## Features

- JWT authentication and global roles (`USER`, `ADMIN`)
- Boards CRUD
- Columns CRUD for each board
- Tasks CRUD for each column
- Mark task completed
- Move tasks between columns (and reorder inside the column)
- Board invitations with board roles:
  - `EDITOR`: can manage columns/tasks, move tasks, toggle done
  - `MOVER`: can move tasks and toggle done only
- API documentation via Swagger UI

## Stack

- Node.js + Express
- Prisma ORM + SQLite
- Zod validation
- Swagger UI

## Setup

```bash
npm install
npm run prisma:migrate -- --name init
npm run prisma:generate
npm run dev
```

Server:

- API: http://localhost:4000/api
- Swagger: http://localhost:4000/api/docs
- Health: http://localhost:4000/health

## Environment

See `.env`:

```env
DATABASE_URL="file:./dev.db"
PORT=4000
JWT_SECRET="super-secret-change-me"
JWT_EXPIRES_IN="7d"
```

## Main Endpoints

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Boards

- `GET /api/boards`
- `POST /api/boards`
- `GET /api/boards/:boardId`
- `PATCH /api/boards/:boardId`
- `DELETE /api/boards/:boardId`

### Board invitations and members

- `GET /api/boards/:boardId/invitations`
- `POST /api/boards/:boardId/invitations`
- `PATCH /api/boards/:boardId/members/:memberId`
- `DELETE /api/boards/:boardId/members/:memberId`
- `POST /api/invitations/:token/accept`
- `POST /api/invitations/:token/decline`

### Columns

- `POST /api/columns/boards/:boardId/columns`
- `PATCH /api/columns/:columnId`
- `DELETE /api/columns/:columnId`

### Tasks

- `POST /api/tasks/columns/:columnId/tasks`
- `PATCH /api/tasks/:taskId`
- `DELETE /api/tasks/:taskId`
- `PATCH /api/tasks/:taskId/toggle`
- `PATCH /api/tasks/:taskId/move`

## Notes

- `ADMIN` bypasses board role checks.
- Board owner has full board permissions.
- Invitation acceptance checks that authenticated user email matches invitation email.
