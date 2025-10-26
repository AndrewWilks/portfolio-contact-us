# Frontend Refactor Audit — sprint/3.1-frontend-refactor

Generated: 2025-10-26

Branch: sprint/3.1-frontend-refactor (created from sprint/3-frontend)

## Summary

- I created a working branch `sprint/3.1-frontend-refactor` and ran an initial
  audit focusing on the `frontend/` codebase.
- Commands run (important):
  - `git rev-parse --abbrev-ref HEAD` — to check current branch
  - `git checkout -b sprint/3.1-frontend-refactor` — created branch for safe
    work
  - `deno lint` — checked for lint issues
  - `deno fmt --check` — format check (many files not formatted)
  - `git ls-files frontend` (attempted) and grep for TODO/FIXME

## Immediate findings

- `deno lint` completed and the workspace is generally lint-clean after recent
  fixes.
- `deno fmt --check` reported many files that are not formatted (68 files). We
  should run `deno fmt` to normalize line endings and formatting before broader
  refactors.
- There are authored TODOs and unfinished handlers:
  - `frontend/__tests__/App.test.ts` (TODO test)
  - `frontend/components/Admin/ContactRow.tsx` (layout TODO)
  - `frontend/components/ContactForm/handlers/onUpdate.tsx` (TODO placeholder)

## Risky hotspots / technical debt

- Large components (e.g., admin sidebar) mix animation side-effects, form logic,
  and UI. These should be split into container "blocks" and presentational
  components.
- Local fallback modals and provider usage are mixed. Consolidate onto a single
  `ConfirmDialog` provider (boolean + three-way) and remove local fallbacks.
- Network logic lives in multiple places (`handlers/` under components). Move to
  `services/` for testability and reuse.
- Ensure all local imports include `.ts/.tsx` extensions (Deno requirement).
  Most files already do, but we'll verify all.

## Recommendations (immediate)

1. Run `deno fmt` across the repo to normalize formatting and line endings.
   Commit the result on this branch. This makes diffs and reviews manageable.
2. Add or update `deno.json` `tasks` for `lint`, `fmt`, and `dev` to standardize
   commands.
3. Add a CI check to enforce `deno fmt --check` and `deno lint` on PRs.
4. After formatting, run unit/integration tests and fix any broken imports or
   typings.

## Planned next steps (after approval)

1. Run `deno fmt` and commit formatting changes.
2. Create `services/contacts.ts` and migrate `handlers/onCreate.tsx` /
   `onUpdate.tsx` to call the service.
3. Finalize `ConfirmDialog` provider and remove local 3-way modal fallbacks.
4. Move container components to `components/blocks` and presentational parts to
   `components/features`/`ui`.
5. Add unit tests for `ContactFormUI`, `ConfirmDialog`, and `useSwipeClose`.
6. Add GitHub Actions workflow to run `deno fmt --check`, `deno lint`, and tests
   on PRs.

## Files flagged by quick grep for TODO/FIXME

- `frontend/__tests__/App.test.ts`
- `frontend/components/Admin/ContactRow.tsx`
- `frontend/components/ContactForm/handlers/onUpdate.tsx`

## Notes

- I will proceed when you confirm the immediate next action. I recommend running
  `deno fmt` and committing the formatting changes first — it's safe and
  reversible.

If you approve, I will run `deno fmt`, commit the formatted files, and then
proceed with the migration plan (services + block/component split), updating
imports and adding re-export wrappers as needed for backwards compatibility.
