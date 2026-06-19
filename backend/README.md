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
- Prisma ORM + PostgreSQL
- Zod validation
- Swagger UI

## Setup

```bash
npm install
npm run prisma:migrate -- --name init
npm run prisma:generate
npm run dev
```

## Local Development Without Docker

Use a regular PostgreSQL service on your machine (recommended for stable local dev).

1. Install PostgreSQL and make sure the service is running on `localhost:5432`.
2. Create database and user.
3. Set `DATABASE_URL` in `.env`.
4. Run:

```bash
npm install
npm run prisma:generate
npm run prisma:deploy
npm run dev
```

`npm run dev` now performs `db:check` before startup and prints a clear reason if the database is unavailable.

Server:

- API: http://localhost:4000/api
- Swagger: http://localhost:4000/api/docs
- Health: http://localhost:4000/health

## Environment

See `.env`:

```env
DATABASE_URL="postgresql://kanban_user:change_me@localhost:5432/kanban_db?schema=public"
PORT=4000
JWT_SECRET="super-secret-change-me"
JWT_EXPIRES_IN="7d"
DB_CONNECT_RETRIES=10
DB_CONNECT_RETRY_DELAY_MS=1500
```

- `DB_CONNECT_RETRIES`: how many times backend retries PostgreSQL connection on startup.
- `DB_CONNECT_RETRY_DELAY_MS`: delay between retries.

## Production Deploy (Ubuntu + PM2 + PostgreSQL)

1. Install Node.js LTS, npm, PostgreSQL, and PM2.
2. Create app directory and upload backend files.

```bash
cd /var/www/kanban/backend
npm install
```

3. Create PostgreSQL database and user.

```bash
sudo -u postgres psql
CREATE USER kanban_user WITH PASSWORD 'strong_password';
CREATE DATABASE kanban_db OWNER kanban_user;
GRANT ALL PRIVILEGES ON DATABASE kanban_db TO kanban_user;
\q
```

4. Configure `.env`.

```env
DATABASE_URL="postgresql://kanban_user:strong_password@localhost:5432/kanban_db?schema=public"
PORT=4000
JWT_SECRET="replace-with-strong-random-secret"
JWT_EXPIRES_IN="7d"
```

5. Run Prisma in production mode.

```bash
npx prisma generate
npx prisma migrate deploy
```

6. Start backend.

```bash
npm run start
```

`npm run start` performs `db:check` and `prisma migrate deploy` before launching the server.

7. Run with PM2 (recommended).

```bash
pm2 start npm --name backend -- run start
pm2 save
pm2 startup
```

8. Verify service.

- `http://SERVER_IP:4000/health`
- `http://SERVER_IP:4000/api/docs`

Note: If you previously used SQLite migrations, create and test PostgreSQL migrations in a development/staging environment before production deploy.

## Troubleshooting

If you see `Can't reach database server at localhost:5432`:

1. Verify PostgreSQL is running (service or container).
2. Verify `DATABASE_URL` in `.env`.
3. Run `npm run db:check`.
4. Run `npm run prisma:deploy`.
5. Start backend with `npm run dev`.

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
- `GET /api/tasks/:taskId/comments`
- `POST /api/tasks/:taskId/comments`
- `DELETE /api/tasks/:taskId/comments/:commentId`

## Notes

- `ADMIN` bypasses board role checks.
- Board owner has full board permissions.
- Invitation acceptance checks that authenticated user email matches invitation email.
