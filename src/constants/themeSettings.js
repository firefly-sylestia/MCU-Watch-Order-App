export const APPEARANCE_MODES = [
  { id: 'glass', label: 'Glass' },
  { id: 'pixelated', label: 'Pixelated' },
  { id: 'neo', label: 'Neon' },
  { id: 'minimal', label: 'Minimal' },
];

export const CHARACTER_THEMES = [
  { id: 'iron-man', label: 'Iron Man', swatch: '#ed1d24', dcLabel: 'Superman', dcSwatch: '#1d6bff' },
  { id: 'captain-marvel', label: 'Captain Marvel', swatch: '#2d71ff', dcLabel: 'Wonder Woman', dcSwatch: '#d4a017' },
  { id: 'black-panther', label: 'Black Panther', swatch: '#6f4dff', dcLabel: 'Batman', dcSwatch: '#475569' },
  { id: 'ant-man', label: 'Ant-Man', swatch: '#ff5da8', dcLabel: 'Harley Quinn', dcSwatch: '#f43f8c' },
  { id: 'doctor-strange', label: 'Doctor Strange', swatch: '#9d5bff', dcLabel: 'Doctor Fate', dcSwatch: '#f6c453' },
  { id: 'spider-man', label: 'Spider-Man', swatch: '#e53a4d', dcLabel: 'The Flash', dcSwatch: '#ef4444' },
  { id: 'thor', label: 'Thor', swatch: '#3ea9ff', dcLabel: 'Aquaman', dcSwatch: '#06b6d4' },
  { id: 'scarlet-witch', label: 'Scarlet Witch', swatch: '#c61b59', dcLabel: 'Raven', dcSwatch: '#8b5cf6' },
  { id: 'winter-soldier', label: 'Winter Soldier', swatch: '#8fa0b8', dcLabel: 'Cyborg', dcSwatch: '#94a3b8' },
  { id: 'captain-america', label: 'Captain America', swatch: '#3b5fa4', dcLabel: 'Blue Beetle', dcSwatch: '#38bdf8' },
  { id: 'daredevil', label: 'Daredevil', swatch: '#bf0615', dcLabel: 'Red Hood', dcSwatch: '#dc2626' },
  { id: 'panther-tech', label: 'Panther Tech', swatch: '#6bb0bf', dcLabel: 'Lantern Corps', dcSwatch: '#22c55e' },
  { id: 'marvel-red', label: 'Marvel Red', swatch: '#e23636', dcLabel: 'DC Blue', dcSwatch: '#0ea5e9' },
  { id: 'hela', label: 'Hela', swatch: '#49a561', dcLabel: 'Poison Ivy', dcSwatch: '#16a34a' },
];

const MODE_TOKENS = {
  glass: {
    effects: { blur: 24, glow: 0.24, shadow: '0 18px 46px color-mix(in srgb, var(--theme-shadow-rgb) 28%, transparent)' },
    shape: { radius: [14, 20, 28, 34], edge: 'soft', border: 1 },
    motion: { fast: '130ms', normal: '200ms', slow: '300ms', hoverScale: 1.01 },
    surface: { alpha: 70, mix: 10, saturation: 170 },
    texture: 'radial-gradient(circle at 16% 0%, color-mix(in srgb, #fff 28%, transparent), transparent 34%)',
  },
  pixelated: {
    effects: { blur: 0, glow: 0.16, shadow: '6px 6px 0 color-mix(in srgb, var(--theme-shadow-rgb) 18%, transparent)' },
    shape: { radius: [8, 10, 12, 14], edge: 'stepped', border: 2 },
    motion: { fast: '90ms', normal: '140ms', slow: '190ms', hoverScale: 1.006 },
    surface: { alpha: 88, mix: 18, saturation: 120 },
    texture: 'linear-gradient(90deg, color-mix(in srgb, var(--theme-accent) 18%, transparent) 1px, transparent 1px), linear-gradient(0deg, color-mix(in srgb, var(--theme-accent-alt) 14%, transparent) 1px, transparent 1px)',
  },
  neo: {
    effects: { blur: 16, glow: 0.58, shadow: '0 0 22px color-mix(in srgb, var(--theme-accent) 24%, transparent), 0 16px 42px color-mix(in srgb, var(--theme-shadow-rgb) 34%, transparent)' },
    shape: { radius: [10, 16, 22, 30], edge: 'neon', border: 1 },
    motion: { fast: '120ms', normal: '210ms', slow: '320ms', hoverScale: 1.018 },
    surface: { alpha: 76, mix: 24, saturation: 185 },
    texture: 'radial-gradient(circle at 20% 12%, color-mix(in srgb, var(--theme-accent) 16%, transparent), transparent 34%)',
  },
  minimal: {
    effects: { blur: 0, glow: 0.06, shadow: '0 10px 28px color-mix(in srgb, var(--theme-shadow-rgb) 12%, transparent)' },
    shape: { radius: [8, 12, 16, 22], edge: 'clean', border: 1 },
    motion: { fast: '120ms', normal: '170ms', slow: '230ms', hoverScale: 1.004 },
    surface: { alpha: 96, mix: 4, saturation: 105 },
    texture: 'none',
  },
};

