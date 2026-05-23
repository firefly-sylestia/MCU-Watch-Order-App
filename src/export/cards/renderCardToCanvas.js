import { drawPremiumStars, drawRoundedPanel, drawWrappedText, fillGradientBackground, loadPosterWithFallback, clampTenPoint } from './helpers';

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

const THEME_PRESETS = {
  sacredTimeline: { label: 'Sacred Timeline', titleLabel: 'SACRED TIMELINE', stamp: 'Canon Progress Log', accentIcon: '⌛', backgroundMotif: 'timeline', bg: ['#071018', '#10243d', '#182b54'], accent: '#7dd3fc', accent2: '#34d399', gold: '#facc15' },
  timelinePortal: { label: 'Timeline Portal', titleLabel: 'TIMELINE PORTAL', stamp: 'Portal Watch Route', accentIcon: '◎', backgroundMotif: 'portal', bg: ['#07111f', '#102b4c', '#32164f'], accent: '#38bdf8', accent2: '#c084fc', gold: '#fde68a' },
  watchParty: { label: 'Watch Party', titleLabel: 'WATCH PARTY', stamp: 'Fan Night Recap', accentIcon: '★', backgroundMotif: 'halftone', bg: ['#150712', '#351225', '#5a2a11'], accent: '#fb7185', accent2: '#f59e0b', gold: '#fde68a' },
  multiverseGlitch: { label: 'Multiverse Glitch', titleLabel: 'MULTIVERSE GLITCH', stamp: 'Variant Signal', accentIcon: '◆', backgroundMotif: 'shards', bg: ['#080815', '#161044', '#073044'], accent: '#a78bfa', accent2: '#22d3ee', gold: '#e9d5ff' },
  heroDossier: { label: 'Hero Dossier', titleLabel: 'HERO DOSSIER', stamp: 'Mission File', accentIcon: '▣', backgroundMotif: 'grid', bg: ['#090d14', '#151d2b', '#302111'], accent: '#fbbf24', accent2: '#60a5fa', gold: '#fde68a' },
};

const THEMES = { ...THEME_PRESETS, midnight: THEME_PRESETS.sacredTimeline, stark: THEME_PRESETS.watchParty, vibranium: THEME_PRESETS.multiverseGlitch };

const getTheme = (settings) => THEMES[settings?.theme] || THEME_PRESETS.sacredTimeline;

const getPalette = (theme, colorMode = 'dark') => {
  const dark = colorMode !== 'light';
  return {
    dark,
    canvas: dark ? ['#040914', '#0a1730', '#0b2141'] : ['#f4f8ff', '#e6f0ff', '#eaf5f6'],
    shell: dark ? 'rgba(7,14,30,0.84)' : 'rgba(255,255,255,0.84)',
    shellStroke: dark ? withAlpha(theme.accent, 0.42) : withAlpha(theme.accent, 0.32),
    panel: dark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.64)',
    panelSoft: dark ? 'rgba(255,255,255,0.055)' : 'rgba(255,255,255,0.46)',
    text: dark ? '#f8fbff' : '#0f172a',
    textSoft: dark ? 'rgba(221,234,255,0.78)' : 'rgba(30,41,59,0.72)',
    chipFill: dark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.72)',
    chipStroke: dark ? 'rgba(255,255,255,0.22)' : 'rgba(15,23,42,0.14)',
    rail: dark ? 'rgba(255,255,255,0.16)' : 'rgba(30,41,59,0.16)',
  };
};

const fitTitleText = (ctx, { text, x, y, maxWidth, preferredSize, minSize, fontFamily, weight = 800, lineHeightFactor = 1.12, maxLines = 2, color = '#fff' }) => {
  let size = preferredSize;
  while (size > minSize) {
    ctx.font = `${weight} ${Math.round(size)}px ${fontFamily}`;
    if (ctx.measureText(text).width <= maxWidth) break;
    size -= 2;
  }
  ctx.fillStyle = color;
  ctx.font = `${weight} ${Math.round(size)}px ${fontFamily}`;
  if (ctx.measureText(text).width <= maxWidth) {
    ctx.fillText(text, x, y);
    return Math.round(size * lineHeightFactor);
  }
  drawWrappedText(ctx, text, x, y, maxWidth, Math.round(size * lineHeightFactor), maxLines);
  return Math.round(size * lineHeightFactor);
};

