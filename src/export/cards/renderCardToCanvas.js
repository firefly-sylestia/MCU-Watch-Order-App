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
  sacredTimeline: { label: 'Sacred Timeline', titleLabel: 'SACRED TIMELINE', stamp: 'Canon Progress Log', accentIcon: '⌛', backgroundMotif: 'timeline', bg: ['#071018', '#10243d', '#182b54'], accent: '#7dd3fc', accent2: '#34d399', gold: '#facc15', panel: 'rgba(7,16,31,0.78)' },
  timelinePortal: { label: 'Timeline Portal', titleLabel: 'TIMELINE PORTAL', stamp: 'Portal Watch Route', accentIcon: '◎', backgroundMotif: 'portal', bg: ['#07111f', '#102b4c', '#32164f'], accent: '#38bdf8', accent2: '#c084fc', gold: '#fde68a', panel: 'rgba(8,15,34,0.78)' },
  watchParty: { label: 'Watch Party', titleLabel: 'WATCH PARTY', stamp: 'Fan Night Recap', accentIcon: '★', backgroundMotif: 'halftone', bg: ['#150712', '#351225', '#5a2a11'], accent: '#fb7185', accent2: '#f59e0b', gold: '#fde68a', panel: 'rgba(28,10,20,0.78)' },
  multiverseGlitch: { label: 'Multiverse Glitch', titleLabel: 'MULTIVERSE GLITCH', stamp: 'Variant Signal', accentIcon: '◆', backgroundMotif: 'shards', bg: ['#080815', '#161044', '#073044'], accent: '#a78bfa', accent2: '#22d3ee', gold: '#e9d5ff', panel: 'rgba(13,10,34,0.78)' },
  heroDossier: { label: 'Hero Dossier', titleLabel: 'HERO DOSSIER', stamp: 'Mission File', accentIcon: '▣', backgroundMotif: 'grid', bg: ['#090d14', '#151d2b', '#302111'], accent: '#fbbf24', accent2: '#60a5fa', gold: '#fde68a', panel: 'rgba(14,18,27,0.8)' },
};

const THEMES = {
  ...THEME_PRESETS,
  midnight: THEME_PRESETS.sacredTimeline,
  stark: THEME_PRESETS.watchParty,
  vibranium: THEME_PRESETS.multiverseGlitch,
};

const getTheme = (settings) => THEMES[settings?.theme] || THEME_PRESETS.sacredTimeline;
const isLightMode = (settings) => settings?.colorMode === 'light';

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

const drawGlowOrb = (ctx, x, y, r, color) => {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, withAlpha(color, 0.68));
  g.addColorStop(0.42, withAlpha(color, 0.2));
  g.addColorStop(1, withAlpha(color, 0));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
};

