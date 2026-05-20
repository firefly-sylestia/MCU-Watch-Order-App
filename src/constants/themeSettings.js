/**
 * Theme settings are centralized here so you can edit palettes without touching App logic.
 *
 * HOW TO CUSTOMIZE:
 * 1) Pick a theme in THEME_CHOICES (shown in settings UI).
 * 2) In THEME_PALETTES, edit that theme's color values.
 * 3) Keep keys unchanged (e.g. --theme-accent) so UI keeps consuming them automatically.
 */

export const THEME_CHOICES = [
  { id: 'sacred-timeline', label: 'Sacred Timeline', swatch: '#b4874f' },
  { id: 'quantum-realm', label: 'Quantum Realm', swatch: '#3be9f5' },
  { id: 'wakanda', label: 'Wakanda', swatch: '#7a4cff' },
  { id: 'asgard', label: 'Asgard', swatch: '#d7b66b' },
  { id: 'hydra', label: 'Hydra', swatch: '#8f3a44' },
  { id: 'stark-industries', label: 'Stark Industries', swatch: '#49d8ff' },
  { id: 'scarlet-witch', label: 'Scarlet Witch', swatch: '#bd1f4f' },
  { id: 'loki', label: 'Loki', swatch: '#3f9b64' },
  { id: 'spider-verse', label: 'Spider-Verse', swatch: '#ff3050' },
  { id: 'celestial', label: 'Celestial', swatch: '#5f7ff7' },
  { id: 'midnight-suns', label: 'Midnight Suns', swatch: '#d64737' },
  { id: 'shield', label: 'S.H.I.E.L.D.', swatch: '#4d89bb' },
];

// Edit palette values below. Keep all variable names exactly as-is.
export const THEME_PALETTES = {
  'sacred-timeline': { accent: '#b4874f', accentAlt: '#7ca37a', darkSurface: 'rgba(39,30,22,0.92)', lightSurface: 'rgba(237,228,208,0.96)', darkSurfaceHover: 'rgba(54,42,31,0.94)', lightSurfaceHover: 'rgba(228,216,193,0.97)', darkCompCard: 'rgba(48,38,29,0.90)', lightCompCard: 'rgba(242,233,216,0.95)' },
  'quantum-realm': { accent: '#3be9f5', accentAlt: '#de4cff', darkSurface: 'rgba(10,15,44,0.92)', lightSurface: 'rgba(222,226,248,0.96)', darkSurfaceHover: 'rgba(16,22,58,0.94)', lightSurfaceHover: 'rgba(212,216,243,0.97)', darkCompCard: 'rgba(14,19,52,0.90)', lightCompCard: 'rgba(229,232,250,0.95)' },
  wakanda: { accent: '#7a4cff', accentAlt: '#9fa6b8', darkSurface: 'rgba(19,19,24,0.92)', lightSurface: 'rgba(224,226,235,0.96)', darkSurfaceHover: 'rgba(30,30,38,0.94)', lightSurfaceHover: 'rgba(212,214,226,0.97)', darkCompCard: 'rgba(28,28,36,0.90)', lightCompCard: 'rgba(230,231,239,0.95)' },
  asgard: { accent: '#d7b66b', accentAlt: '#4cc0b6', darkSurface: 'rgba(23,33,56,0.92)', lightSurface: 'rgba(226,231,239,0.96)', darkSurfaceHover: 'rgba(31,44,72,0.94)', lightSurfaceHover: 'rgba(215,221,232,0.97)', darkCompCard: 'rgba(31,43,69,0.90)', lightCompCard: 'rgba(232,236,244,0.95)' },
  hydra: { accent: '#9f4750', accentAlt: '#b8bfc8', darkSurface: 'rgba(18,20,24,0.92)', lightSurface: 'rgba(219,223,229,0.96)', darkSurfaceHover: 'rgba(27,31,38,0.94)', lightSurfaceHover: 'rgba(208,213,220,0.97)', darkCompCard: 'rgba(26,30,35,0.90)', lightCompCard: 'rgba(226,229,234,0.95)' },
  'stark-industries': { accent: '#49d8ff', accentAlt: '#b7c6d8', darkSurface: 'rgba(21,25,32,0.92)', lightSurface: 'rgba(226,232,240,0.96)', darkSurfaceHover: 'rgba(30,36,46,0.94)', lightSurfaceHover: 'rgba(214,221,232,0.97)', darkCompCard: 'rgba(31,37,46,0.90)', lightCompCard: 'rgba(232,237,245,0.95)' },
  'scarlet-witch': { accent: '#bd1f4f', accentAlt: '#d687a0', darkSurface: 'rgba(32,13,20,0.92)', lightSurface: 'rgba(237,220,226,0.96)', darkSurfaceHover: 'rgba(44,18,27,0.94)', lightSurfaceHover: 'rgba(227,208,216,0.97)', darkCompCard: 'rgba(41,17,25,0.90)', lightCompCard: 'rgba(242,226,232,0.95)' },
  loki: { accent: '#3f9b64', accentAlt: '#a07f3a', darkSurface: 'rgba(21,27,24,0.92)', lightSurface: 'rgba(227,232,224,0.96)', darkSurfaceHover: 'rgba(31,39,34,0.94)', lightSurfaceHover: 'rgba(216,223,212,0.97)', darkCompCard: 'rgba(30,37,33,0.90)', lightCompCard: 'rgba(233,237,229,0.95)' },
  'spider-verse': { accent: '#ff3050', accentAlt: '#1ed3ff', darkSurface: 'rgba(17,24,43,0.92)', lightSurface: 'rgba(225,231,242,0.96)', darkSurfaceHover: 'rgba(25,35,59,0.94)', lightSurfaceHover: 'rgba(214,222,236,0.97)', darkCompCard: 'rgba(25,35,57,0.90)', lightCompCard: 'rgba(231,236,246,0.95)' },
  celestial: { accent: '#5f7ff7', accentAlt: '#f1b1d8', darkSurface: 'rgba(13,14,40,0.92)', lightSurface: 'rgba(227,228,241,0.96)', darkSurfaceHover: 'rgba(22,24,58,0.94)', lightSurfaceHover: 'rgba(216,217,234,0.97)', darkCompCard: 'rgba(21,23,54,0.90)', lightCompCard: 'rgba(233,234,245,0.95)' },
  'midnight-suns': { accent: '#d64737', accentAlt: '#f0ad54', darkSurface: 'rgba(30,19,17,0.92)', lightSurface: 'rgba(234,224,215,0.96)', darkSurfaceHover: 'rgba(42,27,23,0.94)', lightSurfaceHover: 'rgba(224,212,201,0.97)', darkCompCard: 'rgba(40,26,23,0.90)', lightCompCard: 'rgba(239,230,222,0.95)' },
  shield: { accent: '#4d89bb', accentAlt: '#59d7f4', darkSurface: 'rgba(19,29,44,0.92)', lightSurface: 'rgba(224,231,239,0.96)', darkSurfaceHover: 'rgba(28,41,59,0.94)', lightSurfaceHover: 'rgba(212,221,231,0.97)', darkCompCard: 'rgba(28,40,58,0.90)', lightCompCard: 'rgba(231,237,245,0.95)' },
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
