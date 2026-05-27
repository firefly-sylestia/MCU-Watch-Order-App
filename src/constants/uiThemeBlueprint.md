# UI 8.5 Theme Blueprint

## Goals
- Full modernized visual language for both dark and light modes.
- Glow + gradient-driven depth without colored borders.
- Unified spacing rhythm and subtle motion.
- Single reference source for future UI theming decisions.

## Theme Architecture

### 1) Foundational Tokens
- `--theme-bg`, `--theme-surface`, `--theme-surface-hover`, `--theme-comp-card`
- `--theme-text`, `--theme-text-secondary`, `--theme-text-muted`
- `--theme-accent`, `--theme-accent-alt`, `--theme-accent-glow`
- `--theme-border`, `--theme-border-strong` (neutral only, never accent-tinted)

### 2) Gradients and Glow
- Use accent only in fills, glows, and overlays:
  - Primary glow: `--theme-accent-glow`
  - Header / highlight gradients: mix `--theme-accent` + `--theme-accent-alt`
- Avoid rainbow overload: one dominant gradient per component.
- Keep bloom subtle in light mode and richer in dark mode.

### 3) Surfaces
- All cards and pills use layered neutral surfaces + soft shadow.
- Border treatment uses neutral alpha borders only.
- Accent appears on text/icon emphasis, active state background washes, and glow.

### 4) Interaction Feedback
- Hover: elevate with slight translate + stronger shadow + mild glow wash.
- Press: tiny downward translate.
- Focus-visible: clean accent ring; no hard neon edges.
- Disabled: reduced opacity and no elevated effects.

### 5) Motion Rules
- Micro: 120–180ms for controls.
- Section/content: 220–420ms.
- Curves: `cubic-bezier(.22,.9,.24,1)` and `ease-out`.
- Reduced motion mode disables non-essential animation.

### 6) Spacing System
- 4px base grid with consistent spacing variables.
- Controls align to shared heights and radii.
- Floating clusters and overlays share consistent 8/10/12px gaps.

## Implementation Notes
- Never use accent-colored borders as a primary visual style.
- Prefer neutral borders + accent glows/background tints.
- Keep light mode contrast strong enough for readability with softer shadows.
