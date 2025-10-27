# Portfolio Contact Us

Deno + Hono API with a React (Vite) frontend. Minimal contact form + admin view, shared Zod schemas, Drizzle ORM (libSQL), and an E2E test suite.

[![CI](https://github.com/AndrewWilks/portfolio-contact-us/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/AndrewWilks/portfolio-contact-us/actions/workflows/ci.yml)
[![Deno](https://img.shields.io/badge/Deno-2.x-000000?logo=deno&logoColor=white)](https://deno.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Playwright](https://img.shields.io/badge/Playwright-E2E-45ba4b?logo=playwright)](https://playwright.dev)

## Quick start

Run with Docker Compose (recommended):

```powershell
# From repo root
docker compose up -d --build
```

- API: <http://localhost:8000>
- Web (Vite dev server with proxy): <http://localhost:5173>

View logs and stop:

```powershell
docker compose logs -f
docker compose down
```

Or run locally with Deno v2:

```powershell
deno task dev
```

## Docs

- Getting started: `docs/GETTING_STARTED.md`
- API examples: `docs/API_EXAMPLES.md`
- CI overview: `docs/CI.md`

## Tech

- Backend: Deno, Hono, Drizzle ORM (libSQL)
- Frontend: React 19, Vite 7, Tailwind
- Router/Query: TanStack Router + Query
- Validation: Zod (shared)
- Tests: Deno (unit), Playwright (E2E)

Note: The Docker Compose setup automatically runs a database push (`deno task db:push`)
before starting the API so the SQLite file is present.

## About the developer

Built by Andrew Wilks - Brisbane-based full‑stack developer transitioning from the Microsoft Power Platform into full‑stack engineering.

- Focus: React/Next.js, TypeScript, Node.js, PostgreSQL; clean UX, reliable APIs, and CI/CD
- Currently shipping: Portfolio Tracker, Dev Standards presets, and a SaaS Starter
- Core skills: React, Next.js, TanStack Query, Node.js (REST), Drizzle ORM, PostgreSQL, Docker, GitHub Actions, Vitest, Playwright

Links:

- Website: <https://andrewwilks.au/>
- LinkedIn: <https://www.linkedin.com/in/andrew-wilksy/>
- GitHub: <https://github.com/AndrewWilks>
