import { drawPremiumStars, drawRoundedPanel, drawWrappedText, fillGradientBackground, loadPosterWithFallback, clampTenPoint } from './helpers';

const CARD_SIZE = { width: 1080, height: 1350 };
const REVIEW_SIZE = { width: 1600, height: 2200 };
const GRID = 8;

const getFileName = ({ type, data, namingStrategy }) => {
  if (namingStrategy) return namingStrategy({ type, data });
  const title = data?.slugifyPosterName ? data.slugifyPosterName(data.item?.title || data.title || type) : type;
  return `${title}-${type}-card.png`;
};

const withAlpha = (hex, alpha) => {
  const clean = String(hex || '').replace('#', '');
  if (clean.length !== 6) return `rgba(255,255,255,${alpha})`;
  const value = parseInt(clean, 16);
  return `rgba(${(value >> 16) & 255},${(value >> 8) & 255},${value & 255},${alpha})`;
};

const UNIFIED_THEMES = {
  neoMarvel: {
    label: 'Marvel Modern', brand: 'MARVEL COMMAND', icon: '⚡',
    dark: { bg: ['#060A13', '#0D1B36', '#1C355F'], surface: 'rgba(8,12,22,0.86)', surfaceRaised: 'rgba(255,255,255,0.08)', text: '#F5F8FF', muted: '#B9C8E3', accent: '#4CC6FF', accentAlt: '#76FFD1', highlight: '#FFD166' },
    light: { bg: ['#EEF4FF', '#DEE9FF', '#C7DDFF'], surface: 'rgba(255,255,255,0.92)', surfaceRaised: 'rgba(255,255,255,0.96)', text: '#0F1A31', muted: '#44597D', accent: '#0C7CE8', accentAlt: '#0CA678', highlight: '#C98900' }
  },
  neoDc: {
    label: 'DC Modern', brand: 'DC COMMAND', icon: '◆',
    dark: { bg: ['#070A10', '#102239', '#27324E'], surface: 'rgba(10,14,24,0.87)', surfaceRaised: 'rgba(255,255,255,0.07)', text: '#F0F4FF', muted: '#B4BED6', accent: '#6CB8FF', accentAlt: '#B593FF', highlight: '#FFD98E' },
    light: { bg: ['#EDF2FF', '#DDE6FF', '#D4DEFF'], surface: 'rgba(255,255,255,0.93)', surfaceRaised: 'rgba(255,255,255,0.98)', text: '#101A2C', muted: '#4B5877', accent: '#2F7BEA', accentAlt: '#7653E8', highlight: '#AF7B00' }
  }
};

const LEGACY_THEME_ALIAS = {
  sacredTimeline: 'neoMarvel', timelinePortal: 'neoMarvel', watchParty: 'neoMarvel',
  multiverseGlitch: 'neoDc', heroDossier: 'neoDc', midnight: 'neoMarvel', stark: 'neoMarvel', vibranium: 'neoDc'
};

const getTheme = (settings = {}) => {
  const base = UNIFIED_THEMES[settings.theme] || UNIFIED_THEMES[LEGACY_THEME_ALIAS[settings.theme]] || UNIFIED_THEMES.neoMarvel;
  return { ...base, ...(settings?.universe === 'dc' ? UNIFIED_THEMES.neoDc : {}) };
};

const getTokens = (theme, settings = {}) => {
  const mode = settings?.darkMode === false || settings?.themeMode === 'light' ? 'light' : 'dark';
  return { ...theme[mode], mode, brand: theme.brand, icon: theme.icon, label: theme.label };
};

const applyPreviewScale = (canvas, settings) => {
  const previewScale = settings?.previewScale;
  if (!previewScale || previewScale >= 1) return 1;
  const ratio = Math.max(0.2, Math.min(1, previewScale));
  canvas.style.width = `${canvas.width}px`;
  canvas.style.height = `${canvas.height}px`;
  canvas.width = Math.round(canvas.width * ratio);
  canvas.height = Math.round(canvas.height * ratio);
  canvas.getContext('2d').scale(ratio, ratio);
  return ratio;
};

const drawBackdrop = (ctx, canvas, t, bgImg) => {
  fillGradientBackground(ctx, canvas, [[0, t.bg[0]], [0.5, t.bg[1]], [1, t.bg[2]]]);
  const orbs = [[0.15, 0.13, 0.52, t.accent], [0.88, 0.23, 0.44, t.accentAlt], [0.52, 0.98, 0.58, t.highlight]];
  orbs.forEach(([px, py, pr, color]) => {
    const x = canvas.width * px, y = canvas.height * py, r = canvas.width * pr;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, withAlpha(color, t.mode === 'dark' ? 0.24 : 0.18)); g.addColorStop(1, withAlpha(color, 0));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  });
  for (let x = 0; x < canvas.width; x += GRID * 10) {
    ctx.strokeStyle = withAlpha(t.accent, t.mode === 'dark' ? 0.08 : 0.05);
    ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
  }
  if (bgImg) {
    ctx.save(); ctx.globalAlpha = t.mode === 'dark' ? 0.18 : 0.12; ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height); ctx.restore();
  }
};

