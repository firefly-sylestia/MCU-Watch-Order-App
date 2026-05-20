/**
 * Theme settings are centralized here so you can edit palettes without touching App logic.
 *
 * HOW TO CUSTOMIZE:
 * 1) Pick a theme in THEME_CHOICES (shown in settings UI).
 * 2) In THEME_PALETTES, edit that theme's color values.
 * 3) Keep keys unchanged (e.g. --theme-accent) so UI keeps consuming them automatically.
 */

export const THEME_CHOICES = [
  { id: 'sacred-timeline', label: 'Sacred Timeline', swatch: '#b17a44' },
  { id: 'quantum-realm', label: 'Quantum Realm', swatch: '#44f1ff' },
  { id: 'wakanda', label: 'Wakanda', swatch: '#7b4dff' },
  { id: 'asgard', label: 'Asgard', swatch: '#d7b35a' },
  { id: 'hydra', label: 'Hydra', swatch: '#b13a46' },
  { id: 'stark-industries', label: 'Stark Industries', swatch: '#5ee7ff' },
  { id: 'scarlet-witch', label: 'Scarlet Witch', swatch: '#a11633' },
  { id: 'loki', label: 'Loki', swatch: '#3fa36b' },
  { id: 'spider-verse', label: 'Spider-Verse', swatch: '#ff2f45' },
  { id: 'celestial', label: 'Celestial', swatch: '#3f74ff' },
  { id: 'midnight-suns', label: 'Midnight Suns', swatch: '#c43934' },
  { id: 'shield', label: 'SHIELD', swatch: '#4b83b3' },
];

// Edit palette values below. Keep all variable names exactly as-is.
export const THEME_PALETTES = {
  'sacred-timeline': { accent: '#B17A44', accentAlt: '#8DAE82', darkSurface: 'rgba(41,34,29,0.94)', lightSurface: 'rgba(243,233,216,0.94)', darkSurfaceHover: 'rgba(58,49,42,0.96)', lightSurfaceHover: 'rgba(233,221,202,0.96)', darkCompCard: 'rgba(32,27,23,0.9)', lightCompCard: 'rgba(247,239,226,0.95)' },
  'quantum-realm': { accent: '#44F1FF', accentAlt: '#D838FF', darkSurface: 'rgba(14,18,52,0.94)', lightSurface: 'rgba(225,225,244,0.93)', darkSurfaceHover: 'rgba(23,29,68,0.96)', lightSurfaceHover: 'rgba(212,212,236,0.95)', darkCompCard: 'rgba(11,14,44,0.9)', lightCompCard: 'rgba(234,232,248,0.95)' },
  wakanda: { accent: '#7B4DFF', accentAlt: '#B2B8C8', darkSurface: 'rgba(24,20,34,0.94)', lightSurface: 'rgba(230,227,236,0.93)', darkSurfaceHover: 'rgba(34,28,47,0.96)', lightSurfaceHover: 'rgba(218,214,228,0.95)', darkCompCard: 'rgba(18,15,27,0.9)', lightCompCard: 'rgba(238,235,244,0.95)' },
  asgard: { accent: '#D7B35A', accentAlt: '#6FC0C3', darkSurface: 'rgba(24,36,58,0.94)', lightSurface: 'rgba(230,234,240,0.93)', darkSurfaceHover: 'rgba(35,48,71,0.96)', lightSurfaceHover: 'rgba(217,224,232,0.95)', darkCompCard: 'rgba(18,28,46,0.9)', lightCompCard: 'rgba(237,241,246,0.95)' },
  hydra: { accent: '#B13A46', accentAlt: '#8E99A8', darkSurface: 'rgba(16,18,21,0.95)', lightSurface: 'rgba(225,226,229,0.93)', darkSurfaceHover: 'rgba(26,29,35,0.97)', lightSurfaceHover: 'rgba(214,216,221,0.95)', darkCompCard: 'rgba(13,15,18,0.91)', lightCompCard: 'rgba(233,234,238,0.95)' },
  'stark-industries': { accent: '#5EE7FF', accentAlt: '#A9BED2', darkSurface: 'rgba(20,27,37,0.94)', lightSurface: 'rgba(230,236,243,0.93)', darkSurfaceHover: 'rgba(30,39,52,0.96)', lightSurfaceHover: 'rgba(218,225,233,0.95)', darkCompCard: 'rgba(14,20,29,0.9)', lightCompCard: 'rgba(238,243,248,0.95)' },
  'scarlet-witch': { accent: '#A11633', accentAlt: '#BE7DA0', darkSurface: 'rgba(37,16,26,0.95)', lightSurface: 'rgba(239,224,231,0.93)', darkSurfaceHover: 'rgba(51,22,35,0.97)', lightSurfaceHover: 'rgba(228,210,219,0.95)', darkCompCard: 'rgba(29,13,22,0.91)', lightCompCard: 'rgba(245,231,238,0.95)' },
  loki: { accent: '#3FA36B', accentAlt: '#9A7A3A', darkSurface: 'rgba(20,29,23,0.95)', lightSurface: 'rgba(229,233,227,0.93)', darkSurfaceHover: 'rgba(31,42,33,0.97)', lightSurfaceHover: 'rgba(216,223,214,0.95)', darkCompCard: 'rgba(16,24,19,0.91)', lightCompCard: 'rgba(236,241,235,0.95)' },
  'spider-verse': { accent: '#FF2F45', accentAlt: '#3FD6FF', darkSurface: 'rgba(17,21,38,0.95)', lightSurface: 'rgba(231,233,238,0.93)', darkSurfaceHover: 'rgba(27,33,54,0.97)', lightSurfaceHover: 'rgba(219,223,230,0.95)', darkCompCard: 'rgba(13,17,31,0.91)', lightCompCard: 'rgba(239,241,246,0.95)' },
  celestial: { accent: '#3F74FF', accentAlt: '#F2C36B', darkSurface: 'rgba(14,17,41,0.95)', lightSurface: 'rgba(229,229,241,0.93)', darkSurfaceHover: 'rgba(22,27,59,0.97)', lightSurfaceHover: 'rgba(216,218,233,0.95)', darkCompCard: 'rgba(10,13,33,0.91)', lightCompCard: 'rgba(237,237,247,0.95)' },
  'midnight-suns': { accent: '#C43934', accentAlt: '#DAA855', darkSurface: 'rgba(28,20,19,0.95)', lightSurface: 'rgba(238,229,224,0.93)', darkSurfaceHover: 'rgba(40,29,27,0.97)', lightSurfaceHover: 'rgba(226,216,210,0.95)', darkCompCard: 'rgba(22,16,15,0.91)', lightCompCard: 'rgba(244,236,232,0.95)' },
  shield: { accent: '#4B83B3', accentAlt: '#49D8F2', darkSurface: 'rgba(20,28,39,0.94)', lightSurface: 'rgba(228,234,241,0.93)', darkSurfaceHover: 'rgba(30,40,54,0.96)', lightSurfaceHover: 'rgba(216,224,232,0.95)', darkCompCard: 'rgba(15,22,31,0.9)', lightCompCard: 'rgba(236,242,247,0.95)' },
};

