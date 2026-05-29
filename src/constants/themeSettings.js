export const APPEARANCE_MODES = [
  { id: 'glass', label: 'Glass', desc: 'Frosted depth, soft refraction, calm premium typography', font: 'Manrope' },
  { id: 'pixelated', label: 'Pixelated', desc: 'Arcade grid, chunky type, crisp stepped edges', font: 'Pixelify Sans' },
  { id: 'neon', label: 'Neon', desc: 'Night-city glow, luminous borders, techno titles', font: 'Audiowide' },
  { id: 'minimal', label: 'Minimal', desc: 'Quiet contrast, roomy rhythm, readable UI typography', font: 'Manrope' },
];

export const normalizeAppearanceMode = (appearanceMode = 'glass') => (
  appearanceMode === 'neo' ? 'neon' : appearanceMode
);

export const CHARACTER_THEMES = [
  { id: 'iron-man', label: 'Iron Man', swatch: '#ed1d24', dcLabel: 'Superman', dcSwatch: '#2563eb' },
  { id: 'captain-marvel', label: 'Captain Marvel', swatch: '#2d71ff', dcLabel: 'Wonder Woman', dcSwatch: '#dc2626' },
  { id: 'black-panther', label: 'Black Panther', swatch: '#6f4dff', dcLabel: 'Batman', dcSwatch: '#facc15' },
  { id: 'ant-man', label: 'Ant-Man', swatch: '#ff5da8', dcLabel: 'The Flash', dcSwatch: '#f97316' },
  { id: 'doctor-strange', label: 'Doctor Strange', swatch: '#9d5bff', dcLabel: 'Doctor Fate', dcSwatch: '#38bdf8' },
  { id: 'spider-man', label: 'Spider-Man', swatch: '#e53a4d', dcLabel: 'Nightwing', dcSwatch: '#0ea5e9' },
  { id: 'thor', label: 'Thor', swatch: '#3ea9ff', dcLabel: 'Aquaman', dcSwatch: '#14b8a6' },
  { id: 'scarlet-witch', label: 'Scarlet Witch', swatch: '#c61b59', dcLabel: 'Harley Quinn', dcSwatch: '#ec4899' },
  { id: 'winter-soldier', label: 'Winter Soldier', swatch: '#8fa0b8', dcLabel: 'Cyborg', dcSwatch: '#94a3b8' },
  { id: 'captain-america', label: 'Captain America', swatch: '#3b5fa4', dcLabel: 'Justice League', dcSwatch: '#3b82f6' },
  { id: 'daredevil', label: 'Daredevil', swatch: '#bf0615', dcLabel: 'Red Hood', dcSwatch: '#b91c1c' },
  { id: 'panther-tech', label: 'Panther Tech', swatch: '#6bb0bf', dcLabel: 'Lantern Corps', dcSwatch: '#22c55e' },
  { id: 'marvel-red', label: 'Marvel Red', swatch: '#e23636', dcLabel: 'DC Blue', dcSwatch: '#1d4ed8' },
  { id: 'hela', label: 'Hela', swatch: '#49a561', dcLabel: 'Poison Ivy', dcSwatch: '#16a34a' },
];

