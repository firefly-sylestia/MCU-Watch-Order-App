/**
 * Centralized hero-driven palettes for the v8.5 UI refresh.
 * Each theme now provides accent gradients, neutral surfaces, and glow channels
 * so component styles can stay consistent without per-component color logic.
 */

export const THEME_CHOICES = [
  { id: 'arc-reactor', label: 'Arc Reactor', dcLabel: 'Krypton Core', swatch: '#6cb8ff', dcSwatch: '#5f94ff' },
  { id: 'nebula-drive', label: 'Nebula Drive', dcLabel: 'Oa Current', swatch: '#7a79ff', dcSwatch: '#4cc9ff' },
  { id: 'vibranium-noir', label: 'Vibranium Noir', dcLabel: 'Bat-Tech', swatch: '#69d2ff', dcSwatch: '#8f7dff' },
  { id: 'scarlet-surge', label: 'Scarlet Surge', dcLabel: 'Amazon Dawn', swatch: '#ff5c88', dcSwatch: '#ff6f61' },
  { id: 'storm-forge', label: 'Storm Forge', dcLabel: 'Atlantean Wave', swatch: '#58b9ff', dcSwatch: '#41d1c9' },
  { id: 'mystic-prism', label: 'Mystic Prism', dcLabel: 'Chaos Sigil', swatch: '#a56dff', dcSwatch: '#6f7dff' },
];

export const THEME_PALETTES = {
  'arc-reactor': { accent: '#6cb8ff', accentAlt: '#67f0ff', glow: 'rgba(108, 184, 255, 0.34)', glowSoft: 'rgba(103, 240, 255, 0.22)' },
  'nebula-drive': { accent: '#7a79ff', accentAlt: '#4cc9ff', glow: 'rgba(122, 121, 255, 0.34)', glowSoft: 'rgba(76, 201, 255, 0.24)' },
  'vibranium-noir': { accent: '#69d2ff', accentAlt: '#8f7dff', glow: 'rgba(105, 210, 255, 0.34)', glowSoft: 'rgba(143, 125, 255, 0.22)' },
  'scarlet-surge': { accent: '#ff5c88', accentAlt: '#ff8a6b', glow: 'rgba(255, 92, 136, 0.34)', glowSoft: 'rgba(255, 138, 107, 0.22)' },
  'storm-forge': { accent: '#58b9ff', accentAlt: '#41d1c9', glow: 'rgba(88, 185, 255, 0.34)', glowSoft: 'rgba(65, 209, 201, 0.22)' },
  'mystic-prism': { accent: '#a56dff', accentAlt: '#6f7dff', glow: 'rgba(165, 109, 255, 0.34)', glowSoft: 'rgba(111, 125, 255, 0.22)' },
};

export const getActiveThemeVars = (themeMode, darkMode) => {
  const p = THEME_PALETTES[themeMode] || THEME_PALETTES['arc-reactor'];

  return {
    '--theme-accent': p.accent,
    '--theme-accent-alt': p.accentAlt,
    '--theme-accent-glow': p.glow,
    '--theme-accent-glow-soft': p.glowSoft,
    '--theme-grad-hero': darkMode
      ? `linear-gradient(145deg, color-mix(in srgb, ${p.accent} 26%, #060a16) 0%, color-mix(in srgb, ${p.accentAlt} 18%, #0c1220) 48%, #080d18 100%)`
      : `linear-gradient(145deg, color-mix(in srgb, ${p.accent} 24%, #ffffff) 0%, color-mix(in srgb, ${p.accentAlt} 18%, #f8fbff) 52%, #f7f9fc 100%)`,
  };
};
