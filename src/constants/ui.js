export const MOBILE_TABS = ["assets", "avatar", "text"];

export const UI_PARITY_TOKENS = {
  spacing: { xs: '6px', sm: '10px', md: '14px', lg: '18px', xl: '24px', xxl: '32px' },
  typography: {
    display: 'clamp(2.4rem, 6vw, 4.75rem)',
    h1: 'clamp(1.7rem, 4vw, 2.5rem)',
    h2: 'clamp(1.25rem, 3vw, 1.75rem)',
    body: '1rem',
    caption: '0.78rem',
  },
  radius: { sm: '10px', md: '12px', lg: '16px' },
  motion: { fast: '150ms', base: '200ms', slow: '240ms' },
  contrastTargets: { normalText: '4.5:1', largeText: '3:1', nonTextUI: '3:1' },
};

export const SEMANTIC_COLOR_MATRIX = {
  dark: {
    background: '#070b14',
    backgroundElevated: '#0f172a',
    surface: '#131d33',
    surface2: '#1b2942',
    emphasis: '#e6efff',
    success: '#4ade80',
    warning: '#fbbf24',
    error: '#f87171',
    textPrimary: '#edf3ff',
    textSecondary: '#a9b9d8',
    borderSoft: 'rgba(173, 194, 232, 0.16)',
    borderStrong: 'rgba(173, 194, 232, 0.26)',
    glow: 'rgba(92, 150, 255, 0.30)',
  },
  light: {
    background: '#f4f7ff',
    backgroundElevated: '#ffffff',
    surface: '#f8faff',
    surface2: '#eef3ff',
    emphasis: '#101a31',
    success: '#15803d',
    warning: '#b45309',
    error: '#b91c1c',
    textPrimary: '#14213d',
    textSecondary: '#4e5f82',
    borderSoft: 'rgba(73, 102, 161, 0.16)',
    borderStrong: 'rgba(73, 102, 161, 0.24)',
    glow: 'rgba(72, 122, 222, 0.18)',
  },
};

export const buildSemanticThemeVars = (darkMode) => {
  const mode = darkMode ? 'dark' : 'light';
  const c = SEMANTIC_COLOR_MATRIX[mode];

  return {
    '--theme-bg': c.background,
    '--theme-bg-elevated': c.backgroundElevated,
    '--theme-surface': c.surface,
    '--theme-surface-2': c.surface2,
    '--theme-surface-hover': `color-mix(in srgb, ${c.surface2} 74%, ${c.emphasis})`,
    '--theme-surface-dark': 'color-mix(in srgb, #18253f 88%, #070b14)',
    '--theme-surface-light': 'color-mix(in srgb, #f9fbff 92%, #ecf2ff)',
    '--theme-surface-hover-dark': 'color-mix(in srgb, #22365a 78%, #edf3ff)',
    '--theme-surface-hover-light': 'color-mix(in srgb, #ffffff 90%, #d9e6ff)',
    '--theme-comp-card-dark': 'linear-gradient(145deg, rgba(19,29,51,0.94), rgba(27,41,66,0.9))',
    '--theme-comp-card-light': 'linear-gradient(145deg, rgba(255,255,255,0.95), rgba(238,243,255,0.92))',
    '--theme-text': c.textPrimary,
    '--theme-text-primary': c.textPrimary,
    '--theme-text-secondary': c.textSecondary,
    '--theme-text-muted': c.textSecondary,
    '--theme-success': c.success,
    '--theme-warning': c.warning,
    '--theme-danger': c.error,
    '--theme-border': c.borderSoft,
    '--theme-border-strong': c.borderStrong,
    '--theme-glow': c.glow,
    '--theme-gradient-accent': `linear-gradient(135deg, color-mix(in srgb, var(--theme-accent) 82%, white), color-mix(in srgb, var(--theme-accent-alt) 80%, #9ab8ff))`,
    '--theme-gradient-surface': darkMode
      ? 'linear-gradient(165deg, rgba(18,28,48,0.96), rgba(11,17,30,0.92))'
      : 'linear-gradient(165deg, rgba(255,255,255,0.96), rgba(239,244,255,0.94))',
    '--theme-shadow-soft': darkMode
      ? '0 14px 32px rgba(2, 8, 20, 0.34), 0 2px 0 rgba(255,255,255,0.04) inset'
      : '0 16px 34px rgba(28, 53, 107, 0.12), 0 1px 0 rgba(255,255,255,0.8) inset',
    '--theme-shadow-glow': darkMode
      ? '0 0 0 1px rgba(173,194,232,0.08), 0 18px 42px rgba(5,10,20,0.45), 0 0 28px rgba(92,150,255,0.24)'
      : '0 0 0 1px rgba(119,149,209,0.16), 0 18px 40px rgba(85,116,179,0.14), 0 0 24px rgba(72,122,222,0.16)',
  };
};

export const UI_TOKENS = {
  panel: { level1: 'var(--ui-panel-1)', level2: 'var(--ui-panel-2)' },
  border: { soft: 'var(--ui-border-soft)', strong: 'var(--ui-border-strong)' },
  shadow: { level1: 'var(--ui-shadow-1)', level2: 'var(--ui-shadow-2)' },
  spacing: {
    xs: 'var(--ui-space-1)', sm: 'var(--ui-space-2)', md: 'var(--ui-space-3)', lg: 'var(--ui-space-4)',
  },
  radius: { sm: 'var(--ui-radius-sm)', md: 'var(--ui-radius-md)', lg: 'var(--ui-radius-lg)' },
};