const drawThemeMotif = (ctx, canvas, theme) => {
  ctx.save();
  ctx.strokeStyle = withAlpha(theme.accent, 0.16);
  ctx.fillStyle = withAlpha(theme.accent2, 0.12);
  ctx.lineWidth = Math.max(2, canvas.width * 0.003);
  if (theme.backgroundMotif === 'portal') {
    for (let i = 0; i < 5; i += 1) {
      ctx.beginPath();
      ctx.ellipse(canvas.width * 0.82, canvas.height * 0.2, 120 + i * 46, 74 + i * 28, -0.35, 0, Math.PI * 2);
      ctx.stroke();
    }
  } else if (theme.backgroundMotif === 'halftone') {
    for (let y = 120; y < canvas.height * 0.52; y += 42) {
      for (let x = canvas.width * 0.62; x < canvas.width - 40; x += 42) {
        ctx.globalAlpha = 0.18 + ((x + y) % 84) / 600;
        ctx.beginPath();
        ctx.arc(x, y, 5 + ((x + y) % 18), 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else if (theme.backgroundMotif === 'shards') {
    for (let i = 0; i < 10; i += 1) {
      const x = canvas.width * (0.08 + i * 0.095);
      const y = canvas.height * (0.14 + (i % 4) * 0.08);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 48, y + 22);
      ctx.lineTo(x + 18, y + 92);
      ctx.closePath();
      ctx.stroke();
    }
  } else if (theme.backgroundMotif === 'grid') {
    for (let x = 80; x < canvas.width; x += 80) {
      ctx.beginPath(); ctx.moveTo(x, 90); ctx.lineTo(x, canvas.height - 90); ctx.stroke();
    }
    for (let y = 90; y < canvas.height; y += 80) {
      ctx.beginPath(); ctx.moveTo(80, y); ctx.lineTo(canvas.width - 80, y); ctx.stroke();
    }
  } else {
    for (let i = 0; i < 4; i += 1) {
      ctx.beginPath();
      ctx.arc(canvas.width * 0.18, canvas.height * 0.82, 180 + i * 58, -0.9, 0.35);
      ctx.stroke();
    }
  }
  ctx.restore();
};

const drawThemeStamp = (ctx, { x, y, theme, fontFamily, scale = 1 }) => {
  const label = `${theme.accentIcon || '★'} ${theme.stamp || theme.label || 'MCU Viewing Order'}`;
  ctx.save();
  ctx.font = `900 ${Math.round(18 * scale)}px ${fontFamily}`;
  const w = Math.min(520, Math.max(220, ctx.measureText(label).width + 44));
  drawRoundedPanel(ctx, { x, y, w, h: 42, radius: 21, fill: withAlpha(theme.accent, 0.14), stroke: withAlpha(theme.accent, 0.34) });
  ctx.fillStyle = 'rgba(245,250,255,0.82)';
  ctx.fillText(label.toUpperCase(), x + 22, y + 27);
  ctx.restore();
};

const drawCardBackdrop = (ctx, canvas, theme, bgImg, bgOpacity = 46) => {
  fillGradientBackground(ctx, canvas, [[0, theme.bg[0]], [0.55, theme.bg[1]], [1, theme.bg[2]]]);
  drawGlowOrb(ctx, canvas.width * 0.18, canvas.height * 0.12, canvas.width * 0.52, theme.accent);
  drawGlowOrb(ctx, canvas.width * 0.9, canvas.height * 0.25, canvas.width * 0.46, theme.accent2);
  drawGlowOrb(ctx, canvas.width * 0.45, canvas.height * 1.02, canvas.width * 0.64, theme.gold);
  drawThemeMotif(ctx, canvas, theme);
  if (bgImg) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(0.82, bgOpacity / 100));
    drawCoverImage(ctx, bgImg, 0, 0, canvas.width, canvas.height);
    ctx.restore();
    const veil = ctx.createLinearGradient(0, 0, 0, canvas.height);
    veil.addColorStop(0, 'rgba(3,6,15,0.36)');
    veil.addColorStop(0.46, 'rgba(3,6,15,0.66)');
    veil.addColorStop(1, 'rgba(3,6,15,0.9)');
    ctx.fillStyle = veil;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
};

const drawBadge = (ctx, { x, y, label, value, color, fontFamily, scale = 1, w = 220 }) => {
  drawRoundedPanel(ctx, { x, y, w, h: 86, radius: 26, fill: 'rgba(255,255,255,0.095)', stroke: 'rgba(255,255,255,0.2)' });
  ctx.fillStyle = 'rgba(222,235,255,0.72)';
  ctx.font = `700 ${Math.round(18 * scale)}px ${fontFamily}`;
  ctx.fillText(label.toUpperCase(), x + 24, y + 30);
  ctx.fillStyle = color;
  ctx.font = `850 ${Math.round(34 * scale)}px ${fontFamily}`;
  ctx.fillText(value, x + 24, y + 66, w - 48);
};

const drawProgressBar = (ctx, { x, y, w, h, pct, accent, accent2 }) => {
  drawRoundedPanel(ctx, { x, y, w, h, radius: h / 2, fill: 'rgba(255,255,255,0.12)' });
  const fillW = Math.max(h, Math.min(w, w * (Number(pct || 0) / 100)));
  const g = ctx.createLinearGradient(x, y, x + w, y);
  g.addColorStop(0, accent);
  g.addColorStop(1, accent2);
  drawRoundedPanel(ctx, { x, y, w: fillW, h, radius: h / 2, fill: g });
};

const drawWatermark = (ctx, canvas, fontFamily, theme) => {
  ctx.save();
  ctx.fillStyle = 'rgba(255,255,255,0.46)';
  ctx.font = `800 22px ${fontFamily}`;
  ctx.fillText('MCU Viewing Order', 74, canvas.height - 64);
  ctx.fillStyle = withAlpha(theme.accent, 0.8);
  ctx.beginPath();
  ctx.arc(canvas.width - 76, canvas.height - 72, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
};

const applyPreviewScale = (canvas, settings) => {
  const previewScale = settings?.previewScale;
  if (!previewScale || previewScale >= 1) return 1;
  const ratio = Math.max(0.2, Math.min(1, previewScale));
  canvas.style.width = `${canvas.width}px`;
  canvas.style.height = `${canvas.height}px`;
  canvas.width = Math.round(canvas.width * ratio);
  canvas.height = Math.round(canvas.height * ratio);
  const ctx = canvas.getContext('2d');
  ctx.scale(ratio, ratio);
  return ratio;
};

export const renderCardToCanvas = async ({ type, data, settings = {} }) => {
  const canvas = document.createElement('canvas');
  const fontFamily = settings?.fontFamily || 'Inter, sans-serif';
  const theme = getTheme(settings);
  const bgOpacity = Number.isFinite(settings?.bgOpacity) ? settings.bgOpacity : 46;
  const fontScale = settings?.fontKey === 'marvel' ? 1.18 : 1;

  if (type === 'review') {
    canvas.width = 1600; canvas.height = 2200;
    applyPreviewScale(canvas, settings);
    const ctx = canvas.getContext('2d');
    const scale = (settings?.textScale || 1) * fontScale;
    const item = data.item;
    const img = await loadPosterWithFallback({ primarySrc: settings.posterSrc(item), fallbackText: item.title });
    const light = isLightMode(settings);
    drawCardBackdrop(ctx, { width: 1600, height: 2200 }, theme, img, Math.max(bgOpacity, 56));
    drawRoundedPanel(ctx, { x: 50, y: 54, w: 1500, h: 2090, radius: 70, fill: light ? 'rgba(248,252,255,0.9)' : 'rgba(8,12,22,0.84)', stroke: withAlpha(theme.accent, 0.45), lineWidth: 4 });

    const posterX = 110, posterY = 120, posterW = 560, posterH = 840;
    ctx.save(); ctx.beginPath(); ctx.roundRect(posterX, posterY, posterW, posterH, 34); ctx.clip(); drawCoverImage(ctx, img, posterX, posterY, posterW, posterH); ctx.restore();
    drawRoundedPanel(ctx, { x: posterX-8, y: posterY-8, w: posterW+16, h: posterH+16, radius: 38, fill: 'transparent', stroke: withAlpha(theme.gold, 0.5), lineWidth: 3 });

    const primary = light ? '#0f172a' : '#f8fbff';
    const secondary = light ? '#334155' : 'rgba(218,231,253,0.88)';
    ctx.fillStyle = withAlpha(theme.accent, 0.95); ctx.font = `900 ${Math.round(28 * scale)}px ${fontFamily}`; ctx.fillText('MOVIE REVIEW CARD', 720, 180);
    fitTitleText(ctx, { text: item.title, x: 720, y: 278, maxWidth: 780, preferredSize: 84 * scale, minSize: 44 * scale, fontFamily, maxLines: 3, color: primary, weight: 900 });
    drawPremiumStars(ctx, { x: 720, y: 410, size: Math.round(66 * scale), rating10: clampTenPoint(data.rating), active: theme.gold, inactive: light ? 'rgba(15,23,42,0.18)' : 'rgba(255,255,255,0.22)', fontFamily });
    ctx.fillStyle = primary; ctx.font = `900 ${Math.round(64 * scale)}px ${fontFamily}`; ctx.fillText(`${clampTenPoint(data.rating).toFixed(1)}/10`, 720, 520);
    ctx.fillStyle = secondary; ctx.font = `750 ${Math.round(30 * scale)}px ${fontFamily}`; ctx.fillText(`Phase ${item.phase || '—'} • ${item.year || '—'} • ${data.reviewer || 'Reviewer'}`, 720, 570);

    drawRoundedPanel(ctx, { x: 90, y: 1020, w: 1420, h: 1020, radius: 40, fill: light ? 'rgba(255,255,255,0.84)' : 'rgba(255,255,255,0.07)', stroke: withAlpha(theme.accent2, 0.38) });
    ctx.fillStyle = withAlpha(theme.accent2, 0.95); ctx.font = `900 ${Math.round(34 * scale)}px ${fontFamily}`; ctx.fillText('REVIEW NOTES', 140, 1104);
    ctx.fillStyle = primary; ctx.font = `640 ${Math.round(56 * scale)}px ${fontFamily}`;
    drawWrappedText(ctx, data.reviewText || 'No review yet — add your reaction to this chapter of the saga.', 140, 1190, 1320, Math.round(58 * scale), 12);
    drawThemeStamp(ctx, { x: 128, y: 1964, theme, fontFamily, scale });
    drawWatermark(ctx, { width: 1600, height: 2200 }, fontFamily, theme);
  } else if (type === 'analysis') {
    canvas.width = 1080; canvas.height = 1350;
    applyPreviewScale(canvas, settings);
    const ctx = canvas.getContext('2d');
    const scale = (settings?.textScale || 1) * fontScale;
    const light = isLightMode(settings);
    const primary = light ? '#0f172a' : '#f8fbff';
    const secondary = light ? '#334155' : 'rgba(220,232,255,0.88)';
    drawCardBackdrop(ctx, { width: 1080, height: 1350 }, theme, null, bgOpacity);
    drawRoundedPanel(ctx, { x: 36, y: 36, w: 1008, h: 1278, radius: 52, fill: light ? 'rgba(248,252,255,0.92)' : 'rgba(8,12,22,0.86)', stroke: withAlpha(theme.accent, 0.42), lineWidth: 4 });
    ctx.fillStyle = withAlpha(theme.accent, 0.95); ctx.font = `900 ${Math.round(24 * scale)}px ${fontFamily}`; ctx.fillText('ANALYTICS SNAPSHOT', 86, 104);
    fitTitleText(ctx, { text: 'Progress intelligence', x: 86, y: 170, maxWidth: 760, preferredSize: 56 * scale, minSize: 32 * scale, fontFamily, maxLines: 1, color: primary, weight: 900 });

    const sections = { completion: true, hours: true, streak: true, phaseBreakdown: true, recentMomentum: true, topRated: true, ...(settings?.sections || {}) };
    ctx.fillStyle = primary; ctx.font = `900 ${Math.round(154 * scale)}px ${fontFamily}`; ctx.fillText(`${Number(data.pct || 0)}%`, 84, 336);
    if (sections.completion !== false) drawProgressBar(ctx, { x: 92, y: 364, w: 896, h: 26, pct: data.pct, accent: theme.accent, accent2: theme.accent2 });

    drawBadge(ctx, { x: 84, y: 424, label: 'Watched', value: `${data.totalWatched || 0}/${data.totalItems || 0}`, color: theme.accent, fontFamily, scale, w: 300 });
    if (sections.hours !== false) drawBadge(ctx, { x: 402, y: 424, label: 'Hours', value: `${Math.round(data.totalWatchedHours || 0)}h`, color: theme.gold, fontFamily, scale, w: 220 });
    if (sections.streak !== false) drawBadge(ctx, { x: 640, y: 424, label: 'Streak', value: `${data.streak || 0}d`, color: theme.accent2, fontFamily, scale, w: 330 });

    ctx.fillStyle = secondary; ctx.font = `800 ${Math.round(30 * scale)}px ${fontFamily}`; ctx.fillText(`Current phase: ${data.currentPhase || '—'}`, 86, 620);
    (sections.phaseBreakdown === false ? [] : (data.phaseStats || [])).slice(0, 8).forEach((row, idx) => {
      const y = 694 + idx * 62;
      const pct = row.total ? (row.watched / row.total) * 100 : 0;
      drawRoundedPanel(ctx, { x: 84, y: y-34, w: 912, h: 48, radius: 18, fill: light ? 'rgba(241,245,249,0.9)' : 'rgba(255,255,255,0.06)', stroke: withAlpha(theme.accent, 0.2) });
      ctx.fillStyle = primary; ctx.font = `780 ${Math.round(24 * scale)}px ${fontFamily}`; ctx.fillText(`Phase ${row.phase}`, 102, y-4);
      drawProgressBar(ctx, { x: 292, y: y-23, w: 520, h: 14, pct, accent: theme.accent, accent2: theme.accent2 });
      ctx.fillStyle = secondary; ctx.fillText(`${row.watched}/${row.total}`, 844, y-4);
    });
    drawWatermark(ctx, { width: 1080, height: 1350 }, fontFamily, theme);
  } else if (type === 'unified') {
    canvas.width = 1080; canvas.height = 1350;
    applyPreviewScale(canvas, settings);
    const ctx = canvas.getContext('2d');
    const scale = (settings?.textScale || 1) * fontScale;
    const featured = data.featured;
    const bgImg = featured ? await loadPosterWithFallback({ primarySrc: settings.posterSrc(featured), fallbackText: featured.title }) : null;
    const light = isLightMode(settings);
    const primary = light ? '#0f172a' : '#f8fbff';
    drawCardBackdrop(ctx, { width: 1080, height: 1350 }, theme, bgImg, bgOpacity);
    drawRoundedPanel(ctx, { x: 34, y: 34, w: 1012, h: 1282, radius: 54, fill: light ? 'rgba(248,252,255,0.9)' : 'rgba(8,12,24,0.84)', stroke: withAlpha(theme.accent2, 0.45), lineWidth: 4 });
    ctx.fillStyle = withAlpha(theme.accent, 0.96); ctx.font = `900 ${Math.round(24 * scale)}px ${fontFamily}`; ctx.fillText('MOVIE RECAP CARD', 88, 108);
    if (featured?.title) fitTitleText(ctx, { text: featured.title, x: 88, y: 186, maxWidth: 840, preferredSize: 52 * scale, minSize: 30 * scale, fontFamily, maxLines: 2, color: primary, weight: 900 });
    ctx.fillStyle = primary; ctx.font = `900 ${Math.round(152 * scale)}px ${fontFamily}`; ctx.fillText(`${Number(data.pct || 0)}%`, 88, 360);
    drawProgressBar(ctx, { x: 96, y: 386, w: 884, h: 22, pct: data.pct, accent: theme.accent, accent2: theme.accent2 });
    drawWatermark(ctx, { width: 1080, height: 1350 }, fontFamily, theme);
  } else {

    canvas.width = 1080; canvas.height = 1350;
    applyPreviewScale(canvas, settings);
    const ctx = canvas.getContext('2d');
    drawCardBackdrop(ctx, { width: 1080, height: 1350 }, theme, null, bgOpacity);
    ctx.fillStyle = '#ff5ea8'; ctx.font = `700 60px ${fontFamily}`; ctx.fillText('MCU VIEWING PROGRESS', 72, 110);
    ctx.fillStyle = '#fff'; ctx.font = `700 180px ${fontFamily}`; ctx.fillText(`${data.pct}%`, 72, 300);
    ctx.font = `500 44px ${fontFamily}`; ctx.fillText(`Current Phase: ${data.currentPhase}`, 72, 380); ctx.fillText(`Completed: ${data.totalWatched}/${data.totalItems}`, 72, 445);
  }

  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png', settings?.previewScale ? 0.86 : 0.96));
  return { canvas, blob, filename: getFileName({ type, data, namingStrategy: settings.namingStrategy }) };
};