const MODE_TOKENS = {
  glass: {
    fonts: { display: '"Manrope", "Outfit", system-ui, sans-serif', ui: '"Manrope", "Outfit", system-ui, sans-serif', body: '"Manrope", "Outfit", system-ui, sans-serif' },
    effects: { blur: 18, glow: 0.14, shadow: '0 18px 44px color-mix(in srgb, var(--theme-shadow-rgb, #020617) 18%, transparent)' },
    shape: { radius: [14, 20, 28, 34], edge: 'glass', border: 1 },
    motion: { fast: '140ms', normal: '200ms', slow: '260ms', hoverScale: 1.006 },
    texture: 'linear-gradient(135deg, rgba(255,255,255,.11), rgba(255,255,255,.025) 52%, transparent 76%)',
    panelOverlay: 'linear-gradient(145deg, color-mix(in srgb, var(--theme-surface) 82%, transparent), color-mix(in srgb, var(--theme-surface-strong) 66%, transparent))',
  },
  pixelated: {
    fonts: { display: '"Pixelify Sans", "Rajdhani", system-ui, sans-serif', ui: '"Rajdhani", "Outfit", system-ui, sans-serif', body: '"Outfit", "Rajdhani", system-ui, sans-serif' },
    effects: { blur: 0, glow: 0.08, shadow: '3px 3px 0 color-mix(in srgb, var(--theme-accent) 20%, transparent), 0 12px 22px rgba(2,8,23,.14)' },
    shape: { radius: [8, 10, 14, 18], edge: 'pixel', border: 1 },
    motion: { fast: '100ms', normal: '150ms', slow: '190ms', hoverScale: 1 },
    texture: 'linear-gradient(90deg, color-mix(in srgb, var(--theme-accent) 8%, transparent) 1px, transparent 1px), linear-gradient(0deg, color-mix(in srgb, var(--theme-accent-alt) 7%, transparent) 1px, transparent 1px)',
    panelOverlay: 'linear-gradient(135deg, color-mix(in srgb, var(--theme-surface) 94%, transparent), color-mix(in srgb, var(--theme-accent) 6%, var(--theme-surface-strong)))',
  },
  neon: {
    fonts: { display: '"Audiowide", "Rajdhani", system-ui, sans-serif', ui: '"Rajdhani", "Outfit", system-ui, sans-serif', body: '"Space Grotesk", "Outfit", system-ui, sans-serif' },
    effects: { blur: 10, glow: 0.58, shadow: '0 0 20px color-mix(in srgb, var(--theme-accent) 34%, transparent), 0 0 42px color-mix(in srgb, var(--theme-accent-alt) 18%, transparent)' },
    shape: { radius: [12, 18, 26, 34], edge: 'neon', border: 1 },
    motion: { fast: '120ms', normal: '210ms', slow: '300ms', hoverScale: 1.014 },
    texture: 'radial-gradient(circle at 22% 18%, color-mix(in srgb, var(--theme-accent) 18%, transparent), transparent 34%), radial-gradient(circle at 78% 0%, color-mix(in srgb, var(--theme-accent-alt) 14%, transparent), transparent 30%)',
    panelOverlay: 'linear-gradient(145deg, color-mix(in srgb, var(--theme-bg) 46%, transparent), color-mix(in srgb, var(--theme-accent) 10%, transparent))',
  },
  minimal: {
    fonts: { display: '"Manrope", "Outfit", system-ui, sans-serif', ui: '"Manrope", "Outfit", system-ui, sans-serif', body: '"Manrope", "Outfit", system-ui, sans-serif' },
    effects: { blur: 0, glow: 0.04, shadow: '0 10px 28px rgba(15,23,42,.1)' },
    shape: { radius: [10, 14, 18, 24], edge: 'minimal', border: 1 },
    motion: { fast: '120ms', normal: '180ms', slow: '240ms', hoverScale: 1.004 },
    texture: 'none',
    panelOverlay: 'linear-gradient(180deg, var(--theme-surface), var(--theme-surface-strong))',
  },
};

const MARVEL_THEME_TOKEN_MAP = {
  'iron-man': { accent: '#f43f3f', accent2: '#f59e0b' },
  'captain-marvel': { accent: '#2d71ff', accent2: '#f4b400' },
  'black-panther': { accent: '#8b5cf6', accent2: '#06b6d4' },
  'ant-man': { accent: '#ff4fa3', accent2: '#22d3ee' },
  'doctor-strange': { accent: '#a855f7', accent2: '#fb7185' },
  'spider-man': { accent: '#ef4444', accent2: '#2563eb' },
  thor: { accent: '#38bdf8', accent2: '#fde68a' },
  'scarlet-witch': { accent: '#e11d48', accent2: '#f472b6' },
  'winter-soldier': { accent: '#94a3b8', accent2: '#475569' },
  'captain-america': { accent: '#3b82f6', accent2: '#ef4444' },
  daredevil: { accent: '#dc2626', accent2: '#991b1b' },
  'panther-tech': { accent: '#67e8f9', accent2: '#6366f1' },
  'marvel-red': { accent: '#e23636', accent2: '#fb923c' },
  hela: { accent: '#22c55e', accent2: '#d9f99d' },
};

const DC_THEME_TOKEN_MAP = {
  'iron-man': { accent: '#2563eb', accent2: '#ef4444' },
  'captain-marvel': { accent: '#dc2626', accent2: '#facc15' },
  'black-panther': { accent: '#facc15', accent2: '#64748b' },
  'ant-man': { accent: '#f97316', accent2: '#facc15' },
  'doctor-strange': { accent: '#38bdf8', accent2: '#f59e0b' },
  'spider-man': { accent: '#0ea5e9', accent2: '#1e3a8a' },
  thor: { accent: '#14b8a6', accent2: '#f59e0b' },
  'scarlet-witch': { accent: '#ec4899', accent2: '#22d3ee' },
  'winter-soldier': { accent: '#94a3b8', accent2: '#38bdf8' },
  'captain-america': { accent: '#3b82f6', accent2: '#f8fafc' },
  daredevil: { accent: '#b91c1c', accent2: '#64748b' },
  'panther-tech': { accent: '#22c55e', accent2: '#a3e635' },
  'marvel-red': { accent: '#1d4ed8', accent2: '#60a5fa' },
  hela: { accent: '#16a34a', accent2: '#bef264' },
};

export const THEME_TOKEN_MAP = MARVEL_THEME_TOKEN_MAP;

