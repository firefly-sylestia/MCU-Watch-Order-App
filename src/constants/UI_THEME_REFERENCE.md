# UI Theme Reference (Unified System)

## Purpose
Single source of truth for visual language: colors, glow, gradients, depth, interaction feedback, and dark/light parity.

## Design Goals
- Unified style across surfaces, controls, cards, overlays.
- Soft depth (no hard/colored border framing).
- Theme-adaptive gradients and accent glow.
- Consistent spacing and subtle motion.

## Token Groups
- **Core semantic mode tokens** are defined in `src/constants/ui.js` via `SEMANTIC_COLOR_MATRIX` and `buildSemanticThemeVars`.
- **Theme identity tokens** (accent/accentAlt per hero theme) are defined in `src/constants/themeSettings.js`.
- **Global UI rendering tokens** are applied from `src/index.css` under “2026 Theme Redesign”.

## Surface Model
1. App background uses layered radial accents + semantic background (`--ui-gradient-bg`).
2. Interactive surfaces use translucent blended panel fills (`--ui-card-bg`).
3. Border treatment is always soft (`--ui-border-softer`, `--ui-border-soft`).
4. Depth is driven by soft + glow shadows (`--ui-shadow-soft`, `--ui-shadow-glow`).

## Accessibility and Interaction
- Use `:focus-visible` with `--ui-focus-ring`.
- Hover should raise depth subtly (glow shadow), not jump aggressively.
- Active state should keep readability with accent tint blend, never solid neon fills.

## Dark/Light Parity Rules
- Dark mode: stronger atmospheric shadows, reduced bloom opacity.
- Light mode: brighter panels, gentler shadows, restrained glow.
- Keep accent gradients recognizable in both modes via `--theme-gradient-accent`.

## Spacing and Rhythm
- Base spacing scale: `xs, sm, md, lg, xl, xxl` from `UI_PARITY_TOKENS`.
- Maintain same component paddings between modes unless contrast requires adjustment.

## Implementation Checklist for Future Edits
- Update semantic palettes first (`ui.js`).
- Validate component surfaces use semantic vars (not raw hex) when possible.
- Keep borders soft/translucent; avoid highly saturated outlines.
- Verify focus ring visibility in both modes.
- Check hover/active animations remain subtle and purposeful.

## Files to Touch for Theme Work
- `src/constants/ui.js`
- `src/constants/themeSettings.js`
- `src/index.css`
- `src/App.layout.css` / `src/App.components.css` (only when component-specific overrides are required)
