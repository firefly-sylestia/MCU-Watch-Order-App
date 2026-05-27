# Theming System

## Two-axis model
- **Hero Theme** (`ui_hero_theme`): semantic accent identity (Iron Man default).
- **Style Mode** (`ui_style_mode`): surface treatment (Default, Glass, Pixelated, Neon, Minimal).

## Token categories
- Color: bg/text/border/accent/state tokens.
- Effect: blur, glow radii/opacity, shadows.
- Shape: corner radii and edge treatments.
- Motion: duration + easing.
- Spacing: app-wide rhythm tokens.

## Style philosophy
- Default: balanced depth and gradients.
- Glass: translucent layered blur.
- Pixelated: hard edges + block shadows.
- Neon: dark-forward with readable glow accents.
- Minimal: low-noise flat hierarchy.

## Safe extension
1. Add hero to `HERO_THEME_CHOICES` + `HERO_ACCENTS`.
2. Add mode to `STYLE_MODE_CHOICES` + `STYLE_SURFACES`.
3. Ensure both dark/light pass contrast and focus-visible checks.
4. Keep all UI styles consuming semantic CSS variables only.
