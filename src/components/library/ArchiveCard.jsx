import React from 'react';
import { Bookmark, Check, Clock, EyeOff, Heart, Info, PlayCircle, Star } from '../../constants/icons.jsx';
import { estimateRuntime, statusLabel, typeLabel } from './archiveUtils.js';

const StatusIcon = ({ status }) => {
  if (status === 'watched') return <Check size={14} />;
  if (status === 'watching') return <PlayCircle size={14} />;
  if (status === 'plan-to-watch') return <Bookmark size={14} />;
  if (status === 'on-hold') return <Clock size={14} />;
  return <EyeOff size={14} />;
};

export default function ArchiveCard({
  item,
  variant = 'grid',
  posterSrc,
  bookmarked,
  rating,
  onOpen,
  onToggleBookmark,
  onStatus,
}) {
  const src = posterSrc?.(item);
  const phaseLabel = item.phase ? `Phase ${item.phase}` : 'Archive';
  const watched = item.status === 'watched';

  return (
    <article className={`archive-card archive-card--${variant}`} data-status={item.status} data-watched={watched ? 'true' : 'false'}>
      <button className="archive-card__hit" type="button" onClick={() => onOpen?.(item)} aria-label={`Open ${item.title} details`}>
        <span className="archive-card__posterWrap">
          {src ? <img className="archive-card__poster" src={src} alt="" loading={variant === 'hero' ? 'eager' : 'lazy'} decoding="async" /> : <span className="archive-card__poster archive-card__poster--empty" />}
          {watched && <span className="archive-card__watched"><Check size={16} /> Watched</span>}
          <span className="archive-card__shine" />
        </span>
        <span className="archive-card__body">
          <span className="archive-card__eyebrow">{item.year || 'TBA'} · {typeLabel(item.type)} · {phaseLabel}</span>
          <strong className="archive-card__title">{item.title}</strong>
          <span className="archive-card__meta">
            <span><StatusIcon status={item.status} /> {statusLabel(item.status)}</span>
            <span><Clock size={13} /> {estimateRuntime(item)}</span>
            {item.essential && <span><Star size={13} /> Essential</span>}
          </span>
          {variant === 'hero' && <span className="archive-card__desc">{item.desc}</span>}
        </span>
      </button>
      <div className="archive-card__actions" aria-label={`${item.title} quick actions`}>
        <button type="button" className="archive-icon-btn" data-active={bookmarked ? 'true' : 'false'} onClick={() => onToggleBookmark?.(item.id)} aria-label={bookmarked ? `Remove ${item.title} bookmark` : `Bookmark ${item.title}`}><Bookmark size={15} /></button>
        <button type="button" className="archive-icon-btn" onClick={() => onStatus?.(item.id, watched ? 'unwatched' : 'watched')} aria-label={watched ? `Mark ${item.title} unwatched` : `Mark ${item.title} watched`}><Check size={15} /></button>
        <button type="button" className="archive-icon-btn" onClick={() => onOpen?.(item)} aria-label={`More actions for ${item.title}`}><Info size={15} /></button>
      </div>
      {rating ? <span className="archive-card__rating"><Heart size={12} /> {Number(rating).toFixed(1)}</span> : null}
    </article>
  );
}
