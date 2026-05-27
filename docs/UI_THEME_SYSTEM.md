# UI 8.5 Theme System Reference

This document is the single source of truth for theme behavior, gradients, glow strategy, interaction states, and spacing rules.

## Design goals
- Fully modernized dual-mode UI (dark + light) with one visual language.
- Accent-driven glow + gradients, not colored borders.
- Consistent spacing and rounded geometry.
- Subtle, purposeful motion.

## Theme architecture
### Core sources
- `src/index.css`: global tokens, light/dark foundations, motion and typography.
- `src/constants/themeSettings.js`: theme choices + per-theme accent/glow variables.
- `src/components/features/_shared.css`: shared glass treatment for feature containers.

### Runtime theme variables
Applied by `getActiveThemeVars()`:
- `--theme-accent`
- `--theme-accent-alt`
- `--theme-accent-glow`
- `--theme-accent-glow-soft`
- `--theme-grad-hero`

## Visual language rules
### 1) Borders
- Avoid colored borders on controls and feature shells.
- Prefer: neutral separators, inset highlights, soft depth shadows.

### 2) Glow and gradients
- Use glow to signal brand mood and active focus.
- Use layered gradients for hero areas and elevated panels.
- Keep alpha restrained for readability and premium look.

### 3) Spacing system
- Use global spacing tokens (`--space-*` and `--ui-space-*`).
- Keep component padding aligned to feature tokens (`--feature-pad`, `--feature-gap`).

### 4) Interaction feedback
- Hover: slight lift + shadow increase.
- Focus-visible: subtle accent glow ring.
- Active/pressed: lower elevation and reduce lift.

### 5) Motion
- Keep transitions around 150–240ms.
- Use easing tokens (`--ease-out`, `--ease-smooth`).
- Respect `prefers-reduced-motion`.

## Dark/light guidance
- Dark mode: deeper surfaces + brighter atmospheric glow.
- Light mode: cleaner surfaces + reduced glow strength.
- Both modes share identical component geometry and spacing.

## Extending themes
When adding a theme to `THEME_PALETTES`, provide:
- `accent`
- `accentAlt`
- `glow`
- `glowSoft`

No per-component hardcoded theme colors. Components should consume CSS variables only.
