export const APPEARANCE_MODES = [
  { id: 'glass', label: 'Glass' },
  { id: 'pixelated', label: 'Pixelated' },
  { id: 'neo', label: 'Neon' },
  { id: 'minimal', label: 'Minimal' },
];

export const CHARACTER_THEMES = [
  { id: 'iron-man', label: 'Iron Man', swatch: '#ff4138' },
  { id: 'captain-marvel', label: 'Captain Marvel', swatch: '#2f7dff' },
  { id: 'black-panther', label: 'Black Panther', swatch: '#7c4dff' },
  { id: 'ant-man', label: 'Ant-Man', swatch: '#ff5da8' },
  { id: 'doctor-strange', label: 'Doctor Strange', swatch: '#a75dff' },
  { id: 'spider-man', label: 'Spider-Man', swatch: '#f43f5e' },
  { id: 'thor', label: 'Thor', swatch: '#38bdf8' },
  { id: 'scarlet-witch', label: 'Scarlet Witch', swatch: '#e11d73' },
  { id: 'winter-soldier', label: 'Winter Soldier', swatch: '#9aa8bd' },
  { id: 'captain-america', label: 'Captain America', swatch: '#4169e1' },
  { id: 'daredevil', label: 'Daredevil', swatch: '#dc1027' },
  { id: 'panther-tech', label: 'Panther Tech', swatch: '#62d6e8' },
  { id: 'marvel-red', label: 'Marvel Red', swatch: '#e23636' },
  { id: 'hela', label: 'Hela', swatch: '#4ade80' },
];

const MODE_TOKENS = {
  glass: {
    effects: { blur: 22, glow: 0.2, saturate: 155, opacity: 0.72, shadow: 'var(--theme-shadow-2)' },
    shape: { radius: [14, 20, 28, 36], edge: 'soft', border: 1 },
    motion: { fast: '140ms', normal: '220ms', slow: '320ms', hoverScale: 1.012 },
    texture: 'radial-gradient(circle at 12% 8%, rgba(255,255,255,0.18), transparent 34%), linear-gradient(135deg, rgba(255,255,255,0.09), rgba(255,255,255,0.02))',
  },
  pixelated: {
    effects: { blur: 0, glow: 0.08, saturate: 112, opacity: 0.94, shadow: 'var(--theme-pixel-shadow)' },
    shape: { radius: [10, 12, 16, 20], edge: 'pixel', border: 2 },
    motion: { fast: '90ms', normal: '140ms', slow: '190ms', hoverScale: 1.004 },
    texture: 'linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
  },
  neo: {
    effects: { blur: 8, glow: 0.72, saturate: 180, opacity: 0.8, shadow: 'var(--theme-neon-shadow)' },
    shape: { radius: [12, 18, 26, 34], edge: 'neon', border: 1 },
    motion: { fast: '120ms', normal: '210ms', slow: '340ms', hoverScale: 1.018 },
    texture: 'radial-gradient(circle at 18% 12%, rgba(255,255,255,0.09), transparent 38%), linear-gradient(120deg, transparent 0 44%, rgba(255,255,255,0.08) 48%, transparent 54% 100%)',
  },
  minimal: {
    effects: { blur: 0, glow: 0.04, saturate: 100, opacity: 1, shadow: 'var(--theme-shadow-1)' },
    shape: { radius: [8, 12, 16, 22], edge: 'clean', border: 1 },
    motion: { fast: '130ms', normal: '180ms', slow: '240ms', hoverScale: 1.006 },
    texture: 'none',
  },
};

const THEME_TOKEN_MAP = {
  'iron-man': { accent: '#ff4138', accent2: '#f59e0b' },
  'captain-marvel': { accent: '#2f7dff', accent2: '#f7c948' },
  'black-panther': { accent: '#7c4dff', accent2: '#22d3ee' },
  'ant-man': { accent: '#ff5da8', accent2: '#67e8f9' },
  'doctor-strange': { accent: '#a75dff', accent2: '#fb7185' },
  'spider-man': { accent: '#f43f5e', accent2: '#38bdf8' },
  thor: { accent: '#38bdf8', accent2: '#facc15' },
  'scarlet-witch': { accent: '#e11d73', accent2: '#ff8ab3' },
  'winter-soldier': { accent: '#9aa8bd', accent2: '#64748b' },
  'captain-america': { accent: '#4169e1', accent2: '#ef4444' },
  daredevil: { accent: '#dc1027', accent2: '#7f1d1d' },
  'panther-tech': { accent: '#62d6e8', accent2: '#7c4dff' },
  'marvel-red': { accent: '#e23636', accent2: '#ffb020' },
  hela: { accent: '#4ade80', accent2: '#d9f99d' },
};

