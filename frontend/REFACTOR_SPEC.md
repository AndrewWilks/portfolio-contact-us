# Frontend Refactor Plan — Drawer swipe, SOLID, and code‑splitting

This is a living spec. I will keep the todo list updated as work progresses so we always know what’s next and what’s done.

## Goals

- Restore and improve Drawer interactions:
  - Follow-the-finger swipe to close with confirm-on-threshold
  - Unify all close paths (button, overlay, Escape, swipe) through the same confirm workflow
  - Ensure open and close animations are consistent and never “instant-close”
- Keep the app simple and SOLID:
  - Services own I/O, hooks orchestrate UX, components are presentational
  - Reduce inline styles and a11y issues in primitives
- Increase code-splitting effectiveness:
  - Lazy-load heavier visual/effect components (GSAP-based)
  - Keep initial JS small without changing UX
- Maintain behavior and keep changes incremental and low risk

## Non-goals (for now)

- Visual redesigns or large UI rewrites
- Changing API contracts or database schemas
- Replacing the router or global providers

## Current state (context)

- Structure: features/ for logic, shared/ui for primitives/overlays, blocks for composition.
- New shared libs in place: API client, query keys, toast submit helper.
- Contact page blocks are lazy-loaded; Admin’s ContactDetailsSidebar uses a new Drawer.
- Production build currently fails due to a Deno Vite plugin resolver crash (tracked separately).

Status: Phase 0–2 are complete; commencing Phase 4 — Build/resolver fix.

## Phases

### Phase 0 — Drawer swipe, confirm, and animation parity (top priority)

API additions to `shared/ui/Overlays/Drawer.tsx`:

- `onBeforeClose?: () => boolean | Promise<boolean>` — called on any close attempt; return true to proceed, false to cancel.
- `enableSwipe?: boolean` (default: true)
- `swipeThresholdPx?: number` (default: 80)
- `swipeCancelVelocity?: number` (default: 0.2 px/ms)

Behavior:

- Follow-the-finger drag:
  - Track horizontal pointer/touch drags on the panel.
  - While dragging, translate the panel (x) and fade the overlay proportionally.
  - Ignore vertical drags (if |dy| >> |dx|).
- Release evaluation:
  - If `deltaX >= threshold` OR fling velocity to the right ≥ `swipeCancelVelocity`:
    - Run `attemptClose()` → awaits `onBeforeClose`; if true, animate out and unmount at the end; if false, animate back to open.
  - Else animate back to open (x → 0, overlay → 1).
- Unify close affordances (header button, overlay click, Escape, swipe):
  - All go through the same `attemptClose()` pipeline.
- Animation parity:
  - `animateOpen()`: overlay fade in + panel slide in
  - `animateClose()`: panel slide out + overlay fade out
  - Never unmount until close animation completes.
- Cleanup:
  - Remove any stray text in the file (e.g., accidental “Draw” line).

Consumer update (ContactDetailsSidebar):

- Provide `onBeforeClose` implementing the existing dirty-check confirm workflow:
  - If dirty: show confirm (cancel/save/discard). cancel → false, save → await submit then true if success, discard → reset then true.
  - If not dirty: return true.
- Remove consumer-level swipe logic; rely on Drawer’s built-in swipe.

Acceptance:

- Swipe tracks finger; threshold triggers confirm; cancel snaps back; save/discard proceed to close.
- Open/close animations are smooth and consistent for all close paths.
- Focus trap and Escape continue to work; overlay click respects confirm.

### Phase 1 — Quick wins (low risk)

- Remove duplicate swipe hook:
  - Keep `shared/hooks/useSwipeClose.ts` canonical; delete `frontend/hooks/useSwipeClose.ts` if still present; update imports.
- Replace inline styles with classes:
  - `pages/admin/index.tsx` (virtual list container)
  - `shared/ui/Affects/HeroText.tsx`, `ShinyCard.tsx` (where straightforward)
- Normalize ARIA attributes in `shared/ui/Primitives/Button.tsx`:
  - Ensure `aria-busy`, `aria-hidden`, etc., use valid boolean/string values.

