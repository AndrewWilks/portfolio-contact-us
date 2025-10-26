# Frontend Refactor Spec

This document tracks the agreed frontend refactor. Base app directory is `frontend/`.

## Goals

- Clarify structure (app, features, shared) and keep it simple.
- Enforce SOLID boundaries: UI vs hooks vs services.
- Code-splitting (TanStack Router auto splitting is enabled already). Lazy-load heavy blocks where needed.
- No behavioral changes. Testing will be handled in a later sprint.

## Target structure

- frontend/
  - app/
    - providers/ (app-level providers, e.g., ThemeProvider)
    - router/ (router helpers if needed later)
  - features/
    - contact/
      - components/
      - hooks/
      - services/
      - types/
    - admin/
      - components/
      - hooks/
      - services/
  - shared/
    - ui/
      - Primitives/
      - Fields/
      - Toast/
      - Theme/
      - Affects/
      - ConfirmDialog.tsx
    - blocks/ (Header, Footer, OfficeHours, PostalAddress, ContactDetailsSidebar)
    - hooks/
    - contexts/ (reserved — currently keeping ThemeProvider under `contexts/` for compatibility)
    - assets/
    - lib/
    - types/
  - pages/ (unchanged for TanStack Router generator)
  - public/ (unchanged)

## Aliases

- Keep using Deno import map and add/update:
  - `@ui/` -> `./frontend/shared/ui/`
  - `@features/` -> `./frontend/features/`
  - `@blocks/` -> `./frontend/shared/blocks/`
  - Keep `@components/` temporarily for compatibility if any remain.
  - Keep `@contexts/` as-is for ThemeProvider to minimize changes.

We will mirror these in `.config/tsconfig.app.json` paths for editor type-checking.

## Work plan and checklist

- [x] Write and check in this spec
- [x] Scaffolding and aliases
  - [x] Create folders: `app/`, `features/`, `shared/` with subfolders
  - [x] Update `deno.json` imports map (`@ui/`, `@features/`, `@blocks/`, `@hooks/`)
  - [x] Update `.config/tsconfig.app.json` paths to include new aliases
- [x] Move shared UI/blocks (no behavior change)
  - [x] Move `components/ui/*` -> `shared/ui/*` (preserve file names)
  - [x] Move `blocks/*` -> `shared/blocks/*`
  - [x] Update imports in pages/components that referenced `../blocks/*` to `@blocks/*`
- [ ] Extract feature code
  - [x] Move ContactForm (+ UI + handlers) -> `features/contact`
  - [x] Create `features/contact/services/contact.api.ts` (POST /api/contacts)
  - [x] Create `features/contact/hooks/useCreateContact.ts` (bridges toast + navigate)
  - [x] Update `pages/contact/index.tsx` to import from `@features/contact/...`
  - [x] Move `hooks/useAdminContacts.tsx` -> `features/admin/hooks`
  - [x] Move `components/Admin/*` -> `features/admin/components` (ContactRow)
  - [x] Update `pages/admin/index.tsx` to imports from features + `@blocks/`
- [x] Minor cleanups
  - [x] Move `hooks/useSwipeClose.ts` -> `shared/hooks/` and update imports (low priority)
  - [ ] Keep ThemeProvider in `contexts/` for now; revisit later
  - [ ] Ensure presentational components have minimal props and no side effects
- [ ] Optional lazy-load heavy components
  - [x] Lazy import `ContactDetailsSidebar` in admin page if needed

## Acceptance

- App builds and runs without behavior changes
- Routing intact (pages/ untouched for generator)
- Aliases resolve in IDE and Vite
- Fetch and side-effects live in services/hooks only

## Notes

- If more reshuffling is needed later (e.g., moving ThemeProvider), we will stage it to avoid breaking imports.

## Conventions

- Features own domain-specific code under `frontend/features/<domain>/` with three layers:
  - services: network/side-effects only (fetch, mutations, storage)
  - hooks: orchestrate services, business logic, and UI events
  - components: presentational, minimal props, no direct side-effects
- Shared UI lives under `frontend/shared/ui/` and is framework-agnostic (no fetch or router calls).
- Shared blocks under `frontend/shared/blocks/` compose shared UI and may be used by multiple pages.
- Hooks intended for reuse across features go to `frontend/shared/hooks/` and are imported via `@shared/hooks`.
- Route components stay under `frontend/pages/` for TanStack Router file-based routing; heavy blocks can be lazy loaded if needed.
