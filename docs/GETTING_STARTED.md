# Getting Started

This project is a Deno + React (Vite) app with a simple API (Hono) and a frontend.

You can run it two ways:

- Docker Compose (recommended for reviewers)
- Deno locally

## Docker Compose (dev)

Prerequisites: Docker Desktop (or Docker Engine) installed.

```powershell
# From repo root
docker compose up -d --build
# API: http://localhost:8000
# Web: http://localhost:5173
```

The compose file starts:

- backend: Deno API at 8000
- frontend: Vite dev server at 5173 (proxying "/api" to the backend)

On startup, the API service automatically runs `deno task db:push` so the SQLite
database file exists before serving requests.

To view logs and stop:

```powershell
docker compose logs -f
docker compose down
```

## Deno locally

Prerequisites: Deno v2.x installed.

```sh
# Install Playwright browser if you plan to run E2E
deno task e2e:install

# Start API and Web (dev)
deno task dev
# API: http://localhost:8000
# Web: http://localhost:3000

# Run unit tests
deno task test

# Run E2E tests
deno task e2e
```

## Project structure

- backend/: API (Hono), DB (Drizzle/libsql)
- frontend/: React app, Vite config, tests
- shared/: shared schemas
- .config/: build/test configuration
- docs/: documentation

See also docs/API_EXAMPLES.md and docs/CI.md.
