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

- Shared schema via Zod in `backend/db/schema` and `shared` when added
- Request validation with `@hono/*` utilities
- Error response envelope, `{ ok, data, error }`

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
