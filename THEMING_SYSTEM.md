# Theming System

## Axes
- **Hero Theme** (`ui_hero_theme`): semantic accent identity (Iron Man default).
- **Style Mode** (`ui_style_mode`): surface treatment and interaction aesthetics.

## Token Categories
- Color: `--bg-*`, `--text-*`, `--border-*`, `--accent-*`, `--state-*`
- Effects: `--blur-*`, `--glow-*`, `--shadow-depth-*`
- Shape: `--radius-*`, `--edge-*`
- Motion: `--duration-*`, `--easing-*`

## Style Philosophy
- **Default**: modern balanced gradients.
- **Glass**: frosted translucent layers.
- **Pixelated**: crisp edges, low blur.
- **Neon**: dark-forward, glow-led accents.
- **Minimal**: low-noise flat clarity.

## Safe Extension
1. Add hero to `HERO_THEMES` with accent + secondary + glow.
2. Add style to `STYLE_MODES` and adjust token derivation rules in `getThemeCssVars`.
3. Use semantic CSS variables only; avoid hardcoded component colors.
4. Verify light/dark contrast and focus-visible ring in settings and list views.
