# /me page with Light Rays + Easter egg

Closes #38

## Summary

Implements the new `/me` page featuring a subtle, animated light-ray background rendered with WebGL (OGL), an interactive profile card, an accessible Easter egg, and a contacts section.

## What’s included

- New `/me` route composed of:
  - Interactive `ProfileCard` centered in the viewport (tilt, shine, glare effects).
  - `LightRaysBackground` (OGL) positioned beneath content with proper layering.
  - Optional soft edge mask (CSS radial mask) to smooth boundary transitions.
  - Contacts grid below the card using `ShinyCard` tiles (Website, LinkedIn, GitHub).
- Easter egg
  - Feature-gated trigger (multi-click + key sequence) via `useEggTrigger`.
  - `EggPanel` overlay: accessible, keyboard navigable, and dismissible.
  - Subtle hint wiring in the `Header`.
- New asset: `frontend/public/icon-pattern-1600.svg` — repeating pattern of the app icon for future backgrounds/marketing.
- Tailwind v4-compatible `@supports` usage and minor CSS compatibility adjustments.

## Technical notes

- `LightRaysBackground`
  - Uses OGL for a fragment shader–driven light ray effect.
  - Respects `prefers-reduced-motion` and pauses via `IntersectionObserver`.
  - Optional mouse-follow with smoothing to avoid jank.
  - Edge masking is CSS-based to keep shader simple and composable.
- Security & a11y
  - External links use `rel="noopener noreferrer"`.
  - Overlay is keyboard accessible with focus trapping and ESC close.

## Tests & verification

- Manual verification across light/dark themes and reduced motion.
- E2E pages still pass locally; no API surface changed.

## Screenshots (optional)

<!-- Drop screenshots or short clips if desired. -->

## Follow-ups (optional)

- Parameterize edge mask feather radius via props.
- Add small brand icons to `ShinyCard` links.
- Consider a dedicated `<pattern>`-based background for CSS tiling if needed.