const UNIVERSE_PALETTES = {
  marvel: {
    dark: { bg: '#07070d', bgAlt: '#12101b', surface: 'rgba(20,22,36,0.82)', surface2: 'rgba(30,34,52,0.9)', text: '#fff7ed', text2: '#cbd5e1', border: 'rgba(255,255,255,0.12)', hardBorder: 'rgba(255,255,255,0.2)' },
    light: { bg: '#fff2e5', bgAlt: '#f7ded1', surface: 'rgba(255,250,244,0.9)', surface2: 'rgba(255,255,255,0.96)', text: '#1f1a17', text2: '#65524a', border: 'rgba(112,43,36,0.16)', hardBorder: 'rgba(112,43,36,0.25)' },
  },
  dc: {
    dark: { bg: '#040915', bgAlt: '#071a33', surface: 'rgba(10,20,38,0.84)', surface2: 'rgba(16,32,58,0.92)', text: '#eef8ff', text2: '#abc4dd', border: 'rgba(125,211,252,0.14)', hardBorder: 'rgba(125,211,252,0.24)' },
    light: { bg: '#eaf6ff', bgAlt: '#d9eafd', surface: 'rgba(247,252,255,0.9)', surface2: 'rgba(255,255,255,0.97)', text: '#0b1828', text2: '#41566f', border: 'rgba(24,78,119,0.16)', hardBorder: 'rgba(24,78,119,0.26)' },
  },
};

export { THEME_TOKEN_MAP };

const alpha = (hex, amount) => `${hex}${Math.round(amount * 255).toString(16).padStart(2, '0')}`;

export const resolveThemeTokens = ({ appearanceMode = 'glass', characterTheme = 'iron-man', darkMode = true, universe = 'marvel' }) => {
  const mode = MODE_TOKENS[appearanceMode] || MODE_TOKENS.glass;
  const hero = THEME_TOKEN_MAP[characterTheme] || THEME_TOKEN_MAP['iron-man'];
  const universeKey = universe === 'dc' ? 'dc' : 'marvel';
  const palette = UNIVERSE_PALETTES[universeKey][darkMode ? 'dark' : 'light'];
  const accent = universeKey === 'dc'
    ? (characterTheme === 'iron-man' || characterTheme === 'marvel-red' ? '#38bdf8' : hero.accent)
    : hero.accent;
  const accent2 = universeKey === 'dc'
    ? (characterTheme === 'iron-man' || characterTheme === 'marvel-red' ? '#facc15' : hero.accent2)
    : hero.accent2;
  const accentMix = Math.round(mode.effects.glow * 42);
  const accentStrongMix = Math.round(mode.effects.glow * 70);

  return {
    '--bg-base': palette.bg,
    '--bg-elevated': palette.surface2,
    '--surface-1': palette.surface,
    '--surface-2': palette.surface2,
    '--surface-3': `color-mix(in srgb, ${palette.surface2} 88%, ${accent} 12%)`,
    '--text-primary': palette.text,
    '--text-secondary': palette.text2,
    '--theme-bg': palette.bg,
    '--theme-bg-alt': palette.bgAlt,
    '--theme-surface': palette.surface,
    '--theme-surface-hover': `color-mix(in srgb, ${palette.surface2} 86%, ${accent} 14%)`,
    '--theme-text': palette.text,
    '--theme-text-primary': palette.text,
    '--theme-text-secondary': palette.text2,
    '--theme-text-muted': palette.text2,
    '--theme-border': palette.border,
    '--theme-border-strong': palette.hardBorder,
    '--accent-1': accent,
    '--accent-2': accent2,
    '--edge-color': palette.border,
    '--edge-highlight': darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.92)',
    '--glow-color': accent,
    '--glow-soft': `color-mix(in srgb, ${accent} ${accentMix}%, transparent)`,
    '--glow-strong': `color-mix(in srgb, ${accent2} ${accentStrongMix}%, transparent)`,
    '--radius-sm': `${mode.shape.radius[0]}px`,
    '--radius-md': `${mode.shape.radius[1]}px`,
    '--radius-lg': `${mode.shape.radius[2]}px`,
    '--radius-xl': `${mode.shape.radius[3]}px`,
    '--motion-fast': mode.motion.fast,
    '--motion-normal': mode.motion.normal,
    '--motion-slow': mode.motion.slow,
    '--theme-hover-scale': mode.motion.hoverScale,
    '--fx-blur': `${mode.effects.blur}px`,
    '--fx-saturate': `${mode.effects.saturate}%`,
    '--fx-surface-opacity': mode.effects.opacity,
    '--fx-shadow-2': mode.effects.shadow,
    '--fx-border-width': `${mode.shape.border}px`,
    '--texture-overlay': mode.texture,
    '--theme-shadow-1': darkMode ? '0 12px 28px rgba(0,0,0,0.24)' : '0 10px 24px rgba(31,41,55,0.1)',
    '--theme-shadow-2': darkMode ? '0 22px 58px rgba(0,0,0,0.34)' : '0 20px 44px rgba(31,41,55,0.13)',
    '--theme-neon-shadow': `0 0 0 1px color-mix(in srgb, ${accent} 36%, transparent), 0 0 18px ${alpha(accent, darkMode ? 0.34 : 0.22)}, 0 16px 44px rgba(0,0,0,${darkMode ? 0.32 : 0.12})`,
    '--theme-pixel-shadow': darkMode ? '5px 5px 0 rgba(0,0,0,0.22)' : '5px 5px 0 rgba(31,41,55,0.12)',
    '--pixel-grid-size': '8px',
    '--theme-style-filter': appearanceMode === 'neo' ? 'saturate(1.12)' : appearanceMode === 'minimal' ? 'saturate(.94)' : 'none',
  };
};
