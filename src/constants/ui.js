export const MOBILE_TABS = ["assets", "avatar", "text"];

export const UI_PARITY_TOKENS = {
  spacing: { xs: '6px', sm: '10px', md: '14px', lg: '18px', xl: '24px' },
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
    background: '#090d18',
    surface: '#141b2b',
    surfaceMuted: '#1b2639',
    emphasis: '#f3f8ff',
    success: '#4ade80',
    warning: '#facc15',
    error: '#f87171',
    textPrimary: '#f4f8ff',
    textSecondary: '#a9b6cb',
  },
  light: {
    background: '#eef2fa',
    surface: '#fbfdff',
    surfaceMuted: '#f1f5fc',
    emphasis: '#121a2a',
    success: '#15803d',
    warning: '#b45309',
    error: '#b91c1c',
    textPrimary: '#121a2a',
    textSecondary: '#4f5c70',
  },
};

export const buildSemanticThemeVars = (darkMode) => {
  const mode = darkMode ? 'dark' : 'light';
  const c = SEMANTIC_COLOR_MATRIX[mode];

  return {
    '--theme-bg': c.background,
    '--theme-bg-dark': '#090d18',
    '--theme-bg-light': '#eef2fa',
    '--theme-surface': c.surface,
    '--theme-surface-muted': c.surfaceMuted,
    '--theme-surface-hover': `color-mix(in srgb, ${c.surface} 82%, ${c.emphasis})`,
    '--theme-surface-dark': 'color-mix(in srgb, #141b2b 92%, #090d18)',
    '--theme-surface-light': 'color-mix(in srgb, #fbfdff 94%, #eef2fa)',
    '--theme-surface-muted-dark': 'color-mix(in srgb, #1b2639 90%, #0b1220)',
    '--theme-surface-muted-light': 'color-mix(in srgb, #f1f5fc 94%, #eef2fa)',
    '--theme-surface-hover-dark': 'color-mix(in srgb, #21304a 82%, #f4f8ff)',
    '--theme-surface-hover-light': 'color-mix(in srgb, #f7faff 86%, #1a2030)',
    '--theme-comp-card-dark': 'color-mix(in srgb, #1b2639 86%, #0f172a)',
    '--theme-comp-card-light': 'color-mix(in srgb, #ffffff 96%, #eef2fa)',
    '--theme-text': c.textPrimary,
    '--theme-text-primary': c.textPrimary,
    '--theme-text-secondary': c.textSecondary,
    '--theme-text-muted': c.textSecondary,
    '--theme-success': c.success,
    '--theme-warning': c.warning,
    '--theme-danger': c.error,
    '--theme-depth-shadow': darkMode ? '0 20px 48px rgba(4, 8, 18, 0.42)' : '0 16px 40px rgba(36, 56, 89, 0.14)',
    '--theme-depth-shadow-soft': darkMode ? '0 10px 24px rgba(6, 12, 24, 0.34)' : '0 8px 20px rgba(36, 56, 89, 0.10)',
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
