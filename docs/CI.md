# CI overview

The GitHub Actions pipeline validates the project end-to-end:

- Format: deno fmt
- Lint: deno lint
- Type check: deno check (selected entrypoints)
- DB migration push + backend unit tests
- E2E tests with Playwright (chromium)
- Spell check (cspell)

Notes:

- E2E uses a Deno-native Playwright config under `.config/playwright.config.ts`.
  The web server is started via `deno task dev` and re-used between tests.
- The API requires `--allow-ffi --allow-env --allow-net` and in CI also
  `--allow-sys` for certain npm drivers; the `dev:api` task includes these.
- Unit tests are scoped to `backend/__tests__`; frontend E2E specs are excluded
  from the Deno unit runner via `deno.json` test include/exclude.

## Running locally

```powershell
# Format, lint, check
 deno task format
 deno task lint
 deno task check

# Unit tests
 deno task test

# Install browsers and run E2E
 deno task e2e:install
 deno task e2e
```

Set the frontend port via env if needed (default 5173):

```powershell
$env:FRONTEND_PORT=3001
deno task e2e
```

## Run with Docker Compose

```powershell
# From repo root
docker compose up -d --build
# API: http://localhost:8000
# Web: http://localhost:5173

# Tail logs
docker compose logs -f

# Stop
docker compose down
```
