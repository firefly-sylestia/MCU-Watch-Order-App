import {
  clampTenPoint,
  drawRoundedPanel,
  drawWrappedText,
  fillGradientBackground,
  loadPosterWithFallback,
} from './helpers';

const getFileName = ({ type, data, namingStrategy }) => {
  if (namingStrategy) return namingStrategy({ type, data });
  const title = data?.slugifyPosterName ? data.slugifyPosterName(data.item?.title || data.title || type) : type;
  return `${title}-${type}-card.png`;
};

const hexToRgba = (hex, alpha = 1) => {
  const clean = String(hex || '').replace('#', '');
  if (clean.length !== 6) return `rgba(255,255,255,${alpha})`;
  const value = parseInt(clean, 16);
  return `rgba(${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}, ${alpha})`;
};

const brandPacks = {
  marvel: { accent: '#e50914', accentSoft: '#f97316', highlight: '#fee2e2', glow: '#fb7185' },
  dc: { accent: '#3b82f6', accentSoft: '#22d3ee', highlight: '#dbeafe', glow: '#93c5fd' },
};

const createTheme = (settings = {}) => {
  const mode = settings.mode === 'light' ? 'light' : 'dark';
  const brandKey = settings.brand === 'dc' ? 'dc' : 'marvel';
  const brand = brandPacks[brandKey];
  const light = {
    mode,
    brandKey,
    ...brand,
    bgStops: ['#f8fafc', '#eef2ff', '#f1f5f9'],
    panel: 'rgba(255,255,255,0.9)',
    panelMuted: 'rgba(255,255,255,0.72)',
    stroke: 'rgba(15,23,42,0.16)',
    textPrimary: '#0f172a',
    textSecondary: '#334155',
    textMuted: '#475569',
  };
  const dark = {
    mode,
    brandKey,
    ...brand,
    bgStops: ['#030712', '#111827', '#1e293b'],
    panel: 'rgba(2,6,23,0.82)',
    panelMuted: 'rgba(15,23,42,0.7)',
    stroke: 'rgba(148,163,184,0.24)',
    textPrimary: '#f8fafc',
    textSecondary: '#e2e8f0',
    textMuted: '#cbd5e1',
  };
  return mode === 'light' ? light : dark;
};

const drawBackground = (ctx, canvas, theme) => {
  fillGradientBackground(ctx, canvas, [[0, theme.bgStops[0]], [0.5, theme.bgStops[1]], [1, theme.bgStops[2]]]);
  const g1 = ctx.createRadialGradient(canvas.width * 0.16, canvas.height * 0.14, 0, canvas.width * 0.16, canvas.height * 0.14, canvas.width * 0.5);
  g1.addColorStop(0, hexToRgba(theme.accent, theme.mode === 'light' ? 0.2 : 0.3));
  g1.addColorStop(1, hexToRgba(theme.accent, 0));
  ctx.fillStyle = g1;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const g2 = ctx.createRadialGradient(canvas.width * 0.92, canvas.height * 0.18, 0, canvas.width * 0.92, canvas.height * 0.18, canvas.width * 0.45);
  g2.addColorStop(0, hexToRgba(theme.accentSoft, theme.mode === 'light' ? 0.14 : 0.26));
  g2.addColorStop(1, hexToRgba(theme.accentSoft, 0));
  ctx.fillStyle = g2;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

const drawShell = (ctx, { x, y, w, h, theme }) => {
  drawRoundedPanel(ctx, { x, y, w, h, radius: 48, fill: theme.panel, stroke: theme.stroke, lineWidth: 3 });
  drawRoundedPanel(ctx, { x: x + 20, y: y + 20, w: w - 40, h: h - 40, radius: 36, fill: theme.panelMuted, stroke: hexToRgba(theme.accent, 0.2), lineWidth: 2 });
};

const drawHeaderRail = (ctx, { x, y, w, label, subtitle, theme, fontFamily }) => {
  drawRoundedPanel(ctx, { x, y, w, h: 78, radius: 24, fill: hexToRgba(theme.accent, 0.14), stroke: hexToRgba(theme.accent, 0.38), lineWidth: 2 });
  ctx.fillStyle = theme.textPrimary;
  ctx.font = `900 28px ${fontFamily}`;
  ctx.fillText(label, x + 24, y + 35);
  ctx.fillStyle = theme.textMuted;
  ctx.font = `700 20px ${fontFamily}`;
  ctx.fillText(subtitle, x + 24, y + 62);
};

const drawStatChip = (ctx, { x, y, label, value, theme, fontFamily, width = 220 }) => {
  drawRoundedPanel(ctx, { x, y, w: width, h: 86, radius: 20, fill: hexToRgba(theme.accent, 0.1), stroke: hexToRgba(theme.accent, 0.3) });
  ctx.fillStyle = theme.textMuted;
  ctx.font = `700 18px ${fontFamily}`;
  ctx.fillText(label.toUpperCase(), x + 16, y + 28);
  ctx.fillStyle = theme.textPrimary;
  ctx.font = `900 32px ${fontFamily}`;
  ctx.fillText(value, x + 16, y + 66, width - 24);
};

const drawPoster = (ctx, img, x, y, w, h) => {
  if (!img) return;
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  const scale = Math.max(w / iw, h / ih);
  const sw = w / scale;
  const sh = h / scale;
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 22);
  ctx.clip();
  ctx.drawImage(img, (iw - sw) / 2, (ih - sh) / 2, sw, sh, x, y, w, h);
  ctx.restore();
};

