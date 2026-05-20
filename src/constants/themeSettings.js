/**
 * Theme settings are centralized here so you can edit palettes without touching App logic.
 *
 * HOW TO CUSTOMIZE:
 * 1) Pick a theme in THEME_CHOICES (shown in settings UI).
 * 2) In THEME_PALETTES, edit that theme's color values.
 * 3) Keep keys unchanged (e.g. --theme-accent) so UI keeps consuming them automatically.
 */

export const THEME_CHOICES = [
  { id: 'classic', label: 'Iron Man', swatch: '#d4372f' },
  { id: 'cosmic', label: 'Capt. Marvel', swatch: '#4d7bff' },
  { id: 'vibranium', label: 'Black Panther', swatch: '#7e5dff' },
  { id: 'quantum', label: 'Ant-Man', swatch: '#ff5da8' },
  { id: 'mystic', label: 'Dr. Strange', swatch: '#9f66ff' },
  { id: 'web-slinger', label: 'Spider-Man', swatch: '#df3f4c' },
  { id: 'god-of-thunder', label: 'Thor', swatch: '#3ca6ff' },
  { id: 'scarlet-witch', label: 'Scarlet Witch', swatch: '#c61b59' },
  { id: 'winter-soldier', label: 'Winter Soldier', swatch: '#8fa0b8' },
  { id: 'captain-america', label: 'Captain America', swatch: '#3b5fa4' },
  { id: 'daredevil', label: 'Daredevil', swatch: '#bf0615' },
  { id: 'panther-tech', label: 'Panther Tech', swatch: '#6bb0bf' },
  { id: 'marvel-red', label: 'Marvel Red', swatch: '#e23636' },
  { id: 'hela', label: 'Hela', swatch: '#49a561' },
];

