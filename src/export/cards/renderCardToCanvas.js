import { drawPremiumStars, drawRoundedPanel, drawWrappedText, fillGradientBackground, loadPosterWithFallback, clampTenPoint } from './helpers';

const getFileName = ({ type, data, namingStrategy }) => {
  if (namingStrategy) return namingStrategy({ type, data });
  const title = data?.slugifyPosterName ? data.slugifyPosterName(data.item?.title || data.title || type) : type;
  return `${title}-${type}-card.png`;
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
    ctx.fillStyle = '#fff';
    ctx.font = `800 ${Math.round(72 * scale)}px ${fontFamily}`;
    drawWrappedText(ctx, item.title, posterX + posterW + 52, posterY + 82, canvas.width - posterW - 300, Math.round(74 * scale), 3);
    drawPremiumStars(ctx, { x: posterX + posterW + 52, y: posterY + 180, size: Math.round(42 * scale), rating10: clampTenPoint(data.rating), active: '#ffd35c', fontFamily });
    ctx.font = `800 ${Math.round(40 * scale)}px ${fontFamily}`;
    ctx.fillStyle = '#8bf8de';
    ctx.fillText(`${clampTenPoint(data.rating).toFixed(1)}/10`, posterX + posterW + 52, posterY + 258);
    ctx.font = `700 ${Math.round(30 * scale)}px ${fontFamily}`;
    ctx.fillStyle = '#c8d4e8';
    ctx.fillText(`${data.reviewer} • ${item.year} • Phase ${item.phase}`, posterX + posterW + 52, posterY + 314);
    drawRoundedPanel(ctx, { x: 148, y: posterY + posterH + 60, w: canvas.width - 296, h: 490, radius: 30, fill: 'rgba(255,255,255,0.08)' });
    ctx.font = `700 ${Math.round(34 * scale)}px ${fontFamily}`; ctx.fillStyle = '#dce8ff'; ctx.fillText('Review Notes', 182, posterY + posterH + 130);
    ctx.font = `500 ${Math.round(42 * scale)}px ${fontFamily}`; ctx.fillStyle = '#f6fbff';
    drawWrappedText(ctx, data.reviewText || 'No review yet.', 182, posterY + posterH + 200, canvas.width - 364, Math.round(56 * scale), 7);
  } else if (type === 'analysis' || type === 'unified') {
    canvas.width = 1080; canvas.height = 1350;
    const ctx = canvas.getContext('2d');
    const featured = data.featured;
    const bgImg = featured ? await loadPosterWithFallback({ primarySrc: settings.posterSrc(featured), fallbackText: featured.title }) : null;
    if (bgImg) ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
    fillGradientBackground(ctx, canvas, [[0, 'rgba(5,10,22,0.58)'], [0.52, 'rgba(10,18,38,0.78)'], [1, 'rgba(6,10,20,0.92)']]);
    drawRoundedPanel(ctx, { x: 48, y: 54, w: 984, h: 1242, radius: 34, fill: 'rgba(8,14,28,0.72)', stroke: 'rgba(160,214,255,0.24)' });
    ctx.fillStyle = 'rgba(255,255,255,0.94)'; ctx.font = `800 56px ${fontFamily}`;
    ctx.fillText(type === 'analysis' ? 'MCU WATCH ANALYSIS' : 'MCU UNIFIED CARD', 94, 138);
    data.rows.slice(0, 5).forEach((row, idx) => { ctx.font = `700 31px ${fontFamily}`; ctx.fillText(row.title.slice(0, 42), 136, 608 + idx * 126); });
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
