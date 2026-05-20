export const THEME_CHOICES = [
  { id: 'sacred-timeline', label: 'Sacred Timeline', swatch: '#b8894f' },
  { id: 'quantum-realm', label: 'Quantum Realm', swatch: '#45e7ff' },
  { id: 'wakanda', label: 'Wakanda', swatch: '#6e3ad8' },
  { id: 'asgard', label: 'Asgard', swatch: '#e0be63' },
  { id: 'hydra', label: 'Hydra', swatch: '#8f2a33' },
  { id: 'stark-industries', label: 'Stark Industries', swatch: '#51dfff' },
  { id: 'scarlet-witch', label: 'Scarlet Witch', swatch: '#ab1f3d' },
  { id: 'loki', label: 'Loki', swatch: '#2f9d62' },
  { id: 'spider-verse', label: 'Spider-Verse', swatch: '#ff2f48' },
  { id: 'celestial', label: 'Celestial', swatch: '#f1c56f' },
  { id: 'midnight-suns', label: 'Midnight Suns', swatch: '#d3472f' },
  { id: 'shield', label: 'SHIELD', swatch: '#4e7fb2' },
];

export const THEME_PALETTES = {
  'sacred-timeline': { accent: '#b8894f', accentAlt: '#8ea57a', baseDark: '#191613', baseLight: '#ebe4d7', cardDark: 'rgba(40,33,25,0.88)', cardLight: 'rgba(244,235,220,0.92)' },
  'quantum-realm': { accent: '#45e7ff', accentAlt: '#c27bff', baseDark: '#0d1230', baseLight: '#e8e5f3', cardDark: 'rgba(23,20,52,0.88)', cardLight: 'rgba(236,232,248,0.92)' },
  wakanda: { accent: '#6e3ad8', accentAlt: '#a9afc1', baseDark: '#121217', baseLight: '#e5e6ee', cardDark: 'rgba(30,28,40,0.9)', cardLight: 'rgba(235,233,243,0.92)' },
  asgard: { accent: '#e0be63', accentAlt: '#4fa6a9', baseDark: '#131d36', baseLight: '#e8ecf0', cardDark: 'rgba(33,44,64,0.9)', cardLight: 'rgba(239,242,246,0.93)' },
  hydra: { accent: '#8f2a33', accentAlt: '#9ea3ac', baseDark: '#141518', baseLight: '#e4e6e8', cardDark: 'rgba(34,35,40,0.9)', cardLight: 'rgba(236,237,239,0.92)' },
  'stark-industries': { accent: '#51dfff', accentAlt: '#9ab3c9', baseDark: '#10161f', baseLight: '#e3e8ef', cardDark: 'rgba(29,38,50,0.88)', cardLight: 'rgba(233,238,245,0.92)' },
  'scarlet-witch': { accent: '#ab1f3d', accentAlt: '#be6c95', baseDark: '#1d0f19', baseLight: '#eadde4', cardDark: 'rgba(47,20,33,0.9)', cardLight: 'rgba(240,227,233,0.93)' },
  loki: { accent: '#2f9d62', accentAlt: '#a8803f', baseDark: '#151812', baseLight: '#e6e6df', cardDark: 'rgba(33,41,32,0.9)', cardLight: 'rgba(236,238,232,0.92)' },
  'spider-verse': { accent: '#ff2f48', accentAlt: '#2fd8ff', baseDark: '#141a30', baseLight: '#e5e9f2', cardDark: 'rgba(26,33,58,0.9)', cardLight: 'rgba(233,237,245,0.92)' },
  celestial: { accent: '#f1c56f', accentAlt: '#d28eb6', baseDark: '#12172c', baseLight: '#ece8f2', cardDark: 'rgba(32,30,60,0.88)', cardLight: 'rgba(241,237,247,0.93)' },
  'midnight-suns': { accent: '#d3472f', accentAlt: '#d2a45c', baseDark: '#1b1312', baseLight: '#ece3d9', cardDark: 'rgba(47,29,27,0.9)', cardLight: 'rgba(243,233,222,0.92)' },
  shield: { accent: '#4e7fb2', accentAlt: '#5dd5e8', baseDark: '#111a2a', baseLight: '#e2e8ef', cardDark: 'rgba(27,39,59,0.9)', cardLight: 'rgba(232,238,246,0.92)' },
};

export const getActiveThemeVars = (themeMode, darkMode) => {
  const p = THEME_PALETTES[themeMode] || THEME_PALETTES['sacred-timeline'];
  const bg = darkMode ? p.baseDark : p.baseLight;
  const elevated = darkMode
    ? `color-mix(in srgb, ${p.cardDark} 86%, ${p.baseDark})`
    : `color-mix(in srgb, ${p.cardLight} 88%, ${p.baseLight})`;

  return {
    '--theme-accent': p.accent,
    '--theme-accent-alt': p.accentAlt,
    '--theme-accent-glow': darkMode ? `color-mix(in srgb, ${p.accent} 22%, transparent)` : `color-mix(in srgb, ${p.accent} 14%, transparent)`,
    '--theme-bg': bg,
    '--theme-bg-secondary': darkMode ? `color-mix(in srgb, ${bg} 90%, #000)` : `color-mix(in srgb, ${bg} 92%, #cfd4dc)`,
    '--theme-bg-tertiary': darkMode ? `color-mix(in srgb, ${bg} 86%, #10131a)` : `color-mix(in srgb, ${bg} 85%, #d5dae2)`,
    '--theme-surface': elevated,
    '--theme-surface-elevated': darkMode ? `color-mix(in srgb, ${elevated} 94%, #000)` : `color-mix(in srgb, ${elevated} 96%, #f6f7f9)`,
    '--theme-surface-hover': darkMode ? `color-mix(in srgb, ${elevated} 92%, ${p.accentAlt})` : `color-mix(in srgb, ${elevated} 92%, ${p.accent})`,
    '--comp-card-bg': elevated,
    '--theme-text-primary': darkMode ? '#f3f5f9' : '#202734',
    '--theme-text-secondary': darkMode ? '#b5bfcc' : '#526074',
    '--theme-text-muted': darkMode ? '#9099a6' : '#6a7486',
    '--theme-text-disabled': darkMode ? '#707986' : '#8891a0',
    '--theme-border': darkMode ? 'rgba(225,231,242,0.14)' : 'rgba(41,52,72,0.14)',
  };
};
