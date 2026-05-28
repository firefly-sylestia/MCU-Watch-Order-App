export const APPEARANCE_MODES = [
  { id: 'glass', label: 'Glass' },
  { id: 'pixelated', label: 'Pixelated' },
  { id: 'neo', label: 'Neo' },
  { id: 'minimal', label: 'Minimal' },
];

export const CHARACTER_THEMES = [
  { id: 'iron-man', label: 'Iron Man', swatch: '#f04438' },
  { id: 'captain-marvel', label: 'Captain Marvel', swatch: '#2f6bff' },
  { id: 'black-panther', label: 'Black Panther', swatch: '#7c5cff' },
  { id: 'ant-man', label: 'Ant-Man', swatch: '#ff5da8' },
  { id: 'doctor-strange', label: 'Doctor Strange', swatch: '#a56bff' },
  { id: 'spider-man', label: 'Spider-Man', swatch: '#ef4056' },
  { id: 'thor', label: 'Thor', swatch: '#38bdf8' },
  { id: 'scarlet-witch', label: 'Scarlet Witch', swatch: '#d61f69' },
  { id: 'winter-soldier', label: 'Winter Soldier', swatch: '#94a3b8' },
  { id: 'captain-america', label: 'Captain America', swatch: '#3b82f6' },
  { id: 'daredevil', label: 'Daredevil', swatch: '#dc2626' },
  { id: 'panther-tech', label: 'Panther Tech', swatch: '#22d3ee' },
  { id: 'marvel-red', label: 'Marvel Red', swatch: '#ef4444' },
  { id: 'hela', label: 'Hela', swatch: '#22c55e' },
];

const MODE_TOKENS = {
  glass: {
    effects: { blur: 18, glow: 0.22, shadow: 'var(--shadow-panel)' },
    shape: { radius: [10, 14, 20, 28], edge: 'soft', border: 1 },
    motion: { fast: '140ms', normal: '200ms', slow: '280ms', hoverScale: 1.006 },
    texture: 'radial-gradient(circle at 0 0, color-mix(in srgb, var(--theme-accent) 7%, transparent), transparent 56%)',
  },
  pixelated: {
    effects: { blur: 0, glow: 0.1, shadow: 'var(--shadow-panel)' },
    shape: { radius: [0, 4, 8, 10], edge: 'stepped', border: 2 },
    motion: { fast: '90ms', normal: '150ms', slow: '220ms', hoverScale: 1.002 },
    texture: 'linear-gradient(90deg, color-mix(in srgb, var(--theme-text) 5%, transparent) 1px, transparent 1px),linear-gradient(color-mix(in srgb, var(--theme-text) 5%, transparent) 1px, transparent 1px)',
  },
  neo: {
    effects: { blur: 10, glow: 0.28, shadow: 'var(--shadow-panel)' },
    shape: { radius: [12, 18, 24, 32], edge: 'neon', border: 1 },
    motion: { fast: '140ms', normal: '220ms', slow: '300ms', hoverScale: 1.01 },
    texture: 'radial-gradient(circle at 20% 10%, color-mix(in srgb, var(--theme-accent-alt) 6%, transparent), transparent 52%)',
  },
  minimal: {
    effects: { blur: 0, glow: 0.08, shadow: 'var(--shadow-panel)' },
    shape: { radius: [8, 12, 16, 22], edge: 'clean', border: 1 },
    motion: { fast: '120ms', normal: '180ms', slow: '240ms', hoverScale: 1.004 },
    texture: 'none',
  },
};

const THEME_TOKEN_MAP = {
  'iron-man': { accent: '#f04438', accent2: '#f59e0b' },
  'captain-marvel': { accent: '#2f6bff', accent2: '#f4c430' },
  'black-panther': { accent: '#7c5cff', accent2: '#22d3ee' },
  'ant-man': { accent: '#ff5da8', accent2: '#67e8f9' },
  'doctor-strange': { accent: '#a56bff', accent2: '#fb923c' },
  'spider-man': { accent: '#ef4056', accent2: '#2563eb' },
  thor: { accent: '#38bdf8', accent2: '#c4e8ff' },
  'scarlet-witch': { accent: '#d61f69', accent2: '#fb7185' },
  'winter-soldier': { accent: '#94a3b8', accent2: '#64748b' },
  'captain-america': { accent: '#3b82f6', accent2: '#ef4444' },
  daredevil: { accent: '#dc2626', accent2: '#991b1b' },
  'panther-tech': { accent: '#22d3ee', accent2: '#6366f1' },
  'marvel-red': { accent: '#ef4444', accent2: '#fb923c' },
  hela: { accent: '#22c55e', accent2: '#d9f99d' },
};

