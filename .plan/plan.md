# Delivery Plan (reworked)

Goal: implement a small, well-typed Contact Us flow with a Deno backend (Hono),
Zod-first validation, and Drizzle-backed persistence. Organise work into four
sprints so issues/PRs are focused and reviewable.

Related specs:

- API contract: `.plan/specs/api-contract.md`
- Data model: `.plan/specs/data-model.md`

## Sprints

### Sprint 0 — Bootstrap (already done / baseline)

- Basic Deno + Hono server and minimal Vite app
- Import map, deno.json tasks, lint/check/test tasks
- Small example tests and cspell

### Sprint 1 — Database & Persistence (MUST complete first)

Purpose: full data layer with Drizzle and a contacts table ready for use by
the API. This sprint is Phase 1 in the tech-test mapping.

Core tasks:

- Add Drizzle config wired to an environment-driven DB file/URL
- Implement `contacts` table per `.plan/specs/data-model.md` (snake_case)
- Create repository functions: createContact, listContacts, getContactById,
  verifyContact, deleteContact
- Add a small seed or migration mechanism for local dev
- Export types (use Drizzle's InferModel) so repositories are strongly typed

Acceptance criteria:

- `deno test` runs fast and repository unit tests cover create/list/verify/delete
- DB file (or libSQL) is configurable via env and used by tests in-memory or
  via a temp file
- Repos return typed objects matching the shared Zod Contact schema

### Sprint 2 — Backend endpoints (API)

Purpose: implement the HTTP endpoints described in the API contract using
Zod-first validation and the repository layer from Sprint 1.

Core tasks:

- POST /api/contacts — validate with Zod, call createContact, return 201
- GET /api/contacts — support optional `q` search and `verified` filter
- PATCH /api/contacts/:id/verify — mark verified true
- DELETE /api/contacts/:id — remove contact, return 204
- Centralised error envelope: `{ ok: boolean, data?: T, error?: { code, message }}`
- Add basic integration tests for endpoints (happy path + 1-2 error cases)

Acceptance criteria:

- All endpoints conform to `.plan/specs/api-contract.md`
- Requests are validated with the shared Zod schemas in `shared/schema/*`
- Integration tests run under CI and pass locally (`deno test`)

### Sprint 3 — Frontend (Contact page + admin list)

Purpose: consumer UI for the API. Minimal, accessible, and testable.

Core tasks:

- Contact Us page with client-side Zod validation, posts to POST /api/contacts
- Thank You page after successful submit
- Admin Contacts list page that calls GET /api/contacts and supports verify/delete
- Keep styles minimal and responsive (no heavy design)

Acceptance criteria:

- UI performs validation matching server rules (shared Zod schemas)
- End-to-end manual flow works: submit contact → stored in DB → visible in list

### Sprint 4 — Polish & CI

Purpose: make the app robust and presentable; final checks.

Core tasks:

- Add CI (GitHub Actions) to run fmt, lint, check, and tests
- Improve logging and graceful shutdown (shutdown manager present)
- Add small accessibility and responsiveness fixes
- Add Postman / curl examples or README sections for running locally

Acceptance criteria:

- CI passes on main branch for the above checks
- README contains clear run & test instructions

## Working agreements

- Zod-first: Zod schemas in `shared/schema/*` are the source of truth.
- Small, focused PRs (1 feature / repo method / endpoint per PR)
- Tests: unit tests for repos, integration tests for endpoints, and basic UI
  smoke tests where feasible
- Keep dependencies minimal and prefer Deno std + Hono + Drizzle