### Phase 2 — Structure polish (SOLID-friendly)

- Add barrel files:
  - `features/*/services/index.ts`, `features/*/hooks/index.ts`, and in `shared/ui/*` subfolders where helpful.
- Keep services framework-free (no React); hooks orchestrate query/mutation + toasts; components stay presentational.

### Phase 3 — Route fallbacks (optional)

- Add small Suspense fallback and error boundary at `pages/__root.tsx` to standardize loading/error UX.

### Phase 4 — Build/resolver fix (separate track)

- Investigate the `@deno/vite-plugin` resolver crash:
  - Bump plugin to latest compatible version.
  - Try plugin order: `tanstackRouter`, `deno`, then `react` (or test `deno` before `react`).
  - Align `routesDirectory` with Vite `root` (with `root: "frontend"`, try `routesDirectory: "pages"` and adjust `generatedRouteTree`).
  - Temporarily disable `deno()` in frontend build to isolate the resolver.
  - Add explicit `resolve.alias` for `@.../` if import-map and plugin disagree.

## Living Todo List

Use this checklist as the source of truth. I will update it as items start/complete.

- [x] Phase 0 — Drawer swipe/confirm/animation
  - [x] Add Drawer API: `onBeforeClose`, `enableSwipe`, `swipeThresholdPx`, `swipeCancelVelocity`
  - [x] Implement interactive swipe (drag, overlay progress, vertical-guard)
  - [x] Release evaluation + unified `attemptClose()` pipeline
  - [x] Ensure animation parity and delayed unmount on close
  - [x] Wire `onBeforeClose` in `ContactDetailsSidebar` and remove local swipe logic
- [ ] Phase 1 — Quick wins
  - [x] Remove duplicate `useSwipeClose` file/imports
  - [x] Replace inline styles in `pages/admin/index.tsx` (retain necessary dynamic transform)
  - [ ] Reduce inline styles where trivial
    - [x] `HeroText.tsx` (align + will-change via Tailwind)
    - [ ] `ShinyCard.tsx` (most inline styles are required for effect)
  - [x] Normalize ARIA attributes in `shared/ui/Primitives/Button.tsx`
- [ ] Phase 2 — Structure polish
  - [x] Add barrels for services/hooks in features
  - [x] Add barrels in shared/ui subtrees where useful
- [ ] Phase 3 — Route fallbacks (optional)
  - [ ] Add Suspense fallback and error boundary at `__root`
- [ ] Phase 4 — Build/resolver fix (separate)
  - [ ] Reproduce production build failure and capture error output
  - [ ] Align router paths with Vite root (routesDirectory: `"pages"`, generatedRouteTree: `"routeTree.gen.ts"`)
  - [ ] Adjust plugin order so `deno()` runs before `react()` (and router plugin if needed)
  - [ ] Retry production build
  - [ ] If still failing: bump `@deno/vite-plugin`, or temporarily disable `deno()` to isolate; add `resolve.alias` if needed

## Completed (for context)

- [x] Shared helpers: API client, query keys, submit helper
- [x] Admin services + hook refactor (services use client; hook uses keys and preserves optimistic/toasts)
- [x] Contact service + create hook refactor (submit helper)
- [x] Drawer component introduced and adopted by ContactDetailsSidebar
- [x] Contact page blocks lazy-loaded (CompanyContactDetails, OfficeHours, PostalAddress)
- [x] Commit Phase B and Phase C changes

## Verification

- Drawer interactions:
  - Swipe follows finger and confirms on threshold; cancel restores; save/discard proceed.
  - Header close, overlay click, Escape all route through the same confirm + close animation.
- Lint/Typecheck: PASS
- Build: PASS (after resolver fix); chunks reflect route and component splits.
- No behavioral regressions in Admin and Contact flows.

## Rollback plan

- Keep Drawer changes isolated behind props; can disable swipe if a regression is detected.
- Retain old imports in commit history so we can revert specific files quickly if needed.