const COLOR_MODE_TOKENS = {
  marvel: {
    dark: { bg: '#07050c', bgAlt: '#14080d', surface: 'rgba(25,22,31,.76)', surfaceStrong: 'rgba(40,31,39,.9)', text: '#fff7ed', text2: '#d8c9c1', muted: '#a9958d', border: 'rgba(255,255,255,.12)', shadowRgb: '#07050c' },
    light: { bg: '#fff4e6', bgAlt: '#ffe7df', surface: 'rgba(255,251,246,.84)', surfaceStrong: 'rgba(255,255,255,.96)', text: '#241313', text2: '#664744', muted: '#8a6861', border: 'rgba(127,29,29,.16)', shadowRgb: '#7f1d1d' },
  },
  dc: {
    dark: { bg: '#030817', bgAlt: '#061b3a', surface: 'rgba(12,24,48,.76)', surfaceStrong: 'rgba(18,36,70,.9)', text: '#eff6ff', text2: '#bfd8ff', muted: '#8fb4e8', border: 'rgba(147,197,253,.16)', shadowRgb: '#020617' },
    light: { bg: '#eef6ff', bgAlt: '#e7f0ff', surface: 'rgba(248,252,255,.84)', surfaceStrong: 'rgba(255,255,255,.97)', text: '#08162c', text2: '#294365', muted: '#527099', border: 'rgba(37,99,235,.16)', shadowRgb: '#1e3a8a' },
  },
};

export const resolveThemeTokens = ({ appearanceMode = 'glass', characterTheme = 'iron-man', darkMode = true, universe = 'mcu' }) => {
  const normalizedMode = normalizeAppearanceMode(appearanceMode);
  const mode = MODE_TOKENS[normalizedMode] || MODE_TOKENS.glass;
  const universeKey = universe === 'dc' ? 'dc' : 'marvel';
  const brandMap = universeKey === 'dc' ? DC_THEME_TOKEN_MAP : MARVEL_THEME_TOKEN_MAP;
  const hero = brandMap[characterTheme] || brandMap['iron-man'];
  const color = COLOR_MODE_TOKENS[universeKey][darkMode ? 'dark' : 'light'];
  const glowSoftPct = Math.round(mode.effects.glow * 42);
  const glowStrongPct = Math.round(mode.effects.glow * 68);

  return {
    '--bg-base': color.bg,
    '--bg-elevated': color.surfaceStrong,
    '--surface-1': color.surface,
    '--surface-2': color.surfaceStrong,
    '--surface-3': `color-mix(in srgb, ${color.surfaceStrong} 84%, ${hero.accent})`,
    '--text-primary': color.text,
    '--text-secondary': color.text2,
    '--text-muted': color.muted,
    '--accent-1': hero.accent,
    '--accent-2': hero.accent2,
    '--theme-accent': hero.accent,
    '--theme-accent-alt': hero.accent2,
    '--theme-bg': color.bg,
    '--theme-bg-alt': color.bgAlt,
    '--theme-surface': color.surface,
    '--theme-surface-hover': `color-mix(in srgb, ${color.surfaceStrong} 90%, ${hero.accent} 10%)`,
    '--theme-surface-strong': color.surfaceStrong,
    '--theme-border': color.border,
    '--theme-text': color.text,
    '--theme-text-primary': color.text,
    '--theme-text-secondary': color.text2,
    '--theme-text-muted': color.muted,
    '--theme-shadow-rgb': color.shadowRgb,
    '--edge-color': color.border,
    '--edge-highlight': darkMode ? 'rgba(255,255,255,.18)' : 'rgba(255,255,255,.86)',
    '--glow-color': hero.accent,
    '--glow-soft': `color-mix(in srgb, ${hero.accent} ${glowSoftPct}%, transparent)`,
    '--glow-strong': `color-mix(in srgb, ${hero.accent2} ${glowStrongPct}%, transparent)`,
    '--radius-sm': `${mode.shape.radius[0]}px`,
    '--radius-md': `${mode.shape.radius[1]}px`,
    '--radius-lg': `${mode.shape.radius[2]}px`,
    '--radius-xl': `${mode.shape.radius[3]}px`,
    '--font-display-mode': mode.fonts.display,
    '--font-ui-mode': mode.fonts.ui,
    '--font-body-mode': mode.fonts.body,
    '--font-marvel-display': mode.fonts.display,
    '--font-marvel-ui': mode.fonts.ui,
    '--font-marvel-body': mode.fonts.body,
    '--motion-fast': mode.motion.fast,
    '--motion-normal': mode.motion.normal,
    '--motion-slow': mode.motion.slow,
    '--theme-hover-scale': mode.motion.hoverScale,
    '--fx-blur': `${mode.effects.blur}px`,
    '--fx-shadow-2': mode.effects.shadow,
    '--fx-border-width': `${mode.shape.border}px`,
    '--theme-texture': mode.texture,
    '--texture-overlay': mode.texture,
    '--theme-panel-overlay': mode.panelOverlay,
    '--theme-style-edge': mode.shape.edge,
  };
};
