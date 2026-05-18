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

const THEMES = {
  midnight: { bg: ['#070b1b', '#121a36', '#25113f'], accent: '#7dd3fc', accent2: '#f472b6', gold: '#ffd35c', panel: 'rgba(7,12,28,0.76)' },
  stark: { bg: ['#130608', '#321016', '#f4b944'], accent: '#f43f5e', accent2: '#fbbf24', gold: '#fde68a', panel: 'rgba(24,8,12,0.78)' },
  vibranium: { bg: ['#080815', '#171044', '#3b1d72'], accent: '#a78bfa', accent2: '#22d3ee', gold: '#e9d5ff', panel: 'rgba(13,10,34,0.78)' },
};

const getTheme = (settings) => THEMES[settings?.theme] || THEMES.midnight;

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

const drawCardBackdrop = (ctx, canvas, theme, bgImg, bgOpacity = 46) => {
  fillGradientBackground(ctx, canvas, [[0, theme.bg[0]], [0.55, theme.bg[1]], [1, theme.bg[2]]]);
  drawGlowOrb(ctx, canvas.width * 0.18, canvas.height * 0.12, canvas.width * 0.52, theme.accent);
  drawGlowOrb(ctx, canvas.width * 0.9, canvas.height * 0.25, canvas.width * 0.46, theme.accent2);
  drawGlowOrb(ctx, canvas.width * 0.45, canvas.height * 1.02, canvas.width * 0.64, theme.gold);
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
    drawCardBackdrop(ctx, { width: 1600, height: 2200 }, theme, img, Math.max(bgOpacity, 54));
    drawRoundedPanel(ctx, { x: 72, y: 78, w: 1456, h: 2044, radius: 64, fill: theme.panel, stroke: 'rgba(255,255,255,0.24)', lineWidth: 3 });
    drawRoundedPanel(ctx, { x: 108, y: 114, w: 1384, h: 1972, radius: 48, fill: 'rgba(255,255,255,0.045)', stroke: withAlpha(theme.accent, 0.24) });

    const posterX = 148, posterY = 182, posterW = 486, posterH = 720;
    drawRoundedPanel(ctx, { x: posterX - 12, y: posterY - 12, w: posterW + 24, h: posterH + 24, radius: 40, fill: 'rgba(255,255,255,0.14)', stroke: withAlpha(theme.gold, 0.36), lineWidth: 3 });
    ctx.save();
    ctx.beginPath(); ctx.roundRect(posterX, posterY, posterW, posterH, 30); ctx.clip();
    drawCoverImage(ctx, img, posterX, posterY, posterW, posterH);
    ctx.restore();

    ctx.fillStyle = withAlpha(theme.accent, 0.95);
    ctx.font = `900 ${Math.round(30 * scale)}px ${fontFamily}`;
    ctx.fillText('YOUR MARVEL VERDICT', posterX + posterW + 60, posterY + 38);
    fitTitleText(ctx, { text: item.title, x: posterX + posterW + 60, y: posterY + 128, maxWidth: 760, preferredSize: 88 * scale, minSize: 46 * scale, fontFamily, maxLines: 3, color: '#fff' });
    drawPremiumStars(ctx, { x: posterX + posterW + 60, y: posterY + 372, size: Math.round(62 * scale), rating10: clampTenPoint(data.rating), active: theme.gold, fontFamily });
    ctx.fillStyle = '#fff'; ctx.font = `900 ${Math.round(58 * scale)}px ${fontFamily}`;
    ctx.fillText(`${clampTenPoint(data.rating).toFixed(1)}/10`, posterX + posterW + 60, posterY + 468);
    drawBadge(ctx, { x: posterX + posterW + 60, y: posterY + 540, label: 'Phase', value: String(item.phase || '—'), color: theme.accent, fontFamily, scale, w: 160 });
    drawBadge(ctx, { x: posterX + posterW + 248, y: posterY + 540, label: 'Year', value: String(item.year || '—'), color: theme.accent2, fontFamily, scale, w: 190 });
    drawBadge(ctx, { x: posterX + posterW + 468, y: posterY + 540, label: 'Fan', value: data.reviewer || 'Reviewer', color: theme.gold, fontFamily, scale, w: 300 });

    drawRoundedPanel(ctx, { x: 148, y: 980, w: 1304, h: 760, radius: 44, fill: 'rgba(255,255,255,0.09)', stroke: 'rgba(255,255,255,0.18)' });
    ctx.fillStyle = withAlpha(theme.accent, 0.92);
    ctx.font = `900 ${Math.round(34 * scale)}px ${fontFamily}`;
    ctx.fillText('REVIEW NOTES', 196, 1064);
    ctx.font = `650 ${Math.round(62 * scale)}px ${fontFamily}`; ctx.fillStyle = '#f8fbff';
    drawWrappedText(ctx, data.reviewText || 'No review yet — but the multiverse is ready for your hot take.', 196, 1160, 1210, Math.round(74 * scale), 7);
    drawWatermark(ctx, { width: 1600, height: 2200 }, fontFamily, theme);
  } else if (type === 'analysis') {
    canvas.width = 1080; canvas.height = 1350;
    applyPreviewScale(canvas, settings);
    const ctx = canvas.getContext('2d');
    const scale = (settings?.textScale || 1) * fontScale;
    drawCardBackdrop(ctx, { width: 1080, height: 1350 }, theme, null, bgOpacity);
    drawRoundedPanel(ctx, { x: 46, y: 48, w: 988, h: 1254, radius: 48, fill: theme.panel, stroke: 'rgba(255,255,255,0.24)', lineWidth: 3 });

    ctx.fillStyle = withAlpha(theme.accent, 0.95);
    ctx.font = `900 ${Math.round(26 * scale)}px ${fontFamily}`;
    ctx.fillText('MCU WATCH DOSSIER', 92, 126);
    fitTitleText(ctx, { text: 'Progress worth sharing', x: 92, y: 204, maxWidth: 820, preferredSize: 64 * scale, minSize: 34 * scale, fontFamily, maxLines: 1, color: '#fff' });
    const sections = { completion: true, hours: true, streak: true, phaseBreakdown: true, recentMomentum: true, topRated: true, ...(settings?.sections || {}) };
    ctx.fillStyle = '#ffffff'; ctx.font = `950 ${Math.round(172 * scale)}px ${fontFamily}`;
    ctx.fillText(sections.completion === false ? 'MCU' : `${Number(data.pct || 0)}%`, 92, 392);
    if (sections.completion !== false) drawProgressBar(ctx, { x: 98, y: 430, w: 884, h: 28, pct: data.pct, accent: theme.accent, accent2: theme.accent2 });

    const badgeRows = [
      { enabled: sections.completion !== false, label: 'Completed', value: `${data.totalWatched || 0}/${data.totalItems || 0}`, color: theme.accent, w: 260 },
      { enabled: sections.hours !== false, label: 'Hours', value: `${Math.round(data.totalWatchedHours || 0)}h`, color: theme.gold, w: 220 },
      { enabled: sections.streak !== false, label: 'Streak', value: `${data.streak || 0} days`, color: theme.accent2, w: 300 },
    ].filter(row => row.enabled);
    let badgeX = 96;
    badgeRows.forEach(row => {
      drawBadge(ctx, { x: badgeX, y: 498, label: row.label, value: row.value, color: row.color, fontFamily, scale, w: row.w });
      badgeX += row.w + 28;
    });

    ctx.fillStyle = '#dce8ff'; ctx.font = `850 ${Math.round(34 * scale)}px ${fontFamily}`;
    ctx.fillText(`Current mission: ${data.currentPhase || '—'}`, 100, 666);
    const rows = sections.phaseBreakdown === false ? [] : (Array.isArray(data.phaseStats) ? data.phaseStats : []);
    rows.slice(0, sections.topRated === false ? 9 : 7).forEach((row, idx) => {
      const y = 738 + idx * 56;
      const rowPct = row.total ? (row.watched / row.total) * 100 : 0;
      ctx.fillStyle = 'rgba(255,255,255,0.94)'; ctx.font = `800 ${Math.round(28 * scale)}px ${fontFamily}`;
      ctx.fillText(`Phase ${row.phase}`, 112, y);
      drawProgressBar(ctx, { x: 300, y: y - 22, w: 520, h: 18, pct: rowPct, accent: theme.accent, accent2: theme.accent2 });
      ctx.fillStyle = 'rgba(220,232,255,0.84)'; ctx.font = `800 ${Math.round(26 * scale)}px ${fontFamily}`;
      ctx.fillText(`${row.watched}/${row.total}`, 854, y);
    });
    if (sections.recentMomentum !== false) {
      drawBadge(ctx, { x: 96, y: 1164, label: 'Recent momentum', value: `${data.recentCount || 0} logs`, color: theme.accent2, fontFamily, scale, w: 300 });
    }
    if (sections.topRated !== false && Array.isArray(data.topRatedItems) && data.topRatedItems.length) {
      ctx.fillStyle = '#eaf2ff'; ctx.font = `900 ${Math.round(28 * scale)}px ${fontFamily}`;
      ctx.fillText('Top rated', 430, 1196);
      data.topRatedItems.slice(0, 3).forEach((item, idx) => {
        const rating = clampTenPoint(data.ratings?.[item.id] || item.rating || 0);
        ctx.fillStyle = 'rgba(255,255,255,0.92)'; ctx.font = `800 ${Math.round(23 * scale)}px ${fontFamily}`;
        ctx.fillText(`${idx + 1}. ${item.title}`.slice(0, 44), 430, 1232 + idx * 34);
        ctx.fillStyle = theme.gold;
        ctx.fillText(`${rating.toFixed(1)}★`, 870, 1232 + idx * 34);
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
    drawRoundedPanel(ctx, { x: 42, y: 42, w: 996, h: 1266, radius: 52, fill: theme.panel, stroke: 'rgba(255,255,255,0.25)', lineWidth: 3 });
    drawRoundedPanel(ctx, { x: 72, y: 76, w: 936, h: 1200, radius: 38, fill: 'rgba(255,255,255,0.05)', stroke: withAlpha(theme.accent, 0.2) });

    const ratingMap = data.ratings || {};
    const topRows = (data.rows || []).slice(0, settings?.density === 'compact' ? 6 : 5);
    const featuredRating = clampTenPoint(ratingMap[featured?.id] || data.rating || 0);
    ctx.fillStyle = withAlpha(theme.accent, 0.96); ctx.font = `900 ${Math.round(24 * scale)}px ${fontFamily}`;
    ctx.fillText('MULTIVERSE RECAP', 104, 138);
    if (featured?.title) fitTitleText(ctx, { text: featured.title, x: 104, y: 216, maxWidth: 820, preferredSize: 54 * scale, minSize: 28 * scale, fontFamily, maxLines: 2, color: '#fff', weight: 900 });

    ctx.fillStyle = '#ffffff'; ctx.font = `950 ${Math.round(164 * scale)}px ${fontFamily}`; ctx.fillText(`${Number(data.pct || 0)}%`, 104, 410);
    drawProgressBar(ctx, { x: 110, y: 446, w: 858, h: 26, pct: data.pct, accent: theme.accent, accent2: theme.accent2 });
    drawBadge(ctx, { x: 110, y: 506, label: 'Completed', value: `${data.totalWatched || 0}/${data.totalItems || 0}`, color: theme.accent, fontFamily, scale, w: 270 });
    drawBadge(ctx, { x: 410, y: 506, label: 'Phase', value: data.currentPhase || '—', color: theme.accent2, fontFamily, scale, w: 252 });
    drawBadge(ctx, { x: 692, y: 506, label: 'Feature', value: `${featuredRating.toFixed(1)}★`, color: theme.gold, fontFamily, scale, w: 276 });

    ctx.fillStyle = '#eaf2ff'; ctx.font = `900 ${Math.round(34 * scale)}px ${fontFamily}`; ctx.fillText('Recently conquered', 112, 692);
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