const drawCoverImage = (ctx, img, x, y, w, h) => {
  if (!img) return;
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  const scale = Math.max(w / iw, h / ih);
  const sw = w / scale;
  const sh = h / scale;
  ctx.drawImage(img, (iw - sw) / 2, (ih - sh) / 2, sw, sh, x, y, w, h);
};

const drawBadge = (ctx, { x, y, label, value, color, fontFamily, scale = 1, w = 220, palette }) => {
  drawRoundedPanel(ctx, { x, y, w, h: 86, radius: 26, fill: palette.chipFill, stroke: palette.chipStroke });
  ctx.fillStyle = palette.textSoft;
  ctx.font = `700 ${Math.round(18 * scale)}px ${fontFamily}`;
  ctx.fillText(label.toUpperCase(), x + 24, y + 30);
  ctx.fillStyle = color;
  ctx.font = `850 ${Math.round(34 * scale)}px ${fontFamily}`;
  ctx.fillText(value, x + 24, y + 66, w - 48);
};

const drawProgressBar = (ctx, { x, y, w, h, pct, accent, accent2, palette }) => {
  drawRoundedPanel(ctx, { x, y, w, h, radius: h / 2, fill: palette.rail });
  const fillW = Math.max(h, Math.min(w, w * (Number(pct || 0) / 100)));
  const g = ctx.createLinearGradient(x, y, x + w, y);
  g.addColorStop(0, accent);
  g.addColorStop(1, accent2);
  drawRoundedPanel(ctx, { x, y, w: fillW, h, radius: h / 2, fill: g });
};

const drawCardBackdrop = (ctx, canvas, theme, palette, bgImg, bgOpacity = 46) => {
  fillGradientBackground(ctx, canvas, [[0, palette.canvas[0]], [0.5, palette.canvas[1]], [1, palette.canvas[2]]]);
  if (bgImg) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(0.76, bgOpacity / 100));
    drawCoverImage(ctx, bgImg, 0, 0, canvas.width, canvas.height);
    ctx.restore();
  }
  const overlay = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  overlay.addColorStop(0, withAlpha(theme.accent, palette.dark ? 0.18 : 0.1));
  overlay.addColorStop(1, withAlpha(theme.accent2, palette.dark ? 0.16 : 0.08));
  ctx.fillStyle = overlay;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

const drawWatermark = (ctx, canvas, fontFamily, theme, palette) => {
  ctx.fillStyle = palette.textSoft;
  ctx.font = `800 22px ${fontFamily}`;
  ctx.fillText('MCU Viewing Order', 74, canvas.height - 64);
  ctx.fillStyle = withAlpha(theme.accent, 0.88);
  ctx.beginPath();
  ctx.arc(canvas.width - 76, canvas.height - 72, 16, 0, Math.PI * 2);
  ctx.fill();
};

