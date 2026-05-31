import React, { useEffect, useRef } from 'react';
import { Bookmark, Check, Download, Eye, EyeOff, Heart, Info, PlayCircle, Star, Upload, X } from '../../constants/icons.jsx';
import './library.css';

export default function LibrarianDetailDrawer({
  item,
  detailData,
  loading,
  poster,
  rating,
  review,
  liked,
  bookmarked,
  trailerOptions = [],
  hasTrailerOption,
  hasTeaserOption,
  afterCredits,
  inbound = [],
  memberships = [],
  onClose,
  onStatus,
  onBookmark,
  onLike,
  onRating,
  onReview,
  onOpenTrailer,
  onSelectTrailer,
  onOpenImdb,
  onExport,
  onShare,
}) {
  const drawerRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    if (!item) return undefined;
    const previous = document.activeElement;
    window.setTimeout(() => closeRef.current?.focus(), 0);
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.();
      if (event.key !== 'Tab' || !drawerRef.current) return;
      const focusables = drawerRef.current.querySelectorAll('button, a, input, textarea, select, [tabindex]:not([tabindex="-1"])');
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previous?.focus?.();
    };
  }, [item, onClose]);

  if (!item) return null;
  const watched = item.status === 'watched';
  const plot = detailData?.Plot || detailData?.plot || item.desc || 'No story brief has been archived yet.';
  const prerequisites = Array.isArray(item.prereq || item.prerequisites)
    ? (item.prereq || item.prerequisites)
    : String(item.prereq || item.prerequisites || '')
      .split(',')
      .map(entry => entry.trim())
      .filter(Boolean);

  return (
    <div className="librarian-drawer-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose?.(); }}>
      <aside ref={drawerRef} className="librarian-drawer" role="dialog" aria-modal="true" aria-labelledby="librarian-title">
        <div className="librarian-drawer__media">
          <img src={poster} alt={`${item.title} poster`} />
          <button ref={closeRef} type="button" className="archive-icon-btn librarian-close" onClick={onClose} aria-label="Close details"><X size={18} /></button>
        </div>
        <div className="librarian-drawer__content">
          <p className="archive-kicker">Librarian dossier</p>
          <h2 id="librarian-title">{item.title}</h2>
          <div className="librarian-meta">
            <span>{item.year || 'TBA'}</span>
            <span>{item.type || 'Title'}</span>
            {item.phase ? <span>Phase {item.phase}</span> : null}
            <span><Star size={12} /> {rating || detailData?.imdbRating || '—'}</span>
          </div>

          <div className="librarian-actions">
            {hasTrailerOption && <button type="button" className="archive-primary-btn" onClick={() => { onSelectTrailer?.(trailerOptions.findIndex(option => /trailer/i.test(option?.label || option?.type || ''))); onOpenTrailer?.(); }}><PlayCircle size={16} /> Trailer</button>}
            {hasTeaserOption && <button type="button" className="archive-secondary-btn" onClick={() => { onSelectTrailer?.(trailerOptions.findIndex(option => /teaser/i.test(option?.label || option?.type || ''))); onOpenTrailer?.(); }}><PlayCircle size={16} /> Teaser</button>}
            {!hasTrailerOption && !hasTeaserOption && trailerOptions.length > 0 && <button type="button" className="archive-primary-btn" onClick={onOpenTrailer}><PlayCircle size={16} /> Play Media</button>}
            <button type="button" className="archive-secondary-btn" onClick={() => onOpenImdb?.(item, detailData)}><Info size={16} /> IMDb</button>
          </div>

          <section className="librarian-panel">
            <h3>Story Brief</h3>
            {loading ? <p>Loading metadata…</p> : <p>{plot}</p>}
          </section>

          <section className="librarian-panel librarian-panel--grid">
            <button type="button" onClick={() => onStatus?.(item.id, watched ? 'unwatched' : 'watched')}><span>{watched ? <EyeOff size={16} /> : <Eye size={16} />}</span>{watched ? 'Mark unwatched' : 'Mark watched'}</button>
            <button type="button" aria-pressed={bookmarked} onClick={() => onBookmark?.(item.id)}><span><Bookmark size={16} /></span>{bookmarked ? 'Bookmarked' : 'Bookmark'}</button>
            <button type="button" aria-pressed={liked} onClick={onLike}><span><Heart size={16} /></span>{liked ? 'Liked' : 'Like'}</button>
            <button type="button" onClick={() => onShare?.(item, { share: true })}><span><Upload size={16} /></span>Share card</button>
            <button type="button" onClick={() => onExport?.(item)}><span><Download size={16} /></span>Export card</button>
          </section>

          <section className="librarian-panel">
            <h3>Your Rating & Review</h3>
            <label className="librarian-rating">Rating out of 10<input type="number" min="0" max="10" step="0.5" value={rating || ''} onChange={event => onRating?.(item.id, event.target.value)} /></label>
            <textarea value={review || ''} onChange={event => onReview?.(item.id, event.target.value)} placeholder="Add a private archive note…" rows={3} />
          </section>

          <section className="librarian-panel">
            <h3>Prerequisites</h3>
            <div className="librarian-chip-row">{prerequisites.length ? prerequisites.map(node => <span key={node}>{node}</span>) : <span>No prerequisite chain recorded.</span>}</div>
          </section>

          <section className="librarian-panel">
            <h3>After-Credit Notes</h3>
            <p>{afterCredits?.note || afterCredits?.notes || 'No after-credit note recorded.'}</p>
            <div className="librarian-chip-row">{afterCredits?.connectsTo?.length ? afterCredits.connectsTo.map(node => <span key={node}><Check size={12} /> {node}</span>) : <span>No outgoing setup tracked.</span>}</div>
            {!!inbound.length && <div className="librarian-chip-row">{inbound.map(node => <span key={node}>Incoming: {node}</span>)}</div>}
          </section>

          <section className="librarian-panel">
            <h3>Collection Membership</h3>
            <div className="librarian-chip-row">{memberships.length ? memberships.map(name => <span key={name}>{name}</span>) : <span>General Archive</span>}</div>
          </section>
        </div>
      </aside>
    </div>
  );
}