const renderReviewCard = async ({ canvas, data, settings, theme, fontFamily }) => {
  const ctx = canvas.getContext('2d');
  const item = data.item;
  const img = await loadPosterWithFallback({ primarySrc: settings.posterSrc(item), fallbackText: item.title });
  drawBackground(ctx, canvas, theme);
  drawShell(ctx, { x: 52, y: 52, w: 1496, h: 2096, theme });
  drawHeaderRail(ctx, { x: 108, y: 112, w: 1384, label: 'REVIEW DOSSIER', subtitle: 'High-impact recap with cinematic notes', theme, fontFamily });
  drawPoster(ctx, img, 120, 220, 500, 760);
  ctx.fillStyle = theme.textPrimary;
  ctx.font = `900 76px ${fontFamily}`;
  drawWrappedText(ctx, item.title, 660, 318, 800, 84, 3);
  drawStatChip(ctx, { x: 660, y: 550, label: 'Score', value: `${clampTenPoint(data.rating).toFixed(1)} / 10`, theme, fontFamily, width: 360 });
  drawStatChip(ctx, { x: 1040, y: 550, label: 'Year', value: `${item.year || '—'}`, theme, fontFamily, width: 210 });
  drawStatChip(ctx, { x: 1270, y: 550, label: 'Phase', value: `${item.phase || '—'}`, theme, fontFamily, width: 210 });
  drawRoundedPanel(ctx, { x: 108, y: 1030, w: 1384, h: 1020, radius: 34, fill: hexToRgba(theme.accentSoft, 0.09), stroke: theme.stroke });
  ctx.fillStyle = theme.textSecondary;
  ctx.font = `900 34px ${fontFamily}`;
  ctx.fillText('PROS & HIGHLIGHTS', 142, 1090);
  ctx.fillStyle = theme.textPrimary;
  ctx.font = `600 48px ${fontFamily}`;
  drawWrappedText(ctx, data.reviewText || 'No review logged yet. Drop your take and export again.', 142, 1170, 1310, 58, 12);
};

const renderAnalyticsCard = ({ canvas, data, settings, theme, fontFamily }) => {
  const ctx = canvas.getContext('2d');
  drawBackground(ctx, canvas, theme);
  drawShell(ctx, { x: 28, y: 28, w: 1024, h: 1294, theme });
  drawHeaderRail(ctx, { x: 72, y: 82, w: 936, label: 'ADVANCED EXPORT', subtitle: 'Progress intelligence and phase momentum', theme, fontFamily });
  ctx.fillStyle = theme.textPrimary;
  ctx.font = `900 152px ${fontFamily}`;
  ctx.fillText(`${Number(data.pct || 0)}%`, 78, 330);
  drawStatChip(ctx, { x: 78, y: 370, label: 'Completed', value: `${data.totalWatched || 0}/${data.totalItems || 0}`, theme, fontFamily, width: 290 });
  drawStatChip(ctx, { x: 388, y: 370, label: 'Hours', value: `${Math.round(data.totalWatchedHours || 0)}h`, theme, fontFamily, width: 220 });
  drawStatChip(ctx, { x: 628, y: 370, label: 'Streak', value: `${data.streak || 0} days`, theme, fontFamily, width: 300 });
  ctx.fillStyle = theme.textSecondary;
  ctx.font = `800 30px ${fontFamily}`;
  ctx.fillText(`Mission phase: ${data.currentPhase || '—'}`, 82, 512);

  const rows = Array.isArray(data.phaseStats) ? data.phaseStats.slice(0, 8) : [];
  rows.forEach((row, i) => {
    const y = 582 + i * 82;
    drawRoundedPanel(ctx, { x: 78, y: y - 44, w: 930, h: 62, radius: 20, fill: i % 2 ? hexToRgba(theme.accent, 0.08) : hexToRgba(theme.accentSoft, 0.08), stroke: hexToRgba(theme.accent, 0.18) });
    ctx.fillStyle = theme.textPrimary;
    ctx.font = `800 28px ${fontFamily}`;
    ctx.fillText(`Phase ${row.phase}`, 96, y - 4);
    ctx.fillStyle = theme.textMuted;
    ctx.font = `700 24px ${fontFamily}`;
    ctx.fillText(`${row.watched}/${row.total} watched`, 796, y - 4);
  });
};

export const renderCardToCanvas = async ({ type, data, settings = {} }) => {
  const canvas = document.createElement('canvas');
  const fontFamily = settings?.fontFamily || 'Inter, sans-serif';
  const theme = createTheme(settings);

  if (type === 'review') {
    canvas.width = 1600; canvas.height = 2200;
    await renderReviewCard({ canvas, data, settings, theme, fontFamily });
  } else if (type === 'analysis') {
    canvas.width = 1080; canvas.height = 1350;
    renderAnalyticsCard({ canvas, data, settings, theme, fontFamily });
  } else {
    canvas.width = 1080; canvas.height = 1350;
    renderAnalyticsCard({ canvas, data, settings, theme, fontFamily });
  }

  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png', 0.96));
  return { canvas, blob, filename: getFileName({ type, data, namingStrategy: settings.namingStrategy }) };
};