const MODE_PALETTES = {
  dark: {
    bg: '#070a13',
    bgAlt: '#0d1324',
    surface: 'rgba(18, 25, 42, 0.82)',
    surfaceSolid: '#12192a',
    surfaceElevated: 'rgba(26, 35, 56, 0.94)',
    text: '#f7f9ff',
    textSecondary: '#c3cce0',
    textMuted: '#8f9bb3',
    textDisabled: 'rgba(195, 204, 224, 0.54)',
    border: 'rgba(226, 232, 240, 0.12)',
    borderStrong: 'rgba(226, 232, 240, 0.2)',
    input: 'rgba(9, 14, 28, 0.82)',
    shadow: '0 16px 42px rgba(0, 0, 0, 0.32)',
    shadowSoft: '0 8px 18px rgba(0, 0, 0, 0.18)',
    overlay: 'rgba(3, 7, 18, 0.54)',
  },
  light: {
    bg: '#f3efe7',
    bgAlt: '#e7dfd2',
    surface: 'rgba(255, 252, 246, 0.86)',
    surfaceSolid: '#fffaf2',
    surfaceElevated: 'rgba(255, 255, 255, 0.96)',
    text: '#111827',
    textSecondary: '#475569',
    textMuted: '#64748b',
    textDisabled: 'rgba(71, 85, 105, 0.54)',
    border: 'rgba(51, 65, 85, 0.14)',
    borderStrong: 'rgba(51, 65, 85, 0.22)',
    input: 'rgba(255, 255, 255, 0.88)',
    shadow: '0 14px 32px rgba(15, 23, 42, 0.12)',
    shadowSoft: '0 6px 16px rgba(15, 23, 42, 0.08)',
    overlay: 'rgba(248, 250, 252, 0.62)',
  },
};

export { THEME_TOKEN_MAP, MODE_PALETTES };

export const resolveThemeTokens = ({ appearanceMode = 'glass', characterTheme = 'iron-man', darkMode = true }) => {
  const mode = MODE_TOKENS[appearanceMode] || MODE_TOKENS.glass;
  const hero = THEME_TOKEN_MAP[characterTheme] || THEME_TOKEN_MAP['iron-man'];
  const palette = darkMode ? MODE_PALETTES.dark : MODE_PALETTES.light;
  const accentWeight = darkMode ? 18 : 12;
  const altWeight = darkMode ? 14 : 10;

  return {
    '--accent-1': hero.accent,
    '--accent-2': hero.accent2,
    '--theme-accent': hero.accent,
    '--theme-accent-alt': hero.accent2,
    '--theme-bg': palette.bg,
    '--theme-bg-alt': palette.bgAlt,
    '--theme-surface': palette.surface,
    '--theme-surface-solid': palette.surfaceSolid,
    '--theme-surface-elevated': palette.surfaceElevated,
    '--theme-surface-hover': `color-mix(in srgb, ${palette.surfaceSolid} 86%, ${hero.accent} ${darkMode ? 14 : 8}%)`,
    '--theme-input-bg': palette.input,
    '--theme-border': palette.border,
    '--theme-border-strong': palette.borderStrong,
    '--theme-text': palette.text,
    '--theme-text-primary': palette.text,
    '--theme-text-secondary': palette.textSecondary,
    '--theme-text-muted': palette.textMuted,
    '--theme-text-disabled': palette.textDisabled,
    '--shadow-panel': palette.shadow,
    '--shadow-control': palette.shadowSoft,
    '--overlay-scrim': palette.overlay,
    '--edge-color': palette.border,
    '--edge-highlight': darkMode ? 'rgba(255,255,255,0.13)' : 'rgba(255,255,255,0.82)',
    '--glow-color': hero.accent,
    '--glow-soft': `color-mix(in srgb, ${hero.accent} ${Math.round(mode.effects.glow * 42)}%, transparent)`,
    '--glow-strong': `color-mix(in srgb, ${hero.accent2} ${Math.round(mode.effects.glow * 58)}%, transparent)`,
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
    '--texture-overlay': mode.texture,
    '--theme-overlay-surface': `color-mix(in srgb, ${palette.surfaceSolid} 88%, ${hero.accent} ${accentWeight}%)`,
    '--theme-overlay-border': `color-mix(in srgb, ${palette.borderStrong} 78%, ${hero.accent} ${darkMode ? 22 : 18}%)`,
    '--theme-app-bg': darkMode
      ? `radial-gradient(circle at 8% 2%, color-mix(in srgb, ${hero.accent} 32%, transparent), transparent 34%), radial-gradient(circle at 90% 8%, color-mix(in srgb, ${hero.accent2} 26%, transparent), transparent 40%), linear-gradient(138deg, #070a13 0%, #0d1324 48%, #11162a 100%)`
      : `radial-gradient(circle at 8% 4%, color-mix(in srgb, ${hero.accent} ${accentWeight}%, #f3efe7), transparent 34%), radial-gradient(circle at 88% 14%, color-mix(in srgb, ${hero.accent2} ${altWeight}%, #f3efe7), transparent 40%), linear-gradient(140deg, #f5f0e8 0%, #ebe2d5 52%, #f2ede5 100%)`,
    '--theme-header-bg': darkMode
      ? `linear-gradient(180deg, color-mix(in srgb, ${hero.accent} 12%, #0c1022), #070a13)`
      : `linear-gradient(180deg, color-mix(in srgb, ${hero.accent} 8%, #fffaf2), #f0e8dc)`,
    '--theme-watched-bg': darkMode
      ? `linear-gradient(100deg, color-mix(in srgb, ${hero.accent} 16%, rgba(12,18,34,0.64)), color-mix(in srgb, ${hero.accent2} 9%, rgba(10,20,32,0.58)))`
      : `linear-gradient(100deg, color-mix(in srgb, ${hero.accent} 11%, #ffffff), color-mix(in srgb, ${hero.accent2} 7%, #f7f1e8))`,
  };
};
