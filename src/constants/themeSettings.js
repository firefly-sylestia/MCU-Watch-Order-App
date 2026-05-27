export const APPEARANCE_MODES = [
  { id: 'glass', label: 'Glass', description: 'Soft depth, high blur, diffused glow.' },
  { id: 'pixelated', label: 'Pixelated', description: 'Stepped edges, crisp contrast, retro texture.' },
  { id: 'neo', label: 'Neo', description: 'Bold neon bloom with vibrant framing.' },
  { id: 'minimal', label: 'Minimal', description: 'Clean surfaces and restrained effects.' },
];

export const CHARACTER_THEMES = [
  { id: 'iron-man', label: 'Iron Man', swatch: '#ff5a3d', accent2: '#ffcc4d' },
  { id: 'captain-marvel', label: 'Captain Marvel', swatch: '#4c80ff', accent2: '#6fe7ff' },
  { id: 'black-panther', label: 'Black Panther', swatch: '#8866ff', accent2: '#48c9ff' },
  { id: 'doctor-strange', label: 'Doctor Strange', swatch: '#9f66ff', accent2: '#ff8b3e' },
  { id: 'spider-man', label: 'Spider-Man', swatch: '#df3f4c', accent2: '#3f8cff' },
  { id: 'scarlet-witch', label: 'Scarlet Witch', swatch: '#d72664', accent2: '#ff8bc7' },
  { id: 'thor', label: 'Thor', swatch: '#3ca6ff', accent2: '#d4ecff' },
  { id: 'winter-soldier', label: 'Winter Soldier', swatch: '#8fa0b8', accent2: '#596980' },
];

export const THEME_TOKEN_MAP = {
  spacing: { xs: '4px', sm: '8px', md: '12px', lg: '16px', xl: '24px', xxl: '32px' },
  motion: { fast: '120ms', normal: '190ms', slow: '280ms', easing: 'cubic-bezier(.2,.8,.2,1)', hoverScale: '1.015', pressScale: '0.985' },
  shape: {
    glass: { sm: '10px', md: '14px', lg: '20px', xl: '28px', borderWidth: '1px', edgeTreatment: 'smooth' },
    pixelated: { sm: '2px', md: '4px', lg: '8px', xl: '10px', borderWidth: '2px', edgeTreatment: 'stepped' },
    neo: { sm: '12px', md: '16px', lg: '22px', xl: '32px', borderWidth: '1px', edgeTreatment: 'neon' },
    minimal: { sm: '8px', md: '10px', lg: '14px', xl: '20px', borderWidth: '1px', edgeTreatment: 'clean' },
  },
  effects: {
    glass: { blur: '20px', glowSoft: '0.28', glowStrong: '0.46', shadow1: '0 8px 24px rgba(0,0,0,.16)', shadow2: '0 18px 48px rgba(0,0,0,.24)' },
    pixelated: { blur: '2px', glowSoft: '0.16', glowStrong: '0.24', shadow1: '0 4px 0 rgba(0,0,0,.22)', shadow2: '0 8px 0 rgba(0,0,0,.28)' },
    neo: { blur: '12px', glowSoft: '0.35', glowStrong: '0.62', shadow1: '0 10px 28px rgba(0,0,0,.24)', shadow2: '0 18px 56px rgba(0,0,0,.34)' },
    minimal: { blur: '0px', glowSoft: '0.1', glowStrong: '0.18', shadow1: '0 6px 16px rgba(0,0,0,.12)', shadow2: '0 12px 30px rgba(0,0,0,.16)' },
  },
};

const modeColors = {
  dark: { bg: '#080b14', surface: '#101523', elevated: '#161d30', border: 'rgba(179,194,219,0.22)', text: '#e8edf7', muted: '#9ea9be', status: '#4ade80' },
  light: { bg: '#eef3fa', surface: '#ffffff', elevated: '#f4f7fc', border: 'rgba(23,34,58,0.16)', text: '#111b2e', muted: '#55627b', status: '#16a34a' },
};

export function resolveThemeTokens({ appearanceMode = 'glass', characterTheme = 'iron-man', darkMode = true } = {}) {
  const mode = APPEARANCE_MODES.some(m => m.id === appearanceMode) ? appearanceMode : 'glass';
  const char = CHARACTER_THEMES.find(t => t.id === characterTheme) || CHARACTER_THEMES[0];
  const colorSet = darkMode ? modeColors.dark : modeColors.light;
  const shape = THEME_TOKEN_MAP.shape[mode];
  const fx = THEME_TOKEN_MAP.effects[mode];
  const motion = THEME_TOKEN_MAP.motion;
  const texture = mode === 'pixelated'
    ? 'linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px)'
    : mode === 'glass'
      ? 'radial-gradient(circle at 15% 10%, rgba(255,255,255,.05), transparent 40%)'
      : 'none';

  return {
    '--bg-base': colorSet.bg,
    '--bg-elevated': colorSet.elevated,
    '--surface-1': colorSet.surface,
    '--surface-2': colorSet.elevated,
    '--text-primary': colorSet.text,
    '--text-secondary': colorSet.muted,
    '--accent-1': char.swatch,
    '--accent-2': char.accent2,
    '--edge-color': colorSet.border,
    '--edge-highlight': darkMode ? 'rgba(255,255,255,.26)' : 'rgba(255,255,255,.72)',
    '--glow-color': char.swatch,
    '--glow-soft': fx.glowSoft,
    '--glow-strong': fx.glowStrong,
    '--blur-radius': fx.blur,
    '--shadow-1': fx.shadow1,
    '--shadow-2': fx.shadow2,
    '--radius-sm': shape.sm,
    '--radius-md': shape.md,
    '--radius-lg': shape.lg,
    '--radius-xl': shape.xl,
    '--border-width': shape.borderWidth,
    '--motion-fast': motion.fast,
    '--motion-normal': motion.normal,
    '--motion-slow': motion.slow,
    '--motion-ease': motion.easing,
    '--motion-hover-scale': motion.hoverScale,
    '--motion-press-scale': motion.pressScale,
    '--space-xs': THEME_TOKEN_MAP.spacing.xs,
    '--space-sm': THEME_TOKEN_MAP.spacing.sm,
    '--space-md': THEME_TOKEN_MAP.spacing.md,
    '--space-lg': THEME_TOKEN_MAP.spacing.lg,
    '--space-xl': THEME_TOKEN_MAP.spacing.xl,
    '--space-xxl': THEME_TOKEN_MAP.spacing.xxl,
    '--texture-overlay': texture,
    '--status-success': colorSet.status,
    '--theme-bg': colorSet.bg,
    '--theme-surface': colorSet.surface,
    '--theme-surface-hover': colorSet.elevated,
    '--theme-border': colorSet.border,
    '--theme-text': colorSet.text,
    '--theme-text-primary': colorSet.text,
    '--theme-text-secondary': colorSet.muted,
    '--theme-text-muted': colorSet.muted,
    '--theme-accent': char.swatch,
    '--theme-accent-alt': char.accent2,
  };
}