export const getActiveThemeVars = (themeMode, darkMode) => {
  const p = THEME_PALETTES[themeMode] || THEME_PALETTES['sacred-timeline'];
  const lightUnifiedBase = '#f1ece3';
  const darkUnifiedBase = '#1A1D23';
  const darkUnifiedElevated = '#272D36';
  const lightSurface = `color-mix(in srgb, ${p.lightSurface} 72%, ${lightUnifiedBase})`;
  const lightSurfaceHover = `color-mix(in srgb, ${p.lightSurfaceHover} 68%, ${lightUnifiedBase})`;
  const lightCompCard = `color-mix(in srgb, ${p.lightCompCard} 74%, ${lightUnifiedBase})`;
  const darkSurface = `color-mix(in srgb, ${p.darkSurface} 58%, ${darkUnifiedBase})`;
  const darkSurfaceHover = `color-mix(in srgb, ${p.darkSurfaceHover} 60%, ${darkUnifiedElevated})`;
  const darkCompCard = `color-mix(in srgb, ${p.darkCompCard} 56%, ${darkUnifiedElevated})`;
  return {
    '--theme-accent': p.accent,
    '--theme-accent-alt': p.accentAlt,
    '--theme-accent-glow': darkMode ? `color-mix(in srgb, ${p.accent} 42%, transparent)` : `color-mix(in srgb, ${p.accent} 24%, transparent)`,
    '--theme-surface': darkMode ? darkSurface : lightSurface,
    '--theme-surface-hover': darkMode ? darkSurfaceHover : lightSurfaceHover,
    '--comp-card-bg': darkMode ? darkCompCard : lightCompCard,
  };
};
