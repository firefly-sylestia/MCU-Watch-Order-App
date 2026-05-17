import { drawPremiumStars, drawRoundedPanel, drawWrappedText, fillGradientBackground, loadPosterWithFallback, clampTenPoint } from './helpers';

const getFileName = ({ type, data, namingStrategy }) => {
  if (namingStrategy) return namingStrategy({ type, data });
  const title = data?.slugifyPosterName ? data.slugifyPosterName(data.item?.title || data.title || type) : type;
  return `${title}-${type}-card.png`;
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

export const renderCardToCanvas = async ({ type, data, settings }) => {
  const canvas = document.createElement('canvas');
  const fontFamily = settings?.fontFamily || 'Inter, sans-serif';

  if (type === 'review') {
    canvas.width = 1600; canvas.height = 2200;
    const ctx = canvas.getContext('2d');
    const scale = settings?.textScale || 1;
    const item = data.item;
    const img = await loadPosterWithFallback({ primarySrc: settings.posterSrc(item), fallbackText: item.title });
    fillGradientBackground(ctx, canvas, [[0, '#0b1020'], [1, '#1e2842']]);
    if (img) ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(4,8,18,0.64)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawRoundedPanel(ctx, { x: 88, y: 120, w: canvas.width - 176, h: canvas.height - 250, radius: 46, fill: '#0b1020' });
    drawRoundedPanel(ctx, { x: 114, y: 146, w: canvas.width - 228, h: canvas.height - 302, radius: 36, fill: 'rgba(10,18,35,0.76)' });
    const posterX = 148, posterY = 194, posterW = 450, posterH = 660;
    if (img) ctx.drawImage(img, posterX, posterY, posterW, posterH);
    const titleLineHeight = fitTitleText(ctx, { text: item.title, x: posterX + posterW + 52, y: posterY + 82, maxWidth: canvas.width - posterW - 300, preferredSize: 92 * scale, minSize: 52 * scale, fontFamily, maxLines: 2, color: '#fff' });
    drawPremiumStars(ctx, { x: posterX + posterW + 52, y: posterY + Math.max(170, titleLineHeight + 90), size: Math.round(58 * scale), rating10: clampTenPoint(data.rating), active: '#ffd35c', fontFamily });
    ctx.font = `800 ${Math.round(46 * scale)}px ${fontFamily}`;
    ctx.fillStyle = '#8bf8de';
    ctx.fillText(`${clampTenPoint(data.rating).toFixed(1)}/10`, posterX + posterW + 52, posterY + 258);
    ctx.font = `700 ${Math.round(40 * scale)}px ${fontFamily}`;
    ctx.fillStyle = '#c8d4e8';
    ctx.fillText(`${data.reviewer} • ${item.year} • Phase ${item.phase}`, posterX + posterW + 52, posterY + 314);
    drawRoundedPanel(ctx, { x: 148, y: posterY + posterH + 60, w: canvas.width - 296, h: 490, radius: 30, fill: 'rgba(255,255,255,0.08)' });
    fitTitleText(ctx, { text: 'Review Notes', x: 182, y: posterY + posterH + 130, maxWidth: canvas.width - 364, preferredSize: 44 * scale, minSize: 30 * scale, fontFamily, maxLines: 1, color: '#dce8ff', weight: 700 });
    ctx.font = `500 ${Math.round(58 * scale)}px ${fontFamily}`; ctx.fillStyle = '#f6fbff';
    drawWrappedText(ctx, data.reviewText || 'No review yet.', 182, posterY + posterH + 200, canvas.width - 364, Math.round(62 * scale), 7);
  } else if (type === 'analysis') {
    canvas.width = 1080; canvas.height = 1350;
    const ctx = canvas.getContext('2d');
    const scale = settings?.textScale || 1;
    fillGradientBackground(ctx, canvas, [[0, '#0b1020'], [1, '#1e2842']]);
    drawRoundedPanel(ctx, { x: 52, y: 58, w: 976, h: 1234, radius: 40, fill: 'rgba(10,18,35,0.88)', stroke: 'rgba(160,214,255,0.24)' });
    drawRoundedPanel(ctx, { x: 92, y: 226, w: 896, h: 248, radius: 30, fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.18)' });
    drawRoundedPanel(ctx, { x: 92, y: 506, w: 896, h: 724, radius: 30, fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.18)' });

    fitTitleText(ctx, { text: 'MCU WATCH ANALYSIS', x: 124, y: 162, maxWidth: 840, preferredSize: 66 * scale, minSize: 40 * scale, fontFamily, maxLines: 1, color: 'rgba(255,255,255,0.96)' });
    ctx.fillStyle = 'rgba(206,224,246,0.94)';
    ctx.font = `600 ${Math.round(34 * scale)}px ${fontFamily}`;
    ctx.fillText('Progress summary', 124, 204);

    ctx.fillStyle = '#ffffff';
    ctx.font = `800 ${Math.round(150 * scale)}px ${fontFamily}`;
    ctx.fillText(`${Number(data.pct || 0)}%`, 128, 384);
    ctx.fillStyle = '#8bf8de';
    ctx.font = `700 ${Math.round(44 * scale)}px ${fontFamily}`;
    ctx.fillText(`${data.totalWatched || 0}/${data.totalItems || 0} completed`, 132, 442);
    ctx.fillStyle = '#c8d4e8';
    ctx.font = `600 ${Math.round(34 * scale)}px ${fontFamily}`;
    ctx.fillText(`Current Phase: ${data.currentPhase || '—'}`, 132, 486);

    fitTitleText(ctx, { text: 'Phase breakdown', x: 124, y: 572, maxWidth: 820, preferredSize: 44 * scale, minSize: 28 * scale, fontFamily, maxLines: 1, color: '#dce8ff', weight: 700 });
    const rows = Array.isArray(data.phaseStats) ? data.phaseStats : [];
    rows.slice(0, 12).forEach((row, idx) => {
      const y = 648 + idx * 52;
      ctx.fillStyle = 'rgba(255,255,255,0.96)';
      ctx.font = `700 ${Math.round(30 * scale)}px ${fontFamily}`;
      ctx.fillText(`Phase ${row.phase}`, 132, y);
      ctx.fillStyle = 'rgba(191,210,233,0.96)';
      ctx.font = `700 ${Math.round(30 * scale)}px ${fontFamily}`;
      ctx.fillText(`${row.watched}/${row.total}`, 856, y);
    });
  } else if (type === 'unified') {
    canvas.width = 1080; canvas.height = 1350;
    const ctx = canvas.getContext('2d');
    const scale = settings?.textScale || 1;
    const featured = data.featured;
    const bgImg = featured ? await loadPosterWithFallback({ primarySrc: settings.posterSrc(featured), fallbackText: featured.title }) : null;
    if (bgImg) ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
    else fillGradientBackground(ctx, canvas, [[0, '#0b1020'], [1, '#1e2842']]);
    ctx.fillStyle = 'rgba(4,8,18,0.40)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    fillGradientBackground(ctx, canvas, [[0, 'rgba(4,8,18,0.20)'], [0.5, 'rgba(8,14,30,0.54)'], [1, 'rgba(4,8,18,0.78)']]);
    drawRoundedPanel(ctx, { x: 48, y: 54, w: 984, h: 1242, radius: 40, fill: 'rgba(8,14,28,0.74)', stroke: 'rgba(160,214,255,0.24)' });
    drawRoundedPanel(ctx, { x: 76, y: 84, w: 928, h: 1186, radius: 34, fill: 'rgba(10,18,35,0.76)', stroke: 'rgba(160,214,255,0.14)' });
    drawRoundedPanel(ctx, { x: 104, y: 206, w: 872, h: 370, radius: 30, fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.18)' });
    drawRoundedPanel(ctx, { x: 104, y: 606, w: 872, h: 616, radius: 30, fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.18)' });

    const ratingMap = data.ratings || {};
    const topRows = data.rows.slice(0, 5);
    const featuredRating = clampTenPoint(ratingMap[featured?.id] || data.rating || 0);
    fitTitleText(ctx, { text: 'MCU UNIFIED CARD', x: 128, y: 162, maxWidth: 820, preferredSize: 60 * scale, minSize: 36 * scale, fontFamily, maxLines: 1, color: 'rgba(255,255,255,0.94)' });
    ctx.fillStyle = 'rgba(206,224,246,0.94)'; ctx.font = `600 ${Math.round(34 * scale)}px ${fontFamily}`; ctx.fillText('Viewing recap', 128, 198);
    if (featured?.title) fitTitleText(ctx, { text: featured.title, x: 128, y: 244, maxWidth: 820, preferredSize: 42 * scale, minSize: 24 * scale, fontFamily, maxLines: 2, color: '#8bf8de', weight: 700 });

    ctx.fillStyle = '#ffffff'; ctx.font = `800 ${Math.round(162 * scale)}px ${fontFamily}`; ctx.fillText(`${Number(data.pct || 0)}%`, 136, 372);
    ctx.fillStyle = '#8bf8de'; ctx.font = `700 ${Math.round(44 * scale)}px ${fontFamily}`; ctx.fillText(`${data.totalWatched || 0}/${data.totalItems || 0} completed`, 142, 436);
    ctx.fillStyle = '#c8d4e8'; ctx.font = `600 ${Math.round(40 * scale)}px ${fontFamily}`; ctx.fillText(`Current Phase: ${data.currentPhase || '—'}`, 142, 488);
    ctx.fillStyle = '#dce8ff'; ctx.font = `700 ${Math.round(40 * scale)}px ${fontFamily}`; ctx.fillText(`Featured Rating: ${featuredRating.toFixed(1)}★/10`, 142, 536);

    ctx.fillStyle = '#dce8ff'; ctx.font = `700 ${Math.round(36 * scale)}px ${fontFamily}`; ctx.fillText('Recent History', 136, 664);
    topRows.forEach((row, idx) => {
      const y = 736 + idx * 108;
      const rowRating = clampTenPoint(ratingMap[row.id] || row.rating || 0);
      ctx.fillStyle = 'rgba(255,255,255,0.96)';
      fitTitleText(ctx, { text: row.title.slice(0, 52), x: 142, y, maxWidth: 620, preferredSize: 40 * scale, minSize: 24 * scale, fontFamily, maxLines: 1, color: 'rgba(255,255,255,0.96)', weight: 700 });
      ctx.fillStyle = 'rgba(191,210,233,0.96)'; ctx.font = `600 ${Math.round(28 * scale)}px ${fontFamily}`; ctx.fillText(`${row.year || '—'} • Phase ${row.phase || '—'}`, 142, y + 34);
      ctx.fillStyle = '#8bf8de'; ctx.font = `700 ${Math.round(40 * scale)}px ${fontFamily}`; ctx.fillText(`${rowRating.toFixed(1)}★/10`, 808, y + 10);
    });
  } else {
    canvas.width = 1080; canvas.height = 1350;
    const ctx = canvas.getContext('2d');
    fillGradientBackground(ctx, canvas, [[0, '#120e2f'], [1, '#2e143a']]);
    ctx.fillStyle = '#ff5ea8'; ctx.font = `700 60px ${fontFamily}`; ctx.fillText('MCU VIEWING PROGRESS', 72, 110);
    ctx.fillStyle = '#fff'; ctx.font = `700 180px ${fontFamily}`; ctx.fillText(`${data.pct}%`, 72, 300);
    ctx.font = `500 44px ${fontFamily}`; ctx.fillText(`Current Phase: ${data.currentPhase}`, 72, 380); ctx.fillText(`Completed: ${data.totalWatched}/${data.totalItems}`, 72, 445);
  }

  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png', 0.96));
  return { canvas, blob, filename: getFileName({ type, data, namingStrategy: settings.namingStrategy }) };
};
