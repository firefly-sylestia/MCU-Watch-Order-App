# UI Theme Blueprint (Unified System)

This file is the single source of truth for visual theming and future redesigns.

## Design Goals
- Unified cinematic style across dark and light modes.
- Soft depth-first surfaces (no hard/colored borders).
- Accent-driven glow and gradients used as atmospheric highlights, not outlines.
- Consistent spacing scale and interaction rhythm.
- Subtle, purposeful motion.

## Token Architecture

### 1) Foundation
- Spacing: `--space-1` ... `--space-7`
- Radius: `--radius-sm` ... `--radius-xl`
- Elevation: `--elevation-surface-1` ... `--elevation-surface-3`
- Motion: `--motion-fast`, `--motion-base`, `--motion-slow`

### 2) Semantic Surface Tokens
- `--bg`, `--bg-elevated`, `--bg-card`, `--bg-glass`
- `--surface-1`, `--surface-2`, `--surface-3`
- `--ui-panel-1`, `--ui-panel-2`

### 3) Accent + Atmosphere
- `--theme-accent`, `--theme-accent-alt`
- `--theme-accent-glow`
- `--theme-gradient-main`, `--theme-gradient-soft`, `--theme-gradient-ambient`

### 4) Border/Depth Strategy
- Never use strong or saturated border colors directly.
- Use subtle alpha edge tokens:
  - `--border-soft`
  - `--border-strong`
  - `--ui-border-soft`
- Create separation with shadow + blur + layered gradients first.

### 5) Interaction Feedback
- Hover: slight lift (`translateY(-1px)`), brighter surface mix, soft shadow increase.
- Active: slight press (`translateY(1px)`), reduced glow.
- Focus-visible: soft accessible ring from accent mix token.

## Dark/Light Adaptation Rules
- Dark mode: stronger ambient glows, deeper contrast between panels.
- Light mode: reduced glow opacity, cleaner whites, stronger text contrast.
- Keep hue identity constant per theme; only alter luminance and alpha per mode.

## Component Guidance
- Buttons/chips/pills: neutral soft borders + accent text/glow for active states.
- Cards/panels: layered gradient backgrounds and soft shadows.
- Modals/drawers: elevated panel tokens and background blur.
- Row selection: background tint + glow shadow, not border color.

## Accessibility Targets
- Primary text contrast >= WCAG AA.
- Don’t rely on hue alone for state; combine icon/weight/background.
- Keep motion under 260ms for frequent interactions.

## Future Theme Additions Checklist
1. Add palette entry in `src/constants/themeSettings.js`.
2. Include accent + alt + glow + 3 gradient tokens.
3. Verify dark and light render consistency.
4. Confirm no hard border regressions.
5. Validate hover/focus/active feedback on key controls.