const drawShell = (ctx, canvas, t) => {
  drawRoundedPanel(ctx, { x: 32, y: 32, w: canvas.width - 64, h: canvas.height - 64, radius: 48, fill: t.surface, stroke: withAlpha(t.accent, 0.34), lineWidth: 3 });
  drawRoundedPanel(ctx, { x: 64, y: 64, w: canvas.width - 128, h: canvas.height - 128, radius: 36, fill: t.surfaceRaised, stroke: withAlpha(t.highlight, 0.26), lineWidth: 2 });
};

const drawHeader = (ctx, t, title, subtitle, fontFamily, scale = 1) => {
  drawRoundedPanel(ctx, { x: 96, y: 90, w: 888, h: 138, radius: 28, fill: withAlpha(t.accent, t.mode === 'dark' ? 0.16 : 0.11), stroke: withAlpha(t.accentAlt, 0.32) });
  ctx.fillStyle = t.muted; ctx.font = `800 ${Math.round(20 * scale)}px ${fontFamily}`; ctx.fillText(`${t.icon} ${t.brand}`, 126, 132);
  ctx.fillStyle = t.text; ctx.font = `900 ${Math.round(54 * scale)}px ${fontFamily}`; ctx.fillText(title, 126, 190, 840);
  if (subtitle) { ctx.fillStyle = t.muted; ctx.font = `700 ${Math.round(24 * scale)}px ${fontFamily}`; ctx.fillText(subtitle, 126, 222, 840); }
};

const drawWatermark = (ctx, canvas, t, fontFamily) => {
  ctx.fillStyle = withAlpha(t.text, 0.66); ctx.font = `700 20px ${fontFamily}`; ctx.fillText('MCU / DC Viewing Order • Modern Export', 86, canvas.height - 56);
};

