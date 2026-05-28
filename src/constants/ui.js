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

export const THEME_STATUS_TOKENS = {
  film: 'var(--media-film)',
  series: 'var(--media-series)',
  short: 'var(--media-short)',
  watched: 'var(--status-complete)',
  watchlist: 'var(--status-watchlist)',
  watching: 'var(--status-watching)',
  paused: 'var(--status-paused)',
  dropped: 'var(--status-dropped)',
};

export const SEMANTIC_COLOR_MATRIX = {
  dark: {
    background: '#070a13',
    backgroundAlt: '#0d1324',
    surface: 'rgba(18, 25, 42, 0.84)',
    surfaceElevated: 'rgba(25, 34, 55, 0.92)',
    surfaceSolid: '#151e31',
    emphasis: '#f7fbff',
    success: '#38d996',
    warning: '#ffcf5c',
    error: '#ff6f8e',
    textPrimary: '#f5f8ff',
    textSecondary: '#c5d0e3',
    textMuted: '#93a2ba',
    textDisabled: 'rgba(180, 194, 218, 0.58)',
    border: 'rgba(194, 213, 255, 0.13)',
    borderStrong: 'rgba(214, 226, 255, 0.2)',
    shadow: '0 18px 48px rgba(0, 0, 0, 0.34)',
    shadowSoft: '0 10px 28px rgba(0, 0, 0, 0.24)',
    overlaySoft: 'rgba(3, 7, 18, 0.34)',
    overlayStrong: 'rgba(3, 7, 18, 0.58)',
    appGradient: 'linear-gradient(138deg, #050714 0%, #0a1020 38%, #11162f 68%, #191236 100%)',
  },
  light: {
    background: '#f4f7fb',
    backgroundAlt: '#e8eef7',
    surface: 'rgba(255, 255, 255, 0.86)',
    surfaceElevated: 'rgba(255, 255, 255, 0.96)',
    surfaceSolid: '#ffffff',
    emphasis: '#111827',
    success: '#0f9f6e',
    warning: '#b7791f',
    error: '#d92d57',
    textPrimary: '#111827',
    textSecondary: '#40516d',
    textMuted: '#68758c',
    textDisabled: 'rgba(86, 101, 124, 0.58)',
    border: 'rgba(29, 41, 57, 0.12)',
    borderStrong: 'rgba(29, 41, 57, 0.2)',
    shadow: '0 18px 42px rgba(31, 41, 55, 0.12)',
    shadowSoft: '0 10px 24px rgba(31, 41, 55, 0.09)',
    overlaySoft: 'rgba(15, 23, 42, 0.06)',
    overlayStrong: 'rgba(15, 23, 42, 0.16)',
    appGradient: 'linear-gradient(140deg, #f7f9fd 0%, #ecf2fb 45%, #f8f5ee 100%)',
  },
};

export const buildSemanticThemeVars = (darkMode) => {
  const mode = darkMode ? 'dark' : 'light';
  const c = SEMANTIC_COLOR_MATRIX[mode];

  return {
    '--theme-mode': mode,
    '--theme-bg': c.background,
    '--theme-bg-alt': c.backgroundAlt,
    '--theme-bg-secondary': c.backgroundAlt,
    '--theme-bg-tertiary': darkMode ? '#10172a' : '#e3ebf6',
    '--theme-surface': c.surface,
    '--theme-surface-elevated': c.surfaceElevated,
    '--theme-surface-solid': c.surfaceSolid,
    '--theme-surface-hover': `color-mix(in srgb, ${c.surfaceSolid} ${darkMode ? 88 : 92}%, var(--theme-accent))`,
    '--theme-surface-dark': 'color-mix(in srgb, var(--theme-surface-solid) 88%, #020617)',
    '--theme-surface-light': 'color-mix(in srgb, var(--theme-surface-solid) 92%, #f8fafc)',
    '--theme-surface-hover-dark': 'color-mix(in srgb, var(--theme-surface-solid) 84%, var(--theme-accent))',
    '--theme-surface-hover-light': 'color-mix(in srgb, var(--theme-surface-solid) 92%, var(--theme-accent))',
    '--theme-comp-card-dark': 'color-mix(in srgb, var(--theme-surface-solid) 88%, #020617)',
    '--theme-comp-card-light': 'color-mix(in srgb, var(--theme-surface-solid) 95%, #eef2ff)',
    '--theme-border': c.border,
    '--theme-border-strong': c.borderStrong,
    '--theme-text': c.textPrimary,
    '--theme-text-primary': c.textPrimary,
    '--theme-text-secondary': c.textSecondary,
    '--theme-text-muted': c.textMuted,
    '--theme-text-disabled': c.textDisabled,
    '--theme-success': c.success,
    '--theme-warning': c.warning,
    '--theme-danger': c.error,
    '--theme-success-soft': `color-mix(in srgb, ${c.success} ${darkMode ? 18 : 12}%, transparent)`,
    '--theme-warning-soft': `color-mix(in srgb, ${c.warning} ${darkMode ? 18 : 12}%, transparent)`,
    '--theme-danger-soft': `color-mix(in srgb, ${c.error} ${darkMode ? 18 : 12}%, transparent)`,
    '--theme-focus-ring': 'color-mix(in srgb, var(--theme-accent) 70%, white)',
    '--theme-app-gradient': c.appGradient,
    '--theme-shadow-soft': c.shadowSoft,
    '--theme-shadow': c.shadow,
    '--overlay-soft': c.overlaySoft,
    '--overlay-dark': c.overlayStrong,
    '--overlay-strong': c.overlayStrong,
    '--control-solid-bg': darkMode
      ? 'color-mix(in srgb, var(--theme-surface-solid) 78%, transparent)'
      : 'color-mix(in srgb, var(--theme-surface-solid) 90%, transparent)',
    '--input-bg': darkMode
      ? 'color-mix(in srgb, var(--theme-surface-solid) 84%, #020617)'
      : 'color-mix(in srgb, var(--theme-surface-solid) 96%, #eef2ff)',
    '--input-border': 'var(--theme-border)',
    '--input-color': 'var(--theme-text)',
    '--dropdown-bg': darkMode
      ? 'color-mix(in srgb, var(--theme-surface-solid) 88%, transparent)'
      : 'color-mix(in srgb, var(--theme-surface-solid) 94%, transparent)',
    '--dropdown-border': 'var(--theme-border)',
    '--dropdown-shadow': c.shadow,
    '--media-film': '#ff5d5d',
    '--media-series': '#45b7ff',
    '--media-short': '#b688ff',
    '--status-complete': '#38d996',
    '--status-watchlist': '#4f8cff',
    '--status-watching': '#9d7cff',
    '--status-paused': '#ffcf5c',
    '--status-dropped': '#ff6f8e',
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
