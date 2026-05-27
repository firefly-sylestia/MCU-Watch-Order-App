# UI Theme System Reference

## Goals
- Unified visual language across light/dark modes.
- Soft depth-first surfaces (no hard/colored borders).
- Accent-led gradients and glow used sparingly for hierarchy.
- Consistent spacing, radii, interaction feedback, and subtle motion.

## Theme Architecture
The app theme is built from two layers:
1. **Semantic base tokens** in `src/constants/ui.js` (`buildSemanticThemeVars`).
2. **Theme accents/personalities** in `src/constants/themeSettings.js` (`THEME_PALETTES` + `getActiveThemeVars`).

At runtime they merge into CSS custom properties consumed by component CSS.

## Token Families

### 1) Surfaces & Background
- `--theme-bg`, `--theme-bg-dark`, `--theme-bg-light`
- `--theme-surface`, `--theme-surface-muted`
- `--theme-surface-hover`, `--theme-comp-card-*`

Guideline: Prefer layered translucent surfaces + shadow depth over explicit border contrast.

### 2) Accent, Glow & Gradients
- `--theme-accent`, `--theme-accent-alt`
- `--theme-accent-glow`, `--theme-accent-glow-soft`
- `--theme-gradient`, `--theme-gradient-soft`

Guideline: Accent glow supports focus and active affordances only. Keep static glow low to avoid visual noise.

### 3) Soft Borders & Depth
- `--theme-border`, `--theme-border-strong`
- `--theme-depth-shadow`, `--theme-depth-shadow-soft`

Guideline: Borders should remain neutral and low-alpha. Emphasize state changes via elevation + tint instead of saturated outlines.

### 4) Text Semantics
- `--theme-text`, `--theme-text-primary`, `--theme-text-secondary`, `--theme-text-muted`
- Status colors: `--theme-success`, `--theme-warning`, `--theme-danger`

Guideline: Always preserve readable contrast on both modes.

## Interaction & Motion Guidance
- Keep transitions between **150ms–260ms**.
- Use transform + shadow for hover/press feedback.
- Prefer subtle `translateY` and opacity transitions.
- Avoid decorative continuous motion except for key progress indicators.

## Spacing & Rhythm
Use the spacing/radius scale from `UI_PARITY_TOKENS` and root CSS variables:
- Spacing: `xs/sm/md/lg/xl`
- Radius: `sm/md/lg`
- Apply consistent internal padding before increasing component-specific variation.

## Adding or Updating a Theme
1. Add/update accent pair in `THEME_PALETTES`.
2. Let `getActiveThemeVars` derive glow/gradient/border vars.
3. Validate in both dark and light mode.
4. Check hover/active/focus states on pills, buttons, chips, cards.
5. Confirm no high-saturation hard borders appear.

## Quick QA Checklist
- [ ] Dark mode surfaces feel layered, not flat.
- [ ] Light mode remains soft without washed contrast.
- [ ] Accent glow is visible but restrained.
- [ ] Borders are soft/neutral, not harsh.
- [ ] Hover/active/focus feedback is clear and consistent.
- [ ] Spacing and radii look unified across sections.
