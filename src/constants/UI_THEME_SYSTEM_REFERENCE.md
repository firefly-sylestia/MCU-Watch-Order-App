# UI Theme System Reference (UI 8.5)

## Goals
- Fully modernized visual language with glow + gradient depth.
- Unified light/dark behavior from the same token pipeline.
- No colored borders; rely on tonal surfaces, inner highlights, and glow shadows.
- Consistent spacing, radii, motion, and interaction feedback.

## Single Source of Truth
Primary theme logic lives in:
- `src/constants/themeSettings.js`
- `src/index.css` (UI 8.5 Modernization Layer)

## Theme Architecture
### 1) Theme choices
`THEME_CHOICES` contains user-facing theme presets.
Each preset has:
- `id`
- display labels
- quick swatch colors

### 2) Theme palettes
`THEME_PALETTES` stores each preset's raw chroma primitives:
- `accent`
- `accentAlt`
- `accentSoft`
- `darkBase` / `darkElev`
- `lightBase` / `lightElev`

### 3) Derived gradients and surfaces
`createPalette()` builds:
- `gradientHero`
- `gradientSurface`

`getActiveThemeVars()` maps palette values to runtime CSS variables:
- `--theme-accent`
- `--theme-accent-alt`
- `--theme-accent-soft`
- `--theme-accent-glow`
- `--theme-gradient-hero`
- `--theme-gradient-surface`
- `--theme-surface`
- `--theme-surface-hover`
- `--comp-card-bg`

## UI 8.5 Surface Rules
1. **No colored borders**
   - Set borders to transparent where possible.
   - Use glass backgrounds + glow shadows for separation.
2. **Depth via gradients**
   - App background uses layered radial + linear gradients.
3. **Subtle interaction feedback**
   - Hover = slight surface lift.
   - Focus = soft accent ring and halo.
4. **Unified radii and spacing**
   - `--ui-radius-*` and `--ui-space-*` should be used for all controls/surfaces.

## Dark/Light Mode Behavior
- Dark mode uses stronger glow opacity for contrast and drama.
- Light mode reduces glow strength and keeps soft neutral backdrop for readability.
- Both modes pull from same semantic variables to ensure parity.

## Change Workflow
When adding a new theme:
1. Add a `THEME_CHOICES` entry.
2. Add corresponding `THEME_PALETTES` value.
3. Avoid per-component hardcoded colors; consume `--theme-*` variables.

When redesigning components:
1. Prefer `background` and `box-shadow` adjustments over border color styling.
2. Keep motion durations within existing `--motion-*` range.
3. Keep spacing/radius on existing token scale.
