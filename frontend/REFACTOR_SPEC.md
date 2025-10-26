# Frontend Refactor Spec (phase 2)

Base app directory is `frontend/`. Goal: improve reuse and SOLID boundaries with minimal, incremental changes and preserved behavior.

## Goals

- Keep routing/providers intact; no behavior changes
- Increase reuse with tiny shared helpers (API client, query keys, submit helper)
- Move orchestration to hooks; keep UI presentational
- Extract a reusable Drawer and keep code-splitting effective

## Target structure (additions)

- frontend/
  - shared/
    - lib/
      - api/client.ts
      - query/keys.ts
      - toast/submit.ts
    - ui/
      - Overlays/
        - Drawer.tsx

## Aliases

- Keep existing aliases: `@features/`, `@blocks/`, `@ui/`, `@hooks/`, `@contexts/`, `@shared/schema`
- Use relative imports for new shared/lib helpers to avoid adding more aliases for now

## Plan (phased)

Phase A — Tiny core helpers (no UX change)

- shared/lib/api/client.ts
  - Minimal fetch wrapper with base "/api", get/post/put/patch/del
  - Normalize JSON, handle 204, throw `AppError` { message, code?, status? }
- shared/lib/query/keys.ts
  - `contacts`: { `all`, `list`, `detail(id)` } stable arrays
- shared/lib/toast/submit.ts
  - `submitWithToasts(action, { onSuccess, onError })` to unify submit UX

Phase B — Feature refactors (same UX)

- features/admin/services/contacts.api.ts
  - `listContacts`, `verifyContact`, `updateContact`, `deleteContact` using client
- features/admin/hooks/useAdminContacts.tsx
  - Use services + query keys; keep toasts and optimistic updates
- features/contact/services/contact.api.ts
  - Ensure it uses shared API client
- features/contact/hooks/useCreateContact.ts
  - Use `submitWithToasts` for consistent success/error toasts

Phase C — Drawer + small lazy-loads

- shared/ui/Overlays/Drawer.tsx
  - Props: `open`, `onRequestClose`, `title?`, `footerSlot?`, `initialFocus?`
  - Behavior: overlay click close, Escape close, focus trap, GSAP slide
- shared/blocks/ContactDetailsSidebar.tsx
  - Refactor to use Drawer; preserve visuals and handlers
- pages/contact/index.tsx
  - React.lazy CompanyContactDetails, OfficeHours, PostalAddress; `fallback={null}`
- pages/\_\_root.tsx (optional)
  - Add small default pending/error fallbacks

## Work plan and checklist

- [ ] Phase A — Core helpers
  - [ ] Add API client (shared/lib/api/client.ts)
  - [ ] Add query keys (shared/lib/query/keys.ts)
  - [ ] Add submit helper (shared/lib/toast/submit.ts)
- [ ] Phase B — Admin & Contact
  - [ ] Admin services (features/admin/services/contacts.api.ts)
  - [ ] Refactor admin hook to use services + keys
  - [ ] Ensure contact service uses API client
  - [ ] Refactor contact create hook to use submit helper
  - [ ] Build + commit (phase B)
- [ ] Phase C — Drawer & lazy-loads
  - [ ] Create Drawer component
  - [ ] Refactor ContactDetailsSidebar to Drawer
  - [ ] Lazy-load contact blocks
  - [ ] Router fallbacks (optional)
  - [ ] Final build + commit
- [ ] Optional: investigate Deno vite-plugin resolver error separately

## Acceptance

- App builds and behaves as before
- Admin/Contact use shared client + query keys
- Drawer replaces inline overlay logic with no visual regressions
- Code-splitting remains effective; contact page initial JS reduced slightly

## Conventions

- Services own I/O (fetch) and return typed data
- Hooks orchestrate queries/mutations and user feedback (toasts)
- UI components remain presentational (props-only), no fetch or router calls
- Shared helpers are small and framework-agnostic where possible
