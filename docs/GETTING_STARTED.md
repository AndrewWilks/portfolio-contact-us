# Getting Started

This project is a Deno + React (Vite) app with a simple API (Hono) and a frontend.

You can run it two ways:

- Docker Compose (recommended for reviewers)
- Deno locally

## Docker Compose (dev)

Prerequisites: Docker Desktop (or Docker Engine) installed.

```powershell
# From repo root
docker compose -f ./.docker/docker-compose.yml up
# API: http://localhost:8000
# Web: http://localhost:3000
```

The compose file starts:

- api: Deno server at 8000
- web: Vite dev server at 3000 (proxying to api)

On startup, the API service automatically runs `deno task db:push` so the SQLite
database file exists before serving requests.

Stop with Ctrl+C, then:

```powershell
docker compose -f ./.docker/docker-compose.yml down
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
