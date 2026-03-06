## Local development environment (Docker)

Issue #2 requires local infrastructure for development: PostgreSQL + Redis, environment templates, and setup docs.

### Prerequisites

- Node.js 18+
- Docker Desktop (Docker Engine + Docker Compose)

### 1) Configure environment variables

Create local env files from templates:

- Repo root (optional overrides used by Docker Compose):
  - Copy `.env.example` → `.env`
- Backend:
  - Copy `server/.env.example` → `server/.env`
- Web client:
  - Copy `client/.env.example` → `client/.env`
- Mobile (Expo):
  - Copy `mobile/.env.example` → `mobile/.env`

### 2) Start PostgreSQL + Redis

Make sure Docker Desktop is running first.

From the repo root:

```bash
docker compose up -d
docker compose ps
```

You should see `helpinghand-postgres` and `helpinghand-redis` running and eventually `healthy`.

If you see an error like “open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified”, Docker Desktop (the engine) isn’t running or isn’t fully started yet. Start Docker Desktop and retry the commands.

### 3) Sanity checks (optional but recommended)

Postgres:

```bash
docker exec -it helpinghand-postgres psql -U helpinghand -d helpinghand_dev -c "select 1;"
```

Redis:

```bash
docker exec -it helpinghand-redis redis-cli ping
```

### 4) Stop services

```bash
docker compose down
```

To remove persisted data as well:

```bash
docker compose down -v
```

