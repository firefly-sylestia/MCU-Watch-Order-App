export const STYLE_MODE_CHOICES = [
  { id: 'default', label: 'Default' },
  { id: 'glass', label: 'Glass' },
  { id: 'pixelated', label: 'Pixelated' },
  { id: 'neon', label: 'Neon' },
  { id: 'minimal', label: 'Minimal' },
];

export const HERO_THEME_CHOICES = [
  { id: 'iron-man', label: 'Iron Man', swatch: '#d33a2c' },
  { id: 'captain-america', label: 'Captain America', swatch: '#2f63d6' },
  { id: 'black-panther', label: 'Black Panther', swatch: '#6556d8' },
  { id: 'scarlet-witch', label: 'Scarlet Witch', swatch: '#cf3766' },
  { id: 'thor', label: 'Thor', swatch: '#30a0e8' },
  { id: 'dr-strange', label: 'Dr. Strange', swatch: '#ac5be4' },
  { id: 'spider-man', label: 'Spider-Man', swatch: '#d64247' },
];

const HERO_ACCENTS = {
  'iron-man': { primary: '#d33a2c', secondary: '#d6a531', glow: '#ef5f48' },
  'captain-america': { primary: '#2f63d6', secondary: '#c8454a', glow: '#6896ff' },
  'black-panther': { primary: '#6556d8', secondary: '#3fb9ff', glow: '#8c7dff' },
  'scarlet-witch': { primary: '#cf3766', secondary: '#ff7ea7', glow: '#f0628d' },
  thor: { primary: '#30a0e8', secondary: '#a9d8ff', glow: '#65bcff' },
  'dr-strange': { primary: '#ac5be4', secondary: '#ff8f4f', glow: '#ca8af5' },
  'spider-man': { primary: '#d64247', secondary: '#3173da', glow: '#f16b72' },
};

const STYLE_SURFACES = {
  default: { panelBlur: '10px', panelAlphaDark: '0.86', panelAlphaLight: '0.92', radius: '18px', borderStyle: 'solid', glowOpacity: '0.2', shadow1: '0 10px 30px rgba(2,8,23,.24)', shadow2: '0 20px 52px rgba(2,8,23,.30)' },
  glass: { panelBlur: '18px', panelAlphaDark: '0.58', panelAlphaLight: '0.74', radius: '22px', borderStyle: 'solid', glowOpacity: '0.3', shadow1: '0 16px 36px rgba(2,8,23,.28)', shadow2: '0 28px 68px rgba(2,8,23,.34)' },
  pixelated: { panelBlur: '0px', panelAlphaDark: '0.9', panelAlphaLight: '0.95', radius: '8px', borderStyle: 'solid', glowOpacity: '0.14', shadow1: '4px 4px 0 rgba(0,0,0,.35)', shadow2: '8px 8px 0 rgba(0,0,0,.42)' },
  neon: { panelBlur: '12px', panelAlphaDark: '0.82', panelAlphaLight: '0.9', radius: '16px', borderStyle: 'solid', glowOpacity: '0.38', shadow1: '0 10px 30px rgba(0,0,0,.38)', shadow2: '0 20px 56px rgba(0,0,0,.48)' },
  minimal: { panelBlur: '0px', panelAlphaDark: '0.92', panelAlphaLight: '0.97', radius: '14px', borderStyle: 'solid', glowOpacity: '0.08', shadow1: '0 6px 18px rgba(2,8,23,.14)', shadow2: '0 14px 34px rgba(2,8,23,.20)' },
};

export const buildThemeTokens = ({ darkMode, heroTheme = 'iron-man', styleMode = 'default' }) => {
  const hero = HERO_ACCENTS[heroTheme] || HERO_ACCENTS['iron-man'];
  const style = STYLE_SURFACES[styleMode] || STYLE_SURFACES.default;
  const baseBg = darkMode ? '#090d18' : '#eef2f8';
  const elevated = darkMode ? `rgba(17,24,39,${style.panelAlphaDark})` : `rgba(255,255,255,${style.panelAlphaLight})`;
  return {
    '--bg-canvas': baseBg,
    '--bg-elevated': elevated,
    '--bg-overlay': darkMode ? 'rgba(3,6,16,.62)' : 'rgba(15,23,42,.14)',
    '--text-primary': darkMode ? '#eef4ff' : '#0f172a',
    '--text-secondary': darkMode ? '#b7c4dc' : '#334155',
    '--text-muted': darkMode ? '#8594b2' : '#64748b',
    '--border-soft': darkMode ? 'rgba(164,179,206,.24)' : 'rgba(51,65,85,.18)',
    '--border-strong': darkMode ? 'rgba(195,214,240,.44)' : 'rgba(51,65,85,.3)',
    '--accent-primary': hero.primary,
    '--accent-secondary': hero.secondary,
    '--accent-glow': hero.glow,
    '--state-success': darkMode ? '#4ade80' : '#166534',
    '--state-warning': darkMode ? '#fbbf24' : '#a16207',
    '--state-error': darkMode ? '#fb7185' : '#be123c',
    '--state-info': darkMode ? '#60a5fa' : '#1d4ed8',
    '--blur-panel': style.panelBlur,
    '--blur-overlay': darkMode ? '8px' : '6px',
    '--glow-radius-sm': '16px',
    '--glow-radius-md': '28px',
    '--glow-radius-lg': '48px',
    '--glow-opacity': style.glowOpacity,
    '--shadow-depth-1': style.shadow1,
    '--shadow-depth-2': style.shadow2,
    '--shadow-depth-3': darkMode ? '0 34px 72px rgba(0,0,0,.58)' : '0 30px 64px rgba(15,23,42,.24)',
    '--radius-sm': '10px','--radius-md': '14px','--radius-lg': style.radius,'--radius-xl': '24px','--radius-pill': '999px',
    '--edge-highlight': darkMode ? 'rgba(255,255,255,.12)' : 'rgba(255,255,255,.78)',
    '--edge-stroke': darkMode ? 'rgba(164,179,206,.38)' : 'rgba(30,41,59,.2)',
    '--duration-fast': '140ms','--duration-normal': '200ms','--duration-slow': '240ms',
    '--easing-standard': 'cubic-bezier(.2,.8,.2,1)','--easing-emphasized': 'cubic-bezier(.16,1,.3,1)',
  };
};