export const renderCardToCanvas = async ({ type, data, settings = {} }) => {
  const canvas = document.createElement('canvas');
  const fontFamily = settings?.fontFamily || 'Inter, sans-serif';
  const theme = getTheme(settings);
  const palette = getPalette(theme, settings?.colorMode || 'dark');
  const bgOpacity = Number.isFinite(settings?.bgOpacity) ? settings.bgOpacity : 46;
  const scale = (settings?.textScale || 1) * (settings?.fontKey === 'marvel' ? 1.18 : 1);

  if (type === 'review') {
    canvas.width = 1600; canvas.height = 2200;
    const ctx = canvas.getContext('2d');
    const item = data.item;
    const img = await loadPosterWithFallback({ primarySrc: settings.posterSrc(item), fallbackText: item.title });
    drawCardBackdrop(ctx, { width: 1600, height: 2200 }, theme, palette, img, Math.max(bgOpacity, 60));
    drawRoundedPanel(ctx, { x: 54, y: 60, w: 1492, h: 2080, radius: 72, fill: palette.shell, stroke: palette.shellStroke, lineWidth: 4 });

    const posterX = 126;
    drawRoundedPanel(ctx, { x: posterX - 12, y: 158, w: 556, h: 822, radius: 40, fill: palette.panel, stroke: withAlpha(theme.gold, 0.4), lineWidth: 3 });
    ctx.save(); ctx.beginPath(); ctx.roundRect(posterX, 170, 532, 798, 30); ctx.clip(); drawCoverImage(ctx, img, posterX, 170, 532, 798); ctx.restore();

    ctx.fillStyle = withAlpha(theme.accent, 0.96); ctx.font = `900 ${Math.round(30 * scale)}px ${fontFamily}`; ctx.fillText('PREMIUM REVIEW', 722, 212);
    fitTitleText(ctx, { text: item.title, x: 722, y: 300, maxWidth: 780, preferredSize: 84 * scale, minSize: 44 * scale, fontFamily, maxLines: 3, color: palette.text });
    drawPremiumStars(ctx, { x: 722, y: 392, size: Math.round(62 * scale), rating10: clampTenPoint(data.rating), active: theme.gold, fontFamily });
    ctx.fillStyle = palette.text; ctx.font = `900 ${Math.round(58 * scale)}px ${fontFamily}`; ctx.fillText(`${clampTenPoint(data.rating).toFixed(1)}/10`, 722, 492);
    drawBadge(ctx, { x: 722, y: 550, label: 'Phase', value: String(item.phase || '—'), color: theme.accent, fontFamily, scale, w: 160, palette });
    drawBadge(ctx, { x: 910, y: 550, label: 'Year', value: String(item.year || '—'), color: theme.accent2, fontFamily, scale, w: 190, palette });
    drawBadge(ctx, { x: 1130, y: 550, label: 'Fan', value: data.reviewer || 'Reviewer', color: theme.gold, fontFamily, scale, w: 320, palette });

    drawRoundedPanel(ctx, { x: 126, y: 1020, w: 1348, h: 910, radius: 42, fill: palette.panel, stroke: withAlpha(theme.accent2, 0.32) });
    ctx.fillStyle = withAlpha(theme.accent, 0.94); ctx.font = `900 ${Math.round(34 * scale)}px ${fontFamily}`; ctx.fillText('CINEMATIC NOTES', 172, 1104);
    ctx.fillStyle = palette.text; ctx.font = `650 ${Math.round(62 * scale)}px ${fontFamily}`;
    drawWrappedText(ctx, data.reviewText || 'No review yet — your next watch is waiting.', 172, 1184, 1258, Math.round(56 * scale), 11);
    drawWatermark(ctx, { width: 1600, height: 2200 }, fontFamily, theme, palette);
  } else if (type === 'analysis' || type === 'unified') {
    canvas.width = 1080; canvas.height = 1350;
    const ctx = canvas.getContext('2d');
    const featured = data.featured;
    const bgImg = type === 'unified' && featured ? await loadPosterWithFallback({ primarySrc: settings.posterSrc(featured), fallbackText: featured.title }) : null;
    drawCardBackdrop(ctx, { width: 1080, height: 1350 }, theme, palette, bgImg, bgOpacity);
    drawRoundedPanel(ctx, { x: 30, y: 30, w: 1020, h: 1290, radius: 58, fill: palette.shell, stroke: palette.shellStroke, lineWidth: 4 });

    ctx.fillStyle = withAlpha(theme.accent, 0.95); ctx.font = `900 ${Math.round(26 * scale)}px ${fontFamily}`;
    ctx.fillText(type === 'analysis' ? 'ANALYTICS EXPORT' : `${theme.titleLabel || 'WATCH'} RECAP`, 92, 122);
    fitTitleText(ctx, { text: type === 'analysis' ? 'Your modern watch blueprint' : (featured?.title || 'Sacred Timeline'), x: 92, y: 210, maxWidth: 880, preferredSize: 62 * scale, minSize: 34 * scale, fontFamily, maxLines: 2, color: palette.text });

    const pct = Number(data.pct || 0);
    ctx.fillStyle = palette.text; ctx.font = `950 ${Math.round(170 * scale)}px ${fontFamily}`; ctx.fillText(`${pct}%`, 92, 410);
    drawProgressBar(ctx, { x: 98, y: 436, w: 884, h: 30, pct, accent: theme.accent, accent2: theme.accent2, palette });

    drawBadge(ctx, { x: 96, y: 498, label: 'Completed', value: `${data.totalWatched || 0}/${data.totalItems || 0}`, color: theme.accent, fontFamily, scale, w: 260, palette });
    drawBadge(ctx, { x: 384, y: 498, label: type === 'analysis' ? 'Hours' : 'Phase', value: type === 'analysis' ? `${Math.round(data.totalWatchedHours || 0)}h` : (data.currentPhase || '—'), color: theme.gold, fontFamily, scale, w: 220, palette });
    drawBadge(ctx, { x: 632, y: 498, label: type === 'analysis' ? 'Streak' : 'Feature', value: type === 'analysis' ? `${data.streak || 0} days` : `${clampTenPoint(data.rating || 0).toFixed(1)}★`, color: theme.accent2, fontFamily, scale, w: 320, palette });

    ctx.fillStyle = palette.text; ctx.font = `900 ${Math.round(34 * scale)}px ${fontFamily}`; ctx.fillText(type === 'analysis' ? `Current mission: ${data.currentPhase || '—'}` : 'Recent timeline wins', 100, 666);
    const rows = type === 'analysis' ? (Array.isArray(data.phaseStats) ? data.phaseStats : []) : (data.rows || []).slice(0, settings?.density === 'compact' ? 6 : 5);
    rows.forEach((row, idx) => {
      const y = 738 + idx * (type === 'analysis' ? 56 : 92);
      if (type === 'analysis') {
        const rowPct = row.total ? (row.watched / row.total) * 100 : 0;
        ctx.fillStyle = palette.text; ctx.font = `800 ${Math.round(28 * scale)}px ${fontFamily}`; ctx.fillText(`Phase ${row.phase}`, 112, y);
        drawProgressBar(ctx, { x: 300, y: y - 22, w: 520, h: 18, pct: rowPct, accent: theme.accent, accent2: theme.accent2, palette });
        ctx.fillStyle = palette.textSoft; ctx.font = `800 ${Math.round(26 * scale)}px ${fontFamily}`; ctx.fillText(`${row.watched}/${row.total}`, 854, y);
      } else {
        drawRoundedPanel(ctx, { x: 104, y: y - 50, w: 872, h: 72, radius: 24, fill: idx % 2 ? palette.panelSoft : palette.panel, stroke: palette.chipStroke });
        fitTitleText(ctx, { text: row.title, x: 132, y: y - 10, maxWidth: 570, preferredSize: 30 * scale, minSize: 20 * scale, fontFamily, maxLines: 1, color: palette.text, weight: 850 });
        ctx.fillStyle = palette.textSoft; ctx.font = `700 ${Math.round(21 * scale)}px ${fontFamily}`; ctx.fillText(`${row.year || '—'} • Phase ${row.phase || '—'}`, 132, y + 16);
        ctx.fillStyle = theme.gold; ctx.font = `900 ${Math.round(30 * scale)}px ${fontFamily}`; ctx.fillText(`${clampTenPoint(data.ratings?.[row.id] || row.rating || 0).toFixed(1)}★`, 826, y - 2);
      }
    });
    drawWatermark(ctx, { width: 1080, height: 1350 }, fontFamily, theme, palette);
  }

  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png', 0.96));
  return { canvas, blob, filename: getFileName({ type, data, namingStrategy: settings.namingStrategy }) };
};
