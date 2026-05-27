# UI Theme System 8.5 Reference

## Purpose
Single-source reference for theme behavior, accent/glow strategy, dark/light parity, and spacing/motion rules.

## Design Direction
- Fully modernized cinematic UI with layered gradients and soft glow emphasis.
- No colorful borders: edges remain neutral, accents are communicated via glow, elevation, text, and subtle background tint.
- One unified language across header, controls, lists, and overlays.

## Theme Architecture

### 1) Semantic base tokens (`src/constants/ui.js`)
- `SEMANTIC_COLOR_MATRIX` defines dark/light base colors (background, surface, text, status semantics).
- `buildSemanticThemeVars(darkMode)` maps semantic values to runtime CSS variables.

### 2) Accent palettes (`src/constants/themeSettings.js`)
- `THEME_CHOICES` powers visible user theme options.
- `THEME_PALETTES` defines accent and accent-alt plus light/dark surface companions.
- `getActiveThemeVars(themeMode, darkMode)` injects:
  - `--theme-accent`
  - `--theme-accent-alt`
  - `--theme-accent-glow`
  - `--theme-accent-soft-glow`
  - mode-aware surface variables

### 3) Global visual application (`src/index.css`)
- `--app-gradient-bg` composes global radial + linear gradients.
- Neutral edge policy enforced through `--theme-border`, `--ui-border-soft`, `--ui-border-strong`.
- Interactive feedback through hover glow + focus outlines (not border color shifts).

## UI Rules

### Dark/Light mode parity
- Identical token structure in both modes.
- Contrast-safe text values in both modes.
- Accent behavior unchanged between modes, only intensity adjusts.

### Spacing consistency
- Use shared spacing scale from `UI_PARITY_TOKENS.spacing`.
- Keep card/control internals aligned to 6/10/14/18/24 rhythm.

### Motion + interaction
- Motion is subtle and short (`140ms` to `260ms`).
- Hover feedback = small elevation + soft glow.
- Focus feedback = clear ring for keyboard accessibility.

### Border policy
- Avoid saturated/colored borders on controls and surfaces.
- Use neutral translucent edges; reserve color for glows, text accents, and progress states.

## How to extend later
1. Add a new palette object to `THEME_PALETTES`.
2. Add matching display metadata in `THEME_CHOICES`.
3. Keep borders neutral; if visual emphasis is needed, tune `--theme-accent-glow` mix values.
4. Validate in both dark and light mode before release.
