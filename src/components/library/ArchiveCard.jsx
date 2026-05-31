import React from 'react';
import { Bookmark, Check, Clock, Eye, EyeOff, Info, PlayCircle, Star } from '../../constants/icons.jsx';

const statusLabels = {
  watched: 'Watched',
  watching: 'Watching',
  'plan-to-watch': 'Watchlist',
  'on-hold': 'On hold',
  dropped: 'Dropped',
  unwatched: 'Unwatched',
};

export default function ArchiveCard({
  item,
  variant = 'grid',
  poster,
  rating,
  bookmarked = false,
  onOpen,
  onBookmark,
  onStatus,
  onTrailer,
}) {
  const isWatched = item.status === 'watched';
  const label = statusLabels[item.status] || item.status || 'Unwatched';

  return (
    <article
      className={`archive-card archive-card--${variant}`}
      data-status={item.status || 'unwatched'}
      data-watched={isWatched ? 'true' : 'false'}
    >
      <button className="archive-card__poster" type="button" onClick={() => onOpen?.(item)} aria-label={`Open details for ${item.title}`}>
        <img src={poster} alt={`${item.title} poster`} loading={variant === 'hero' ? 'eager' : 'lazy'} decoding="async" />
        {isWatched && <span className="archive-card__watched"><Check size={13} /> Watched</span>}
        {item.releaseStatus === 'upcoming' && <span className="archive-card__release">Upcoming</span>}
      </button>

      <div className="archive-card__body">
        <div className="archive-card__eyebrow">
          <span>{item.year || 'TBA'}</span>
          <span>{item.type || 'title'}</span>
          {item.phase ? <span>Phase {item.phase}</span> : null}
        </div>
        <button className="archive-card__title" type="button" onClick={() => onOpen?.(item)}>
          {item.title}
        </button>
        {variant !== 'compact' && <p className="archive-card__desc">{item.desc || 'No archive note available yet.'}</p>}
        <div className="archive-card__meta-row">
          <span className="archive-pill archive-pill--rating"><Star size={12} /> {rating || '—'}</span>
          <span className="archive-pill"><Clock size={12} /> {label}</span>
        </div>
      </div>

      <div className="archive-card__actions" aria-label={`${item.title} quick actions`}>
        <button type="button" className="archive-icon-btn" aria-pressed={bookmarked} aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark'} onClick={() => onBookmark?.(item.id)}>
          <Bookmark size={16} fill={bookmarked ? 'currentColor' : 'none'} />
        </button>
        <button type="button" className="archive-icon-btn" aria-label={isWatched ? 'Mark unwatched' : 'Mark watched'} onClick={() => onStatus?.(item.id, isWatched ? 'unwatched' : 'watched')}>
          {isWatched ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
        {onTrailer && (
          <button type="button" className="archive-icon-btn" aria-label="Play trailer" onClick={() => onTrailer?.(item)}>
            <PlayCircle size={16} />
          </button>
        )}
        <button type="button" className="archive-icon-btn" aria-label="More details" onClick={() => onOpen?.(item)}>
          <Info size={16} />
        </button>
      </div>
    </article>
  );
}