// Edit palette values below. Keep all variable names exactly as-is.
export const THEME_PALETTES = {
  classic: { accent: '#A63232', accentAlt: '#F2AE30', darkSurface: 'rgba(40,26,27,0.90)', lightSurface: 'rgba(255,246,244,0.96)', darkSurfaceHover: 'rgba(56,34,35,0.94)', lightSurfaceHover: 'rgba(255,236,232,0.97)', darkCompCard: 'rgba(34,22,23,0.88)', lightCompCard: 'rgba(255,248,246,0.95)' },
  cosmic: { accent: '#4d7bff', accentAlt: '#ffb94a', darkSurface: 'rgba(28,34,56,0.90)', lightSurface: 'rgba(243,247,255,0.96)', darkSurfaceHover: 'rgba(34,42,67,0.94)', lightSurfaceHover: 'rgba(232,240,255,0.97)', darkCompCard: 'rgba(24,30,50,0.88)', lightCompCard: 'rgba(245,249,255,0.95)' },
  vibranium: { accent: '#7e5dff', accentAlt: '#31c0f4', darkSurface: 'rgba(35,28,56,0.90)', lightSurface: 'rgba(248,244,255,0.96)', darkSurfaceHover: 'rgba(44,35,68,0.94)', lightSurfaceHover: 'rgba(238,230,255,0.97)', darkCompCard: 'rgba(31,24,50,0.88)', lightCompCard: 'rgba(250,246,255,0.95)' },
  quantum: { accent: '#ff5da8', accentAlt: '#67f2ff', darkSurface: 'rgba(52,29,44,0.90)', lightSurface: 'rgba(255,243,251,0.96)', darkSurfaceHover: 'rgba(64,35,52,0.94)', lightSurfaceHover: 'rgba(255,230,246,0.97)', darkCompCard: 'rgba(46,25,39,0.88)', lightCompCard: 'rgba(255,246,253,0.95)' },
  mystic: { accent: '#9f66ff', accentAlt: '#ff7b39', darkSurface: 'rgba(38,30,56,0.90)', lightSurface: 'rgba(250,244,255,0.96)', darkSurfaceHover: 'rgba(47,36,68,0.94)', lightSurfaceHover: 'rgba(240,230,255,0.97)', darkCompCard: 'rgba(33,25,50,0.88)', lightCompCard: 'rgba(252,247,255,0.95)' },
  'web-slinger': { accent: '#df3f4c', accentAlt: '#2b7bdf', darkSurface: 'rgba(46,28,32,0.90)', lightSurface: 'rgba(255,244,245,0.96)', darkSurfaceHover: 'rgba(58,34,39,0.94)', lightSurfaceHover: 'rgba(255,232,234,0.97)', darkCompCard: 'rgba(40,24,28,0.88)', lightCompCard: 'rgba(255,247,248,0.95)' },
  'god-of-thunder': { accent: '#3ca6ff', accentAlt: '#f0f6ff', darkSurface: 'rgba(27,35,53,0.90)', lightSurface: 'rgba(243,250,255,0.96)', darkSurfaceHover: 'rgba(34,44,65,0.94)', lightSurfaceHover: 'rgba(226,244,255,0.97)', darkCompCard: 'rgba(23,31,47,0.88)', lightCompCard: 'rgba(245,252,255,0.95)' },
  'scarlet-witch': { accent: '#c61b59', accentAlt: '#ff7cb5', darkSurface: 'rgba(45,25,37,0.90)', lightSurface: 'rgba(255,242,247,0.96)', darkSurfaceHover: 'rgba(57,31,45,0.94)', lightSurfaceHover: 'rgba(255,228,238,0.97)', darkCompCard: 'rgba(39,22,32,0.88)', lightCompCard: 'rgba(255,245,250,0.95)' },
  'winter-soldier': { accent: '#8fa0b8', accentAlt: '#4b596f', darkSurface: 'rgba(30,34,44,0.90)', lightSurface: 'rgba(244,247,252,0.96)', darkSurfaceHover: 'rgba(38,43,54,0.94)', lightSurfaceHover: 'rgba(230,237,248,0.97)', darkCompCard: 'rgba(26,31,40,0.88)', lightCompCard: 'rgba(246,249,254,0.95)' },
  'captain-america': { accent: '#3b5fa4', accentAlt: '#9b3430', darkSurface: 'rgba(36,40,60,0.92)', lightSurface: 'rgba(254,254,254,0.96)', darkSurfaceHover: 'rgba(44,50,72,0.94)', lightSurfaceHover: 'rgba(174,183,194,0.34)', darkCompCard: 'rgba(31,35,56,0.88)', lightCompCard: 'rgba(254,254,254,0.95)' },
  daredevil: { accent: '#BF0615', accentAlt: '#A61731', darkSurface: 'rgba(55,24,28,0.92)', lightSurface: 'rgba(255,242,243,0.96)', darkSurfaceHover: 'rgba(68,30,35,0.94)', lightSurfaceHover: 'rgba(255,228,230,0.98)', darkCompCard: 'rgba(48,20,24,0.88)', lightCompCard: 'rgba(255,246,247,0.95)' },
  'panther-tech': { accent: '#6BB0BF', accentAlt: '#3B3F8C', darkSurface: 'rgba(34,36,43,0.92)', lightSurface: 'rgba(243,244,248,0.96)', darkSurfaceHover: 'rgba(42,45,53,0.94)', lightSurfaceHover: 'rgba(232,234,242,0.97)', darkCompCard: 'rgba(30,32,40,0.88)', lightCompCard: 'rgba(246,247,252,0.95)' },
  'marvel-red': { accent: '#e23636', accentAlt: '#f78f3f', darkSurface: 'rgba(34,34,42,0.92)', lightSurface: 'rgba(255,245,245,0.96)', darkSurfaceHover: 'rgba(42,42,50,0.94)', lightSurfaceHover: 'rgba(255,233,233,0.97)', darkCompCard: 'rgba(30,30,38,0.88)', lightCompCard: 'rgba(255,248,248,0.95)' },
  hela: { accent: '#49a561', accentAlt: '#d0d500', darkSurface: 'rgba(28,37,35,0.92)', lightSurface: 'rgba(242,248,244,0.96)', darkSurfaceHover: 'rgba(35,47,44,0.94)', lightSurfaceHover: 'rgba(231,243,235,0.97)', darkCompCard: 'rgba(24,32,30,0.88)', lightCompCard: 'rgba(246,251,247,0.95)' },
};

export const getActiveThemeVars = (themeMode, darkMode) => {
  const p = THEME_PALETTES[themeMode] || THEME_PALETTES.classic;
  const lightUnifiedBase = '#f1ece3';
  const lightSurface = `color-mix(in srgb, ${p.lightSurface} 72%, ${lightUnifiedBase})`;
  const lightSurfaceHover = `color-mix(in srgb, ${p.lightSurfaceHover} 68%, ${lightUnifiedBase})`;
  const lightCompCard = `color-mix(in srgb, ${p.lightCompCard} 74%, ${lightUnifiedBase})`;
  return {
    '--theme-accent': p.accent,
    '--theme-accent-alt': p.accentAlt,
    '--theme-accent-glow': darkMode ? `color-mix(in srgb, ${p.accent} 42%, transparent)` : `color-mix(in srgb, ${p.accent} 24%, transparent)`,
    '--theme-surface': darkMode ? p.darkSurface : lightSurface,
    '--theme-surface-hover': darkMode ? p.darkSurfaceHover : lightSurfaceHover,
    '--comp-card-bg': darkMode ? p.darkCompCard : lightCompCard,
  };
};
