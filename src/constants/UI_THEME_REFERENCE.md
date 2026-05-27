# UI Theme Reference (Aurora Glass Redesign)

## Goals
- Fully unified visual language across dark/light modes.
- Soft depth-based surfaces (no hard or colored borders).
- Accent energy via glows and gradients, not outline-heavy treatments.
- Consistent spacing and radius system.
- Subtle, purposeful interaction feedback.

## Token Groups
### Spacing
- `--ui-space-xs/sm/md/lg/xl`: primary layout rhythm.

### Radius
- `--ui-radius-xs/sm/md/lg`: control, card, and container curvature.

### Borders
- `--ui-border-soft`: default low-contrast edge.
- `--ui-border-soft-strong`: hover/focus edge reinforcement.

### Surface & Depth
- `--ui-surface-1`, `--ui-surface-2`: blended gradients for panel depth.
- `--ui-shadow-depth-1`, `--ui-shadow-depth-2`: layered shadows.

### Accent & Atmosphere
- `--ui-accent-glow`, `--ui-accent-glow-soft`: aura for focus/hover.
- `--ui-page-gradient`: ambient page-level gradient backdrop.

## Theme Adaptation
- Dark mode prioritizes cinematic contrast with richer shadows.
- Light mode keeps equal hierarchy with lower-opacity shadows and higher inner highlights.
- Shared token names ensure components adapt automatically.

## Interaction Rules
- Hover: slight lift (`translateY(-1px)`), stronger soft edge, expanded shadow.
- Focus-visible: no hard ring; use glow halo + depth shadow.
- Active/pressed: existing micro-motion behavior retained and harmonized by shared tokens.

## Component Contract
Any new component should:
1. Use soft border token(s), not explicit color borders.
2. Use `--ui-surface-1` or `--ui-surface-2` backgrounds.
3. Use depth shadows (`--ui-shadow-depth-*`).
4. Respect shared spacing/radius tokens.
5. Provide subtle hover/focus feedback via glow + depth change.

## Future Additions
- Add semantic variants (`info/success/warn`) as glow overlays only.
- Keep border colors neutral; avoid saturated edge colors.
- Tune only tokens first before per-component overrides.