const MARVEL_THEME_TOKEN_MAP = {
  'iron-man': { accent: '#ed1d24', accent2: '#f59e0b' },
  'captain-marvel': { accent: '#2d71ff', accent2: '#f4b400' },
  'black-panther': { accent: '#6f4dff', accent2: '#00b9ff' },
  'ant-man': { accent: '#ff5da8', accent2: '#67f2ff' },
  'doctor-strange': { accent: '#9d5bff', accent2: '#ff7a45' },
  'spider-man': { accent: '#e53a4d', accent2: '#2b72ff' },
  thor: { accent: '#3ea9ff', accent2: '#b0d7ff' },
  'scarlet-witch': { accent: '#c61b59', accent2: '#ff7cb5' },
  'winter-soldier': { accent: '#8fa0b8', accent2: '#4b596f' },
  'captain-america': { accent: '#3b5fa4', accent2: '#9b3430' },
  daredevil: { accent: '#bf0615', accent2: '#a61731' },
  'panther-tech': { accent: '#6bb0bf', accent2: '#3b3f8c' },
  'marvel-red': { accent: '#e23636', accent2: '#f78f3f' },
  hela: { accent: '#49a561', accent2: '#d0d500' },
};

const DC_THEME_TOKEN_MAP = {
  'iron-man': { accent: '#1d6bff', accent2: '#ef4444' },
  'captain-marvel': { accent: '#d4a017', accent2: '#be123c' },
  'black-panther': { accent: '#475569', accent2: '#facc15' },
  'ant-man': { accent: '#f43f8c', accent2: '#14b8a6' },
  'doctor-strange': { accent: '#f6c453', accent2: '#2563eb' },
  'spider-man': { accent: '#ef4444', accent2: '#facc15' },
  thor: { accent: '#06b6d4', accent2: '#f97316' },
  'scarlet-witch': { accent: '#8b5cf6', accent2: '#38bdf8' },
  'winter-soldier': { accent: '#94a3b8', accent2: '#22d3ee' },
  'captain-america': { accent: '#38bdf8', accent2: '#0f172a' },
  daredevil: { accent: '#dc2626', accent2: '#334155' },
  'panther-tech': { accent: '#22c55e', accent2: '#38bdf8' },
  'marvel-red': { accent: '#0ea5e9', accent2: '#1d4ed8' },
  hela: { accent: '#16a34a', accent2: '#a3e635' },
};

export const THEME_TOKEN_MAP = MARVEL_THEME_TOKEN_MAP;
export const UNIVERSE_THEME_TOKEN_MAP = { mcu: MARVEL_THEME_TOKEN_MAP, dc: DC_THEME_TOKEN_MAP };

