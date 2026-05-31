import React from 'react';
import { Bookmark, Check, Clock, EyeOff, Info, PlayCircle, Star } from '../../constants/icons.jsx';
import './ArchiveCard.css';

const STATUS_LABELS = {
  watched: 'Completed',
  watching: 'Watching',
  'plan-to-watch': 'Watchlist',
  'on-hold': 'Paused',
  dropped: 'Dropped',
  unwatched: 'Unwatched',
};

const TYPE_LABELS = { film: 'Film', series: 'Series', short: 'Short' };

const runtimeLabel = (item = {}) => {
  if (item.runtime) return `${item.runtime} min`;
  if (item.episodes) return `${item.episodes} eps`;
  if (item.type === 'film') return 'Feature';
  return TYPE_LABELS[item.type] || 'Title';
};

export default function ArchiveCard({
  item,
  poster,
  rating,
  status,
  isBookmarked = false,
  isWatched = false,
  releaseStatus,
  variant = 'shelf',
  selected = false,
  onOpenDetail,
  onSetStatus,
  onToggleBookmark,
}) {
  if (!item) return null;
  const activeStatus = status || item.status || 'unwatched';
  const phaseLabel = item.phase ? `Phase ${item.phase}` : 'Archive';
  const displayRating = rating && rating !== 'N/A' ? rating : null;

  return (
    <article
      className={`archive-card archive-card--${variant}${isWatched ? ' is-watched' : ''}${selected ? ' is-selected' : ''}`}
      data-status={activeStatus}
    >
      <button className="archive-card__poster-btn" type="button" onClick={() => onOpenDetail?.(item)} aria-label={`Open ${item.title} details`}>
        <div className="archive-card__poster-wrap">
          {poster ? <img className="archive-card__poster" src={poster} alt={`${item.title} poster`} loading={variant === 'hero' ? 'eager' : 'lazy'} /> : <div className="archive-card__poster archive-card__poster--fallback">{item.title}</div>}
          {isWatched && <span className="archive-card__watched"><Check size={14} /> Watched</span>}
          {isBookmarked && <span className="archive-card__pin" title="Bookmarked"><Bookmark size={13} /></span>}
          <span className="archive-card__hover"><Info size={15} /> Inspect</span>
        </div>
      </button>

      <div className="archive-card__body">
        <div className="archive-card__chips" aria-label="Title metadata">
          <span className="archive-chip archive-chip--phase">{phaseLabel}</span>
          <span className={`archive-chip archive-chip--release is-${releaseStatus || 'unknown'}`}>{releaseStatus || 'TBA'}</span>
        </div>
        <button className="archive-card__title" type="button" onClick={() => onOpenDetail?.(item)}>{item.title}</button>
        <div className="archive-card__meta">
          <span>{item.year || 'TBA'}</span>
          <span>{TYPE_LABELS[item.type] || item.type || 'Title'}</span>
          <span>{runtimeLabel(item)}</span>
          {displayRating && <span><Star size={11} /> {displayRating}</span>}
        </div>
        {variant !== 'compact' && item.desc && <p className="archive-card__desc">{item.desc}</p>}
        <div className="archive-card__actions">
          <button className="archive-card__quick" type="button" onClick={() => onSetStatus?.(item.id, activeStatus === 'watched' ? 'unwatched' : 'watched')}>
            {activeStatus === 'watched' ? <EyeOff size={13} /> : <Check size={13} />}
            {activeStatus === 'watched' ? 'Unwatch' : 'Watched'}
          </button>
          <button className="archive-card__quick" type="button" onClick={() => onSetStatus?.(item.id, activeStatus === 'watching' ? 'unwatched' : 'watching')}>
            <PlayCircle size={13} /> {activeStatus === 'watching' ? 'Stop' : 'Start'}
          </button>
          <button className={`archive-card__quick ${isBookmarked ? 'is-active' : ''}`} type="button" onClick={() => onToggleBookmark?.(item.id)} aria-pressed={isBookmarked}>
            <Bookmark size={13} /> Pin
          </button>
        </div>
      </div>
      <div className="archive-card__status-line"><Clock size={11} /> {STATUS_LABELS[activeStatus] || activeStatus}</div>
    </article>
  );
}
