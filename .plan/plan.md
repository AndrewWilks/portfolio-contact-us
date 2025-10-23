# Delivery Plan

Scope, a simple contact flow, a public Contact page that submits to an API, a Thank You page, and an internal Contacts list with verify and delete actions. Keep the codebase small, typed, and portable across machines with Deno.

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

- libSQL, Turso or file, with Drizzle ORM
- Contacts table and repository
- Seed script for a few test contacts

### Phase 3, features

- Contact Us page with validation, submit to API
- Thank You page
- Contacts list with verify and delete actions, simple filters

### Phase 4, polish

- Minimal layout, header and footer, responsive styles
- Logging tweaks, graceful shutdown
- Basic CI, Lint, Format, Test, Build

## Working agreements

- Small PRs per phase, descriptive commits
- Zod is the single source of truth for shapes
- Keep deps lean, prefer standard library and Hono utilities