const MODE_PALETTES = {
  dark: {
    mcu: { bg: '#08050d', bgAlt: '#130716', surface: 'rgba(18, 20, 34, 0.82)', elevated: 'rgba(28, 30, 48, 0.94)', text: '#f8fbff', textSecondary: '#b9c5d8', border: 'rgba(255,255,255,0.11)', shadowRgb: '#000000' },
    dc: { bg: '#030a16', bgAlt: '#071c36', surface: 'rgba(13, 24, 42, 0.84)', elevated: 'rgba(19, 37, 64, 0.94)', text: '#f5fbff', textSecondary: '#b7c9e5', border: 'rgba(151, 197, 255, 0.16)', shadowRgb: '#000000' },
  },
  light: {
    mcu: { bg: '#fff4ea', bgAlt: '#f7dfd8', surface: 'rgba(255, 255, 255, 0.86)', elevated: 'rgba(255, 251, 246, 0.96)', text: '#1c1620', textSecondary: '#5e5262', border: 'rgba(97, 49, 54, 0.16)', shadowRgb: '#5c2630' },
    dc: { bg: '#eef7ff', bgAlt: '#dcecff', surface: 'rgba(255, 255, 255, 0.88)', elevated: 'rgba(248, 252, 255, 0.98)', text: '#071827', textSecondary: '#405872', border: 'rgba(22, 68, 124, 0.16)', shadowRgb: '#123a66' },
  },
};

export const resolveThemeTokens = ({ appearanceMode = 'glass', characterTheme = 'iron-man', darkMode = true, universe = 'mcu' }) => {
  const mode = MODE_TOKENS[appearanceMode] || MODE_TOKENS.glass;
  const paletteMode = darkMode ? 'dark' : 'light';
  const universeKey = universe === 'dc' ? 'dc' : 'mcu';
  const palette = MODE_PALETTES[paletteMode][universeKey];
  const heroMap = UNIVERSE_THEME_TOKEN_MAP[universeKey] || MARVEL_THEME_TOKEN_MAP;
  const hero = heroMap[characterTheme] || heroMap['iron-man'];
  const glowSoftPct = Math.round(mode.effects.glow * (darkMode ? 46 : 32));
  const glowStrongPct = Math.round(mode.effects.glow * (darkMode ? 70 : 50));

  return {
    '--bg-base': palette.bg,
    '--bg-elevated': palette.elevated,
    '--surface-1': palette.surface,
    '--surface-2': palette.elevated,
    '--surface-3': `color-mix(in srgb, ${palette.elevated} ${mode.surface.alpha}%, ${palette.bgAlt})`,
    '--text-primary': palette.text,
    '--text-secondary': palette.textSecondary,
    '--text-muted': `color-mix(in srgb, ${palette.textSecondary} 74%, ${palette.bg})`,
    '--accent-1': hero.accent,
    '--accent-2': hero.accent2,
    '--theme-accent': hero.accent,
    '--theme-accent-alt': hero.accent2,
    '--theme-bg': palette.bg,
    '--theme-bg-alt': palette.bgAlt,
    '--theme-surface': palette.surface,
    '--theme-surface-hover': palette.elevated,
    '--theme-text': palette.text,
    '--theme-text-primary': palette.text,
    '--theme-text-secondary': palette.textSecondary,
    '--theme-text-muted': `color-mix(in srgb, ${palette.textSecondary} 82%, ${palette.bg})`,
    '--theme-border': palette.border,
    '--theme-shadow-rgb': palette.shadowRgb,
    '--edge-color': palette.border,
    '--edge-highlight': darkMode ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.82)',
    '--glow-color': hero.accent,
    '--glow-soft': `color-mix(in srgb, ${hero.accent} ${glowSoftPct}%, transparent)`,
    '--glow-strong': `color-mix(in srgb, ${hero.accent2} ${glowStrongPct}%, transparent)`,
    '--radius-sm': `${mode.shape.radius[0]}px`,
    '--radius-md': `${mode.shape.radius[1]}px`,
    '--radius-lg': `${mode.shape.radius[2]}px`,
    '--radius-xl': `${mode.shape.radius[3]}px`,
    '--motion-fast': mode.motion.fast,
    '--motion-normal': mode.motion.normal,
    '--motion-slow': mode.motion.slow,
    '--fx-blur': `${mode.effects.blur}px`,
    '--fx-shadow-2': mode.effects.shadow,
    '--fx-border-width': `${mode.shape.border}px`,
    '--fx-hover-scale': mode.motion.hoverScale,
    '--fx-surface-alpha': `${mode.surface.alpha}%`,
    '--fx-saturation': `${mode.surface.saturation}%`,
    '--texture-overlay': mode.texture,
  };
};