export const renderCardToCanvas = async ({ type, data, settings = {} }) => {
  const canvas = document.createElement('canvas');
  const fontFamily = settings?.fontFamily || 'Inter, sans-serif';
  const scale = (settings?.textScale || 1) * (settings?.fontKey === 'marvel' ? 1.12 : 1);
  const t = getTokens(getTheme(settings), settings);

  if (type === 'review') {
    canvas.width = REVIEW_SIZE.width; canvas.height = REVIEW_SIZE.height; applyPreviewScale(canvas, settings); const ctx = canvas.getContext('2d');
    const item = data.item || {}; const img = await loadPosterWithFallback({ primarySrc: settings.posterSrc?.(item), fallbackText: item.title || 'Poster unavailable' });
    drawBackdrop(ctx, REVIEW_SIZE, t, img); drawShell(ctx, REVIEW_SIZE, t);
    drawHeader(ctx, t, 'CINEMATIC REVIEW DOSSIER', item.title || 'Untitled entry', fontFamily, scale);
    drawRoundedPanel(ctx, { x: 108, y: 280, w: 540, h: 810, radius: 34, fill: withAlpha(t.text, 0.08), stroke: withAlpha(t.highlight, 0.26) });
    if (img) ctx.drawImage(img, 126, 298, 504, 774);
    drawPremiumStars(ctx, { x: 706, y: 454, rating10: clampTenPoint(data.rating), active: t.highlight, fontFamily, size: 58, gap: 10 });
    ctx.fillStyle = t.text; ctx.font = `900 ${Math.round(74 * scale)}px ${fontFamily}`; ctx.fillText(`${clampTenPoint(data.rating).toFixed(1)}/10`, 706, 552);
    ['Phase', 'Year', 'Reviewer'].forEach((label, idx) => {
      const value = idx === 0 ? String(item.phase || 'Unknown') : idx === 1 ? String(item.year || 'Unknown') : (data.reviewer || 'Anonymous Fan');
      drawRoundedPanel(ctx, { x: 704 + idx * 0, y: 604 + idx * 112, w: 780, h: 92, radius: 24, fill: withAlpha(t.text, 0.07), stroke: withAlpha(t.accent, 0.2) });
      ctx.fillStyle = t.muted; ctx.font = `700 ${Math.round(20 * scale)}px ${fontFamily}`; ctx.fillText(label.toUpperCase(), 730, 640 + idx * 112);
      ctx.fillStyle = t.text; ctx.font = `850 ${Math.round(34 * scale)}px ${fontFamily}`; ctx.fillText(value, 730, 686 + idx * 112, 720);
    });
    drawRoundedPanel(ctx, { x: 108, y: 1148, w: 1384, h: 896, radius: 36, fill: withAlpha(t.text, 0.06), stroke: withAlpha(t.accentAlt, 0.24) });
    ctx.fillStyle = t.accent; ctx.font = `900 ${Math.round(34 * scale)}px ${fontFamily}`; ctx.fillText('MISSION NOTES', 156, 1230);
    ctx.fillStyle = t.text; ctx.font = `650 ${Math.round(56 * scale)}px ${fontFamily}`;
    drawWrappedText(ctx, data.reviewText || 'No review logged yet. Drop your take to complete this timeline entry.', 156, 1320, 1280, Math.round(58 * scale), 11);
    drawWatermark(ctx, REVIEW_SIZE, t, fontFamily);
  } else {
    canvas.width = CARD_SIZE.width; canvas.height = CARD_SIZE.height; applyPreviewScale(canvas, settings); const ctx = canvas.getContext('2d');
    const featured = data.featured || data.item;
    const bgImg = featured ? await loadPosterWithFallback({ primarySrc: settings.posterSrc?.(featured), fallbackText: featured?.title || 'Poster unavailable' }) : null;
    drawBackdrop(ctx, CARD_SIZE, t, bgImg); drawShell(ctx, CARD_SIZE, t);

    if (type === 'analysis') {
      drawHeader(ctx, t, 'COMMAND ANALYTICS', 'Progress intelligence snapshot', fontFamily, scale);
      ctx.fillStyle = t.text; ctx.font = `900 ${Math.round(162 * scale)}px ${fontFamily}`; ctx.fillText(`${Number(data.pct || 0)}%`, 98, 428);
      ctx.fillStyle = t.muted; ctx.font = `700 ${Math.round(30 * scale)}px ${fontFamily}`; ctx.fillText('Timeline completion', 106, 466);
      const rows = [
        ['Completed', `${data.totalWatched || 0}/${data.totalItems || 0}`],
        ['Watch Hours', `${Math.round(data.totalWatchedHours || 0)}h`],
        ['Current Streak', `${data.streak || 0} days`],
      ];
      rows.forEach((row, idx) => { drawRoundedPanel(ctx, { x: 100, y: 506 + idx * 116, w: 878, h: 92, radius: 24, fill: withAlpha(t.text, 0.06), stroke: withAlpha(t.accent, 0.22) }); ctx.fillStyle = t.muted; ctx.font = `700 ${Math.round(20 * scale)}px ${fontFamily}`; ctx.fillText(row[0].toUpperCase(), 126, 542 + idx * 116); ctx.fillStyle = t.text; ctx.font = `850 ${Math.round(38 * scale)}px ${fontFamily}`; ctx.fillText(row[1], 126, 586 + idx * 116); });
    } else if (type === 'unified') {
      drawHeader(ctx, t, 'UNIFIED EXPORT CARD', featured?.title || 'Timeline spotlight', fontFamily, scale);
      const rating = clampTenPoint((data.ratings || {})[featured?.id] || data.rating || 0);
      ctx.fillStyle = t.text; ctx.font = `900 ${Math.round(146 * scale)}px ${fontFamily}`; ctx.fillText(`${Number(data.pct || 0)}%`, 98, 410);
      drawRoundedPanel(ctx, { x: 98, y: 438, w: 884, h: 88, radius: 24, fill: withAlpha(t.text, 0.06), stroke: withAlpha(t.accentAlt, 0.24) });
      ctx.fillStyle = t.muted; ctx.font = `700 ${Math.round(20 * scale)}px ${fontFamily}`; ctx.fillText('FEATURE SCORE', 126, 472);
      ctx.fillStyle = t.highlight; ctx.font = `850 ${Math.round(46 * scale)}px ${fontFamily}`; ctx.fillText(`${rating.toFixed(1)}★`, 126, 516);
      const rows = (data.rows || []).slice(0, settings?.density === 'compact' ? 6 : 5);
      rows.forEach((row, idx) => { const y = 610 + idx * 120; drawRoundedPanel(ctx, { x: 98, y, w: 884, h: 94, radius: 24, fill: withAlpha(t.text, 0.06), stroke: withAlpha(t.accent, 0.2) }); ctx.fillStyle = t.text; ctx.font = `830 ${Math.round(30 * scale)}px ${fontFamily}`; ctx.fillText(`${idx + 1}. ${row.title}`, 126, y + 42, 650); ctx.fillStyle = t.muted; ctx.font = `700 ${Math.round(20 * scale)}px ${fontFamily}`; ctx.fillText(`${row.year || '—'} • Phase ${row.phase || '—'}`, 126, y + 74); });
    } else {
      drawHeader(ctx, t, 'QUICK EXPORT SNAPSHOT', 'Fast share. Clean signal.', fontFamily, scale);
      ctx.fillStyle = t.text; ctx.font = `900 ${Math.round(160 * scale)}px ${fontFamily}`; ctx.fillText(`${Number(data.pct || 0)}%`, 98, 430);
      ctx.fillStyle = t.muted; ctx.font = `700 ${Math.round(32 * scale)}px ${fontFamily}`;
      ctx.fillText(`Phase: ${data.currentPhase || 'Unknown'}`, 104, 500);
      ctx.fillText(`Completed: ${data.totalWatched || 0}/${data.totalItems || 0}`, 104, 548);
      ctx.fillText(`Status: Export Ready`, 104, 596);
    }
    drawWatermark(ctx, CARD_SIZE, t, fontFamily);
  }

  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png', settings?.previewScale ? 0.86 : 0.96));
  return { canvas, blob, filename: getFileName({ type, data, namingStrategy: settings.namingStrategy }) };
};
