/**
 * Theme settings are centralized here so you can edit palettes without touching App logic.
 * UI 8.5 redesign: high-depth gradients, glow-based accents, and neutral edge system.
 */

export const THEME_CHOICES = [
  { id: 'nova-core', label: 'Nova Core', dcLabel: 'Solar Watch', swatch: '#5ea2ff', dcSwatch: '#65d8ff' },
  { id: 'nebula-rose', label: 'Nebula Rose', dcLabel: 'Crimson Orbit', swatch: '#ff6bb4', dcSwatch: '#f97393' },
  { id: 'quantum-amber', label: 'Quantum Amber', dcLabel: 'Gold Pulse', swatch: '#ffb347', dcSwatch: '#ffc857' },
  { id: 'gamma-emerald', label: 'Gamma Emerald', dcLabel: 'Forest Lantern', swatch: '#43d18d', dcSwatch: '#52d681' },
  { id: 'violet-arc', label: 'Violet Arc', dcLabel: 'Mythic Violet', swatch: '#9e7dff', dcSwatch: '#7f8cff' },
  { id: 'midnight-cyan', label: 'Midnight Cyan', dcLabel: 'Tidal Tech', swatch: '#3cc9d9', dcSwatch: '#2ea9c5' },
  { id: 'sunset-fusion', label: 'Sunset Fusion', dcLabel: 'Ember Sky', swatch: '#ff7a59', dcSwatch: '#ff9b54' },
  { id: 'mono-steel', label: 'Mono Steel', dcLabel: 'Gotham Alloy', swatch: '#95a4bb', dcSwatch: '#7f91ab' },
];

export const THEME_PALETTES = {
  'nova-core': { accent: '#5ea2ff', accentAlt: '#65d8ff', darkSurface: 'rgba(9,16,34,0.88)', lightSurface: 'rgba(247,251,255,0.94)', darkSurfaceHover: 'rgba(13,24,48,0.92)', lightSurfaceHover: 'rgba(238,246,255,0.98)', darkCompCard: 'rgba(10,18,37,0.9)', lightCompCard: 'rgba(251,254,255,0.96)' },
  'nebula-rose': { accent: '#ff6bb4', accentAlt: '#8f8cff', darkSurface: 'rgba(26,12,29,0.88)', lightSurface: 'rgba(255,247,252,0.94)', darkSurfaceHover: 'rgba(38,15,42,0.92)', lightSurfaceHover: 'rgba(255,238,248,0.98)', darkCompCard: 'rgba(28,12,31,0.9)', lightCompCard: 'rgba(255,250,254,0.96)' },
  'quantum-amber': { accent: '#ffb347', accentAlt: '#ffd76a', darkSurface: 'rgba(30,17,7,0.88)', lightSurface: 'rgba(255,250,242,0.94)', darkSurfaceHover: 'rgba(43,24,9,0.92)', lightSurfaceHover: 'rgba(255,242,224,0.98)', darkCompCard: 'rgba(32,18,8,0.9)', lightCompCard: 'rgba(255,252,246,0.96)' },
  'gamma-emerald': { accent: '#43d18d', accentAlt: '#7ee8b6', darkSurface: 'rgba(8,24,19,0.88)', lightSurface: 'rgba(245,253,249,0.94)', darkSurfaceHover: 'rgba(11,34,27,0.92)', lightSurfaceHover: 'rgba(233,248,241,0.98)', darkCompCard: 'rgba(10,26,20,0.9)', lightCompCard: 'rgba(250,255,253,0.96)' },
  'violet-arc': { accent: '#9e7dff', accentAlt: '#61b5ff', darkSurface: 'rgba(16,11,34,0.88)', lightSurface: 'rgba(249,247,255,0.94)', darkSurfaceHover: 'rgba(24,17,48,0.92)', lightSurfaceHover: 'rgba(241,237,255,0.98)', darkCompCard: 'rgba(18,12,36,0.9)', lightCompCard: 'rgba(252,250,255,0.96)' },
  'midnight-cyan': { accent: '#3cc9d9', accentAlt: '#5ea2ff', darkSurface: 'rgba(8,22,29,0.88)', lightSurface: 'rgba(245,252,254,0.94)', darkSurfaceHover: 'rgba(11,32,42,0.92)', lightSurfaceHover: 'rgba(234,247,251,0.98)', darkCompCard: 'rgba(9,24,31,0.9)', lightCompCard: 'rgba(249,254,255,0.96)' },
  'sunset-fusion': { accent: '#ff7a59', accentAlt: '#ffb347', darkSurface: 'rgba(29,14,10,0.88)', lightSurface: 'rgba(255,248,245,0.94)', darkSurfaceHover: 'rgba(42,19,12,0.92)', lightSurfaceHover: 'rgba(255,237,231,0.98)', darkCompCard: 'rgba(31,15,10,0.9)', lightCompCard: 'rgba(255,251,249,0.96)' },
  'mono-steel': { accent: '#95a4bb', accentAlt: '#c8d3e4', darkSurface: 'rgba(14,17,24,0.88)', lightSurface: 'rgba(246,249,253,0.94)', darkSurfaceHover: 'rgba(21,26,35,0.92)', lightSurfaceHover: 'rgba(236,242,250,0.98)', darkCompCard: 'rgba(16,19,27,0.9)', lightCompCard: 'rgba(250,252,255,0.96)' },
};

export const getActiveThemeVars = (themeMode, darkMode) => {
  const p = THEME_PALETTES[themeMode] || THEME_PALETTES['nova-core'];
  const mode = darkMode ? 'dark' : 'light';
  return {
    '--theme-accent': p.accent,
    '--theme-accent-alt': p.accentAlt,
    '--theme-accent-glow': darkMode ? `color-mix(in srgb, ${p.accent} 48%, transparent)` : `color-mix(in srgb, ${p.accent} 30%, transparent)`,
    '--theme-accent-soft-glow': darkMode ? `color-mix(in srgb, ${p.accentAlt} 28%, transparent)` : `color-mix(in srgb, ${p.accentAlt} 16%, transparent)`,
    '--theme-surface': `var(--theme-surface-${mode})`,
    '--theme-surface-hover': `var(--theme-surface-hover-${mode})`,
    '--comp-card-bg': `var(--theme-comp-card-${mode})`,
  };
};
