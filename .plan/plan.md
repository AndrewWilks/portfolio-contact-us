# Delivery Plan

Scope, a simple contact flow, a public Contact page that submits to an API, a
Thank You page, and an internal Contacts list with verify and delete actions.
Keep the codebase small, typed, and portable across machines with Deno.

> Note:
>
> - Please see `./spec/api-contract.md` for the initial API contract.
> - Please see `./spec/data-model.md` for the initial data model.
> - Please see `Junior Software Engineer Tech Test.pdf` for the original spec.

## Phases

### Phase 0, bootstrap

- API hello routes, `/api/health`, `/api/hello`
- Vite app home page, fetches `/api/hello`
- Basic tests, Deno tests for API, Vitest for UI
- Central configs in `.config`, spelling via cspell

### Phase 1, foundation

- Shared schema via Zod in `backend/db/schema` and `shared`.
- Request validation with Hono's `@hono/zod-validator` middleware (see Phase 1 tasks).
- Error response envelope, `{ ok, data?, error? }` with consistent error codes.
- Build out backend API endpoints required by the frontend for contacts: `POST /api/contacts`, `GET /api/contacts`, `PATCH /api/contacts/:id/verify`, `DELETE /api/contacts/:id`.

Acceptance criteria for Phase 1:

- A shared Zod schema for `ContactCreate` and `Contact` is present in `shared/schema` and used by backend handlers.
- `POST /api/contacts` validates incoming JSON using `@hono/zod-validator` and returns `201` with the created `Contact` in the `{ ok: true, data }` envelope on success.
- `GET /api/contacts` supports optional `q` (string) and `verified` (boolean) query params and returns `200` with `{ ok: true, data: Contact[] }`.
- `PATCH /api/contacts/:id/verify` returns `200` with the updated `Contact` object.
- `DELETE /api/contacts/:id` returns `204` on success.
- Validation failures return `400` and an envelope `{ ok: false, error: { code: 'validation', message } }`.

### Phase 2, persistence

- sqlite, with Drizzle ORM
- Contacts table and repository
- Seed script for a few test contacts

### Phase 3, features

- Contact Us page with validation, submit to API
- Contact Us page to include company contact details component
- Thank You Modal after successful submit with toast error handling
- Contact List Page with 'Mark as Verified' and 'Delete' actions that call API
- Contacts list with verify and delete actions, simple filters
- Use Tanstack Query on frontend for data fetching and mutations
- Use Tanstack Router for frontend routing
- Use Tanstack Form for Contact Us form handling

### Phase 4, polish

- Minimal layout, header and footer, responsive styles
- Logging tweaks, graceful shutdown
- Basic CI, Lint, Format, Test (unit, intergration, e2e playwright), Build

## Working agreements

- Small PRs per phase, descriptive commits
- Zod is the single source of truth for shapes
- Keep deps lean, prefer standard library and Hono utilities
