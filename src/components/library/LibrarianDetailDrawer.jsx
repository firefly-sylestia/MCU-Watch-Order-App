import React, { useEffect, useRef } from 'react';
import { Bookmark, Check, Info, PlayCircle, Star, X } from '../../constants/icons.jsx';
import { COLLECTIONS, DC_COLLECTION, estimateRuntime, releaseLabel, statusLabel, typeLabel } from './archiveUtils.js';

export default function LibrarianDetailDrawer({ item, open, onClose, posterSrc, detailData, getAfterCreditsMeta, universe, bookmarked, rating, review, onToggleBookmark, onStatus, onRating, onReview, onOpenTrailer, onOpenImdb }) {
  const panelRef = useRef(null);
  useEffect(() => {
    if (!open || !panelRef.current) return;
    const panel = panelRef.current;
    const previous = document.activeElement;
    const first = panel.querySelector('button, input, textarea, [href], [tabindex]:not([tabindex="-1"])');
    first?.focus?.();
    const onKey = (event) => {
      if (event.key === 'Escape') onClose?.();
      if (event.key !== 'Tab') return;
      const focusable = [...panel.querySelectorAll('button, input, textarea, [href], [tabindex]:not([tabindex="-1"])')];
      if (!focusable.length) return;
      const start = focusable[0];
      const end = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === start) { event.preventDefault(); end.focus(); }
      else if (!event.shiftKey && document.activeElement === end) { event.preventDefault(); start.focus(); }
    };
    panel.addEventListener('keydown', onKey);
    return () => { panel.removeEventListener('keydown', onKey); previous?.focus?.(); };
  }, [open, onClose]);

  if (!open || !item) return null;
  const after = getAfterCreditsMeta?.(item);
  const collections = (universe === 'dc' ? [DC_COLLECTION] : COLLECTIONS).filter((collection) => collection.test(item, after));
  const metadata = [item.year || 'TBA', typeLabel(item.type), item.phase ? `Phase ${item.phase}` : null, releaseLabel(item), estimateRuntime(item)].filter(Boolean).join(' · ');

  return (
    <div className="librarian-drawer" role="dialog" aria-modal="true" aria-labelledby="librarian-title">
      <button className="librarian-drawer__backdrop" type="button" onClick={onClose} aria-label="Close detail drawer" />
      <aside className="librarian-drawer__panel" ref={panelRef}>
        <button className="librarian-drawer__close" type="button" onClick={onClose} aria-label="Close details"><X size={18} /></button>
        <div className="librarian-drawer__hero">
          <img src={posterSrc?.(item)} alt="" />
          <div><p className="archive-kicker">Librarian Detail Drawer</p><h2 id="librarian-title">{item.title}</h2><p>{metadata}</p><span className="librarian-status">{statusLabel(item.status)}</span></div>
        </div>
        <div className="librarian-actions">
          <button className="archive-btn archive-btn--primary" type="button" onClick={() => onStatus?.(item.id, item.status === 'watched' ? 'unwatched' : 'watched')}><Check size={16} /> {item.status === 'watched' ? 'Mark Unwatched' : 'Mark Watched'}</button>
          <button className="archive-btn archive-btn--ghost" type="button" onClick={() => onToggleBookmark?.(item.id)} data-active={bookmarked ? 'true' : 'false'}><Bookmark size={16} /> {bookmarked ? 'Bookmarked' : 'Bookmark'}</button>
          <button className="archive-btn archive-btn--ghost" type="button" onClick={onOpenTrailer}><PlayCircle size={16} /> Trailer</button>
          <button className="archive-btn archive-btn--ghost" type="button" onClick={() => onOpenImdb?.(item, detailData)}><Info size={16} /> IMDb</button>
        </div>
        <section className="librarian-section"><h3>Synopsis</h3><p>{detailData?.Plot || detailData?.plot || item.desc || 'No synopsis available.'}</p></section>
        <section className="librarian-section librarian-grid"><div><h3>Prerequisites</h3><p>{item.prereq || 'None listed'}</p></div><div><h3>After-credit notes</h3><p>{after?.note || (after?.connectsTo?.length ? `Connects to ${after.connectsTo.join(', ')}` : 'No important credits note listed.')}</p></div></section>
        <section className="librarian-section"><h3>Collection membership</h3><div className="librarian-tags">{collections.map((collection) => <span key={collection.id}>{collection.label}</span>)}</div></section>
        <section className="librarian-section librarian-review"><h3>Your rating & notes</h3><label><Star size={15} /> Rating<input type="number" min="0" max="10" step="0.1" value={rating ?? ''} onChange={(event) => onRating?.(item.id, Number(event.target.value))} placeholder="0-10" /></label><textarea value={review || ''} onChange={(event) => onReview?.(item.id, event.target.value)} rows={4} placeholder="Add a private review note…" /></section>
      </aside>
    </div>
  );
}
