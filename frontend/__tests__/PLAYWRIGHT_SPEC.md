# Playwright E2E Test Plan (Demo)

This plan outlines a minimal but representative end-to-end test suite for the
frontend to demonstrate Playwright proficiency while keeping scope simple. All
tests will live under `frontend/__tests__/` as requested.

## Goals

- Smoke-test the core routes render and navigate
- Exercise the Contact form validation and happy path submission
- Sanity-check the Admin contacts grid and the details sidebar open/close
- Validate 404 route and basic UX elements (toasts, theme toggle presence)

## Assumptions & Environment

- App runs locally with the existing dev tasks:
  - API: `deno task dev:api` (Hono backend)
  - UI: `deno task dev:ui` (Vite dev server)
- Base URL for tests: `http://localhost:<FRONTEND_PORT>`
  - Default inferred from `.config/frontend.config.ts` via Vite config
  - For the test runner, we'll allow overriding via `PLAYWRIGHT_BASE_URL` env;
    fallback to `http://localhost:5174` if unknown
- Test data: The Admin page should have some contacts to render. If empty, Admin
  tests will still assert layout scaffolding (heading present), and
  conditionally skip row-specific assertions.
- Browsers: Chromium only for the demo (can easily expand to Firefox/WebKit
  later)

## Test matrix (initial)

- chromium@stable on desktop viewport (1280x800)

## Scenarios

1. Home route smoke

- Visit `/`
- Assert hero or key content renders
- Assert Footer and Header appear
- Assert navigation to Contact and Admin exists

2. Navigation and 404

- Click to Contact -> lands on `/contact`
- Visit an unknown route (`/not-found-xyz`) -> shows not-found UI

3. Contact form validation

- On `/contact` submit with empty fields -> shows required errors
- Enter invalid email -> shows email error
- Enter valid values -> submit; assert success signal
  - If app uses a toast on success: assert toast present
  - If it redirects to `/contact/thank-you`: assert navigation

4. Contact form thank-you page

- Visit `/contact/thank-you`
- Assert confirmation content present and link back to home

5. Admin contacts grid + sidebar

- Visit `/admin`
- Assert heading "Admin - Contacts" visible
- If at least 1 card:
  - Click first "View" (or card) -> sidebar opens
  - Assert sidebar content renders key fields
  - Click close button -> sidebar closes

6. Theme toggle presence (light touch)

- Assert theme toggle dropdown or switch is present in header
- If implemented as a toggle: click it and assert `document.documentElement` or
  `body` theme attribute changes
  - Keep this simple and resilient: we only check attribute presence flips; no
    snapshot

## File layout

- `frontend/__tests__/e2e.home.spec.ts`
- `frontend/__tests__/e2e.nav-and-404.spec.ts`
- `frontend/__tests__/e2e.contact-form.spec.ts`
- `frontend/__tests__/e2e.thank-you.spec.ts`
- `frontend/__tests__/e2e.admin.spec.ts`
- `frontend/__tests__/e2e.theme.spec.ts` (optional, simple)
- `frontend/__tests__/utils/test-ids.ts` (optional helpers for selectors)

## Runner & config (proposed)

- Add `playwright.config.ts` at repo root (or frontend/) configured to:
  - `testDir: './frontend/__tests__'`
  - `use.baseURL` -> from
    `process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:5174'`
  - `projects: [{ name: 'chromium', use: { browserName: 'chromium' } }]`
  - `use.viewport: { width: 1280, height: 800 }`
  - `timeout: 30_000` (per test)
- Add npm/Deno tasks to run: `playwright test` (we’ll choose the simplest viable
  path in this repo)

## Data and selectors

- Prefer test-id attributes for critical elements when feasible (`data-testid`)
- Otherwise use resilient role/text selectors (`getByRole`, `getByText`)
- Keep selectors minimal to avoid flakiness (no deep CSS chains)

## Risks & mitigations

- Backend data variability: admin grid might be empty -> handle both states;
  assert layout and skip row-specific checks when no data
- Animations and async loaders: use Playwright auto-waits and explicit waits on
  key text/role; avoid fixed timeouts
- CI ports: allow overriding baseURL via env to match CI’s dev server port

## Minimal run instructions (to be automated later)

1. In one terminal, start API:
   - `deno task dev:api`
2. In another terminal, start UI:
   - `deno task dev:ui`
3. In a third terminal, run tests (command TBD in setup step):
   - `PLAYWRIGHT_BASE_URL=http://localhost:<port> npx playwright test`

We’ll add a convenience task once the config lands.

---

## Checklist

- [x] Configure Playwright runner (config, deps, tasks)
- [x] Add e2e.home.spec.ts (home smoke test)
- [x] Add e2e.nav-and-404.spec.ts (navigation + 404)
- [x] Add e2e.contact-form.spec.ts (validation + success)
- [ ] Add e2e.thank-you.spec.ts
- [x] Add e2e.admin.spec.ts (grid + sidebar open/close)
- [ ] Add e2e.theme.spec.ts (presence + simple toggle)
- [x] Document run steps in this spec
- [x] Optional: add CI workflow job to run Playwright (chromium only)
