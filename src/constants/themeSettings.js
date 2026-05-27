export const STYLE_MODES = [
  { id: 'default', label: 'Default', description: 'Balanced gradients and soft depth.' },
  { id: 'glass', label: 'Glass', description: 'Frosted translucency with blur and glow.' },
  { id: 'pixelated', label: 'Pixelated', description: 'Retro block edges with crisp shadows.' },
  { id: 'neon', label: 'Neon', description: 'Dark-forward edge lighting and accents.' },
  { id: 'minimal', label: 'Minimal', description: 'Quiet flat surfaces and clear hierarchy.' },
];

export const HERO_THEMES = [
  { id: 'iron-man', label: 'Iron Man', swatch: '#d64035', accent: '#d64035', accentSecondary: '#f1b24a', glow: '#ff7659' },
  { id: 'captain-america', label: 'Captain America', swatch: '#2f5db8', accent: '#2f5db8', accentSecondary: '#d33b45', glow: '#67a9ff' },
  { id: 'black-panther', label: 'Black Panther', swatch: '#7256d8', accent: '#7256d8', accentSecondary: '#24b8c8', glow: '#9079ff' },
  { id: 'thor', label: 'Thor', swatch: '#2f8edf', accent: '#2f8edf', accentSecondary: '#8fd3ff', glow: '#4eb4ff' },
  { id: 'scarlet-witch', label: 'Scarlet Witch', swatch: '#b22d63', accent: '#b22d63', accentSecondary: '#ff7ab9', glow: '#db4d8c' },
];

const HERO_MAP = Object.fromEntries(HERO_THEMES.map((h) => [h.id, h]));

const MODE_TOKENS = {
  dark: { canvas: '#080b14', elevated: '#121826', overlay: 'rgba(8, 11, 20, 0.72)', text: '#edf2ff', textSecondary: '#b8c2d9', textMuted: '#8a94ac', borderSoft: 'rgba(187,203,231,0.18)', borderStrong: 'rgba(187,203,231,0.38)' },
  light: { canvas: '#eff3fb', elevated: '#ffffff', overlay: 'rgba(239, 243, 251, 0.78)', text: '#0e1628', textSecondary: '#31405f', textMuted: '#5f6e8f', borderSoft: 'rgba(25,38,66,0.16)', borderStrong: 'rgba(25,38,66,0.32)' },
};

export const getThemeCssVars = ({ heroTheme = 'iron-man', styleMode = 'default', darkMode = true }) => {
  const hero = HERO_MAP[heroTheme] || HERO_MAP['iron-man'];
  const mode = darkMode ? MODE_TOKENS.dark : MODE_TOKENS.light;
  const blur = styleMode === 'pixelated' ? '0px' : styleMode === 'minimal' ? '4px' : styleMode === 'glass' ? '16px' : '10px';
  const radiusLg = styleMode === 'pixelated' ? '8px' : styleMode === 'minimal' ? '12px' : '18px';
  const shadowDepth2 = styleMode === 'neon' ? `0 0 0 1px color-mix(in srgb, ${hero.accent} 45%, transparent), 0 16px 44px rgba(0,0,0,.45)` : styleMode === 'pixelated' ? '0 6px 0 rgba(0,0,0,.32)' : '0 16px 38px rgba(5,10,24,.28)';

  return {
    '--bg-canvas': mode.canvas,
    '--bg-elevated': mode.elevated,
    '--bg-overlay': mode.overlay,
    '--text-primary': mode.text,
    '--text-secondary': mode.textSecondary,
    '--text-muted': mode.textMuted,
    '--border-soft': mode.borderSoft,
    '--border-strong': mode.borderStrong,
    '--accent-primary': hero.accent,
    '--accent-secondary': hero.accentSecondary,
    '--accent-glow': hero.glow,
    '--state-success': darkMode ? '#35c47b' : '#157f4a',
    '--state-warning': darkMode ? '#e0b041' : '#9c670f',
    '--state-error': darkMode ? '#e06774' : '#b6313f',
    '--state-info': darkMode ? '#5ba4ff' : '#2f67d0',
    '--blur-panel': blur,
    '--blur-overlay': styleMode === 'pixelated' ? '0px' : '8px',
    '--glow-radius-sm': '12px',
    '--glow-radius-md': '24px',
    '--glow-radius-lg': '56px',
    '--glow-opacity': styleMode === 'neon' ? '.55' : '.34',
    '--shadow-depth-1': '0 8px 22px rgba(3,12,28,.16)',
    '--shadow-depth-2': shadowDepth2,
    '--shadow-depth-3': '0 28px 72px rgba(2,8,22,.38)',
    '--radius-sm': styleMode === 'pixelated' ? '4px' : '10px',
    '--radius-md': styleMode === 'pixelated' ? '6px' : '14px',
    '--radius-lg': radiusLg,
    '--radius-xl': styleMode === 'pixelated' ? '10px' : '22px',
    '--radius-pill': '999px',
    '--edge-highlight': `color-mix(in srgb, ${hero.accent} 30%, transparent)`,
    '--edge-stroke': `color-mix(in srgb, ${hero.accentSecondary} 36%, ${mode.borderSoft})`,
    '--duration-fast': '140ms',
    '--duration-normal': '200ms',
    '--duration-slow': '240ms',
    '--easing-standard': 'cubic-bezier(.2,.8,.2,1)',
    '--easing-emphasized': 'cubic-bezier(.16,1,.3,1)',
  };
};
