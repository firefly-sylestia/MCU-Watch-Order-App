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

const getColorMode = (settings) => settings?.colorMode === 'light' ? 'light' : 'dark';

const getModePalette = (theme, mode) => {
  if (mode === 'light') {
    return {
      card: 'rgba(247,250,255,0.95)',
      cardBorder: withAlpha(theme.accent2, 0.34),
      panel: 'rgba(255,255,255,0.78)',
      panelSoft: 'rgba(255,255,255,0.56)',
      textPrimary: '#0f172a',
      textSecondary: '#334155',
      textMuted: '#64748b',
      track: 'rgba(148,163,184,0.28)',
      chipStroke: 'rgba(30,41,59,0.14)',
      overlay: 'rgba(255,255,255,0.48)',
    };
  }
  return {
    card: 'rgba(7,12,24,0.86)',
    cardBorder: withAlpha(theme.accent, 0.4),
    panel: 'rgba(255,255,255,0.08)',
    panelSoft: 'rgba(255,255,255,0.05)',
    textPrimary: '#f8fbff',
    textSecondary: '#dbe8ff',
    textMuted: 'rgba(214,227,246,0.76)',
    track: 'rgba(255,255,255,0.14)',
    chipStroke: 'rgba(255,255,255,0.16)',
    overlay: 'rgba(6,10,18,0.48)',
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
    const mode = getColorMode(settings);
    const palette = getModePalette(theme, mode);
    const item = data.item;
    const img = await loadPosterWithFallback({ primarySrc: settings.posterSrc(item), fallbackText: item.title });
    drawCardBackdrop(ctx, { width: 1600, height: 2200 }, theme, img, Math.max(bgOpacity, 54));
    drawRoundedPanel(ctx, { x: 56, y: 56, w: 1488, h: 2088, radius: 72, fill: palette.card, stroke: palette.cardBorder, lineWidth: 4 });

    const posterX = 118, posterY = 140, posterW = 548, posterH = 820;
    drawRoundedPanel(ctx, { x: posterX - 14, y: posterY - 14, w: posterW + 28, h: posterH + 28, radius: 42, fill: palette.panel, stroke: withAlpha(theme.gold, 0.34), lineWidth: 3 });
    ctx.save(); ctx.beginPath(); ctx.roundRect(posterX, posterY, posterW, posterH, 32); ctx.clip(); drawCoverImage(ctx, img, posterX, posterY, posterW, posterH); ctx.restore();

    drawRoundedPanel(ctx, { x: 704, y: 140, w: 776, h: 820, radius: 40, fill: palette.panel, stroke: palette.chipStroke });
    ctx.fillStyle = withAlpha(theme.accent, 0.95); ctx.font = `900 ${Math.round(28 * scale)}px ${fontFamily}`; ctx.fillText('MOVIE REVIEW SPOTLIGHT', 754, 196);
    fitTitleText(ctx, { text: item.title, x: 754, y: 292, maxWidth: 674, preferredSize: 74 * scale, minSize: 38 * scale, fontFamily, maxLines: 3, color: palette.textPrimary, weight: 900 });
    drawPremiumStars(ctx, { x: 754, y: 404, size: Math.round(58 * scale), rating10: clampTenPoint(data.rating), active: theme.gold, fontFamily });
    ctx.fillStyle = palette.textPrimary; ctx.font = `900 ${Math.round(56 * scale)}px ${fontFamily}`; ctx.fillText(`${clampTenPoint(data.rating).toFixed(1)}/10`, 754, 500);
    drawBadge(ctx, { x: 754, y: 546, label: 'Phase', value: String(item.phase || '—'), color: theme.accent, fontFamily, scale, w: 160 });
    drawBadge(ctx, { x: 940, y: 546, label: 'Year', value: String(item.year || '—'), color: theme.accent2, fontFamily, scale, w: 180 });
    drawBadge(ctx, { x: 1144, y: 546, label: 'By', value: data.reviewer || 'Reviewer', color: theme.gold, fontFamily, scale, w: 304 });

    drawRoundedPanel(ctx, { x: 118, y: 1010, w: 1362, h: 980, radius: 46, fill: palette.panelSoft, stroke: palette.chipStroke });
    ctx.fillStyle = palette.textSecondary; ctx.font = `900 ${Math.round(33 * scale)}px ${fontFamily}`; ctx.fillText('REVIEW NOTES', 172, 1092);
    ctx.fillStyle = palette.textPrimary; ctx.font = `640 ${Math.round(58 * scale)}px ${fontFamily}`;
    drawWrappedText(ctx, data.reviewText || 'Drop your review to capture this watch in your timeline.', 172, 1174, 1248, Math.round(54 * scale), 11);
    drawThemeStamp(ctx, { x: 124, y: 1930, theme, fontFamily, scale });
    drawWatermark(ctx, { width: 1600, height: 2200 }, fontFamily, theme);
  } else if (type === 'analysis') {
    canvas.width = 1080; canvas.height = 1350;
    applyPreviewScale(canvas, settings);
    const ctx = canvas.getContext('2d');
    const scale = (settings?.textScale || 1) * fontScale;
    const mode = getColorMode(settings);
    const palette = getModePalette(theme, mode);
    drawCardBackdrop(ctx, { width: 1080, height: 1350 }, theme, null, bgOpacity);
    drawRoundedPanel(ctx, { x: 34, y: 34, w: 1012, h: 1282, radius: 56, fill: palette.card, stroke: palette.cardBorder, lineWidth: 4 });

    ctx.fillStyle = withAlpha(theme.accent, 0.95); ctx.font = `900 ${Math.round(24 * scale)}px ${fontFamily}`; ctx.fillText('ANALYTICS SNAPSHOT', 82, 110);
    fitTitleText(ctx, { text: 'Watch momentum report', x: 82, y: 182, maxWidth: 720, preferredSize: 56 * scale, minSize: 32 * scale, fontFamily, maxLines: 1, color: palette.textPrimary, weight: 900 });
    drawThemeStamp(ctx, { x: 600, y: 74, theme, fontFamily, scale });

    const sections = { completion: true, hours: true, streak: true, phaseBreakdown: true, recentMomentum: true, topRated: true, ...(settings?.sections || {}) };
    drawRoundedPanel(ctx, { x: 74, y: 226, w: 932, h: 262, radius: 34, fill: palette.panel, stroke: palette.chipStroke });
    ctx.fillStyle = palette.textMuted; ctx.font = `700 ${Math.round(20 * scale)}px ${fontFamily}`; ctx.fillText('Completion', 110, 274);
    ctx.fillStyle = palette.textPrimary; ctx.font = `950 ${Math.round(154 * scale)}px ${fontFamily}`; ctx.fillText(sections.completion === false ? 'MCU' : `${Number(data.pct || 0)}%`, 102, 426);
    if (sections.completion !== false) drawProgressBar(ctx, { x: 112, y: 444, w: 848, h: 24, pct: data.pct, accent: theme.accent, accent2: theme.accent2 });

    const badgeRows = [
      { enabled: sections.completion !== false, label: 'Completed', value: `${data.totalWatched || 0}/${data.totalItems || 0}`, color: theme.accent, w: 274 },
      { enabled: sections.hours !== false, label: 'Watch Hours', value: `${Math.round(data.totalWatchedHours || 0)}h`, color: theme.gold, w: 256 },
      { enabled: sections.streak !== false, label: 'Current Streak', value: `${data.streak || 0} days`, color: theme.accent2, w: 330 },
    ].filter(row => row.enabled);
    let badgeX = 74; badgeRows.forEach(row => { drawBadge(ctx, { x: badgeX, y: 520, label: row.label, value: row.value, color: row.color, fontFamily, scale, w: row.w }); badgeX += row.w + 20; });

    ctx.fillStyle = palette.textSecondary; ctx.font = `850 ${Math.round(30 * scale)}px ${fontFamily}`; ctx.fillText(`Current phase focus: ${data.currentPhase || '—'}`, 82, 676);
    const rows = sections.phaseBreakdown === false ? [] : (Array.isArray(data.phaseStats) ? data.phaseStats : []);
    rows.slice(0, sections.topRated === false ? 9 : 7).forEach((row, idx) => {
      const y = 744 + idx * 64;
      const rowPct = row.total ? (row.watched / row.total) * 100 : 0;
      drawRoundedPanel(ctx, { x: 78, y: y - 38, w: 926, h: 50, radius: 18, fill: idx % 2 ? palette.panelSoft : palette.panel, stroke: palette.chipStroke });
      ctx.fillStyle = palette.textPrimary; ctx.font = `800 ${Math.round(25 * scale)}px ${fontFamily}`; ctx.fillText(`Phase ${row.phase}`, 102, y - 4);
      drawProgressBar(ctx, { x: 286, y: y - 24, w: 500, h: 16, pct: rowPct, accent: theme.accent, accent2: theme.accent2 });
      ctx.fillStyle = palette.textMuted; ctx.font = `800 ${Math.round(23 * scale)}px ${fontFamily}`; ctx.fillText(`${row.watched}/${row.total}`, 828, y - 4);
    });
    if (sections.recentMomentum !== false) drawBadge(ctx, { x: 82, y: 1164, label: 'Recent Logs', value: `${data.recentCount || 0}`, color: theme.accent2, fontFamily, scale, w: 246 });
    if (sections.topRated !== false && Array.isArray(data.topRatedItems) && data.topRatedItems.length) {
      ctx.fillStyle = palette.textSecondary; ctx.font = `900 ${Math.round(26 * scale)}px ${fontFamily}`; ctx.fillText('Top rated this streak', 356, 1194);
      data.topRatedItems.slice(0, 3).forEach((item, idx) => {
        const rating = clampTenPoint(data.ratings?.[item.id] || item.rating || 0);
        ctx.fillStyle = palette.textPrimary; ctx.font = `780 ${Math.round(22 * scale)}px ${fontFamily}`; ctx.fillText(`${idx + 1}. ${item.title}`.slice(0, 44), 356, 1228 + idx * 34);
        ctx.fillStyle = theme.gold; ctx.fillText(`${rating.toFixed(1)}★`, 850, 1228 + idx * 34);
      });
    }
    drawWatermark(ctx, { width: 1080, height: 1350 }, fontFamily, theme);
  } else if (type === 'unified') {
    canvas.width = 1080; canvas.height = 1350;
    applyPreviewScale(canvas, settings);
    const ctx = canvas.getContext('2d');
    const scale = (settings?.textScale || 1) * fontScale;
    const featured = data.featured;
    const bgImg = featured ? await loadPosterWithFallback({ primarySrc: settings.posterSrc(featured), fallbackText: featured.title }) : null;
    drawCardBackdrop(ctx, { width: 1080, height: 1350 }, theme, bgImg, bgOpacity);
    drawRoundedPanel(ctx, { x: 30, y: 30, w: 1020, h: 1290, radius: 58, fill: 'rgba(8,13,24,0.84)', stroke: withAlpha(theme.accent2, 0.42), lineWidth: 4 });
    drawRoundedPanel(ctx, { x: 60, y: 62, w: 960, h: 1230, radius: 44, fill: 'rgba(255,255,255,0.04)', stroke: withAlpha(theme.gold, 0.24) });
    drawThemeStamp(ctx, { x: 104, y: 1196, theme, fontFamily, scale });

    const ratingMap = data.ratings || {};
    const topRows = (data.rows || []).slice(0, settings?.density === 'compact' ? 6 : 5);
    const featuredRating = clampTenPoint(ratingMap[featured?.id] || data.rating || 0);
    ctx.fillStyle = withAlpha(theme.accent, 0.96); ctx.font = `900 ${Math.round(24 * scale)}px ${fontFamily}`;
    ctx.fillText(`${theme.titleLabel || 'WATCH'} PREMIUM RECAP`, 104, 138);
    if (featured?.title) fitTitleText(ctx, { text: featured.title, x: 104, y: 216, maxWidth: 820, preferredSize: 54 * scale, minSize: 28 * scale, fontFamily, maxLines: 2, color: '#fff', weight: 900 });

    ctx.fillStyle = '#ffffff'; ctx.font = `950 ${Math.round(164 * scale)}px ${fontFamily}`; ctx.fillText(`${Number(data.pct || 0)}%`, 104, 410);
    drawProgressBar(ctx, { x: 110, y: 446, w: 858, h: 26, pct: data.pct, accent: theme.accent, accent2: theme.accent2 });
    drawBadge(ctx, { x: 110, y: 506, label: 'Completed', value: `${data.totalWatched || 0}/${data.totalItems || 0}`, color: theme.accent, fontFamily, scale, w: 270 });
    drawBadge(ctx, { x: 410, y: 506, label: 'Phase', value: data.currentPhase || '—', color: theme.accent2, fontFamily, scale, w: 252 });
    drawBadge(ctx, { x: 692, y: 506, label: 'Feature', value: `${featuredRating.toFixed(1)}★`, color: theme.gold, fontFamily, scale, w: 276 });

    ctx.fillStyle = '#eaf2ff'; ctx.font = `900 ${Math.round(34 * scale)}px ${fontFamily}`; ctx.fillText('Recent timeline wins', 112, 692);
    topRows.forEach((row, idx) => {
      const y = 752 + idx * 92;
      const rowRating = clampTenPoint(ratingMap[row.id] || row.rating || 0);
      drawRoundedPanel(ctx, { x: 104, y: y - 50, w: 872, h: 72, radius: 24, fill: idx % 2 ? 'rgba(255,255,255,0.055)' : 'rgba(255,255,255,0.085)', stroke: 'rgba(255,255,255,0.1)' });
      fitTitleText(ctx, { text: row.title, x: 132, y: y - 10, maxWidth: 570, preferredSize: 30 * scale, minSize: 20 * scale, fontFamily, maxLines: 1, color: 'rgba(255,255,255,0.96)', weight: 850 });
      ctx.fillStyle = 'rgba(210,226,248,0.74)'; ctx.font = `700 ${Math.round(21 * scale)}px ${fontFamily}`; ctx.fillText(`${row.year || '—'} • Phase ${row.phase || '—'}`, 132, y + 16);
      ctx.fillStyle = theme.gold; ctx.font = `900 ${Math.round(30 * scale)}px ${fontFamily}`; ctx.fillText(`${rowRating.toFixed(1)}★`, 826, y - 2);
    });
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
