/**
 * Theme settings are centralized here so you can edit palettes without touching App logic.
 */

export const THEME_CHOICES = [
  { id: 'classic', label: 'Iron Man', dcLabel: 'Superman', swatch: '#d4372f', dcSwatch: '#2f7fff' },
  { id: 'cosmic', label: 'Capt. Marvel', dcLabel: 'Blue Beetle', swatch: '#4d7bff', dcSwatch: '#3d8cff' },
  { id: 'vibranium', label: 'Black Panther', dcLabel: 'Nightwing', swatch: '#7e5dff', dcSwatch: '#4aa4ff' },
  { id: 'quantum', label: 'Ant-Man', dcLabel: 'The Flash', swatch: '#ff5da8', dcSwatch: '#ff3b3b' },
  { id: 'mystic', label: 'Dr. Strange', dcLabel: 'Zatanna', swatch: '#9f66ff', dcSwatch: '#6c63ff' },
  { id: 'web-slinger', label: 'Spider-Man', dcLabel: 'Red Hood', swatch: '#df3f4c', dcSwatch: '#d64b4b' },
  { id: 'god-of-thunder', label: 'Thor', dcLabel: 'Aquaman', swatch: '#3ca6ff', dcSwatch: '#1ea7a0' },
  { id: 'scarlet-witch', label: 'Scarlet Witch', dcLabel: 'Raven', swatch: '#c61b59', dcSwatch: '#6a3cc9' },
  { id: 'winter-soldier', label: 'Winter Soldier', dcLabel: 'Batman', swatch: '#8fa0b8', dcSwatch: '#64748b' },
  { id: 'captain-america', label: 'Captain America', dcLabel: 'Wonder Woman', swatch: '#3b5fa4', dcSwatch: '#355f9f' },
  { id: 'daredevil', label: 'Daredevil', dcLabel: 'Harley Quinn', swatch: '#bf0615', dcSwatch: '#d42b6a' },
  { id: 'panther-tech', label: 'Panther Tech', dcLabel: 'Cyborg', swatch: '#6bb0bf', dcSwatch: '#35a4c6' },
  { id: 'marvel-red', label: 'Marvel Red', dcLabel: 'Shazam', swatch: '#e23636', dcSwatch: '#d97706' },
  { id: 'hela', label: 'Hela', dcLabel: 'Green Lantern', swatch: '#49a561', dcSwatch: '#2ea44f' },
];

export const THEME_PALETTES = {
  classic: { accent: '#68a7ff', accentAlt: '#9d88ff' },
  cosmic: { accent: '#6b8dff', accentAlt: '#6ae1ff' },
  vibranium: { accent: '#8a82ff', accentAlt: '#4bc8ff' },
  quantum: { accent: '#ff6ab3', accentAlt: '#65f2ff' },
  mystic: { accent: '#a775ff', accentAlt: '#ff8d4f' },
  'web-slinger': { accent: '#ea4a5a', accentAlt: '#4c8fff' },
  'god-of-thunder': { accent: '#4ab0ff', accentAlt: '#8bd7ff' },
  'scarlet-witch': { accent: '#db2f74', accentAlt: '#ff86bf' },
  'winter-soldier': { accent: '#9caec5', accentAlt: '#66758d' },
  'captain-america': { accent: '#4f77c4', accentAlt: '#c84f55' },
  daredevil: { accent: '#cb1d2f', accentAlt: '#b9285e' },
  'panther-tech': { accent: '#71bfcd', accentAlt: '#6170c8' },
  'marvel-red': { accent: '#f04646', accentAlt: '#ff9b4d' },
  hela: { accent: '#53b06e', accentAlt: '#d8dd4d' },
};

export const getActiveThemeVars = (themeMode, darkMode) => {
  const p = THEME_PALETTES[themeMode] || THEME_PALETTES.classic;
  const mode = darkMode ? 'dark' : 'light';
  return {
    '--theme-accent': p.accent,
    '--theme-accent-alt': p.accentAlt,
    '--theme-accent-glow': darkMode ? `color-mix(in srgb, ${p.accent} 40%, transparent)` : `color-mix(in srgb, ${p.accent} 20%, transparent)`,
    '--theme-accent-glow-soft': darkMode ? `color-mix(in srgb, ${p.accentAlt} 22%, transparent)` : `color-mix(in srgb, ${p.accentAlt} 12%, transparent)`,
    '--theme-surface': `var(--theme-surface-${mode})`,
    '--theme-surface-hover': `var(--theme-surface-hover-${mode})`,
    '--theme-surface-muted': `var(--theme-surface-muted-${mode})`,
    '--theme-bg': `var(--theme-bg-${mode})`,
    '--theme-gradient': `linear-gradient(135deg, color-mix(in srgb, ${p.accent} 30%, transparent), color-mix(in srgb, ${p.accentAlt} 26%, transparent))`,
    '--theme-gradient-soft': `linear-gradient(180deg, color-mix(in srgb, ${p.accent} 12%, transparent), color-mix(in srgb, ${p.accentAlt} 8%, transparent))`,
    '--theme-border': darkMode ? 'rgba(171, 193, 227, 0.18)' : 'rgba(77, 98, 133, 0.18)',
    '--theme-border-strong': darkMode ? 'rgba(197, 216, 245, 0.26)' : 'rgba(77, 98, 133, 0.28)',
    '--comp-card-bg': `var(--theme-comp-card-${mode})`,
  };
};
