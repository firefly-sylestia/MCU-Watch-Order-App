import React from 'react';
import CollectionRooms from './CollectionRooms';
import './LibraryAtrium.css';

const universeCopy = {
  mcu: {
    eyebrow: 'Marvel Archive',
    title: 'Marvel Library',
    subtitle: 'A focused hub for search, collections, timeline phases, progress, and quick access back to the current list or calendar experience.',
  },
  dc: {
    eyebrow: 'DC Archive',
    title: 'DC Library',
    subtitle: 'A Watchtower hub for search, collections, timeline eras, progress, and quick access back to the current list or calendar experience.',
  },
};

export default function LibraryAtrium({
  universe = 'mcu',
  collections = [],
  items = [],
  activeItems = [],
  currentItem,
  posterSrc,
  onOpenSearch,
  onOpenCollections,
  onOpenCollection,
  onOpenPhases,
  onOpenProgress,
  onOpenListView,
  onOpenCalendarView,
  onOpenDetail,
}) {
  const copy = universeCopy[universe === 'dc' ? 'dc' : 'mcu'];
  const completedCount = activeItems.filter((item) => item.status === 'watched').length;
  const progressPercent = activeItems.length ? Math.round((completedCount / activeItems.length) * 100) : 0;

  const actions = [
    { key: 'search', label: 'Search', desc: 'Find any title with the existing search filters.', onClick: onOpenSearch },
    { key: 'collections', label: 'Collections', desc: 'Browse curated universe categories.', onClick: onOpenCollections },
    { key: 'timeline', label: universe === 'dc' ? 'Timeline / Eras' : 'Timeline / Phases', desc: 'Jump into the current phase timeline tools.', onClick: onOpenPhases },
    { key: 'progress', label: 'Progress / Analytics', desc: `${completedCount}/${activeItems.length} complete · ${progressPercent}%`, onClick: onOpenProgress },
    { key: 'list', label: 'List View', desc: 'Return Home with the current list rows.', onClick: onOpenListView },
    { key: 'calendar', label: 'Calendar View', desc: 'Return Home with the release calendar.', onClick: onOpenCalendarView },
  ];

  return (
    <section className="library-atrium" aria-labelledby="library-atrium-title" data-universe={universe}>
      <header className="library-atrium__hero">
        <div className="library-atrium__hero-copy">
          <p className="library-atrium__eyebrow">{copy.eyebrow}</p>
          <h2 id="library-atrium-title">{copy.title}</h2>
          <p>{copy.subtitle}</p>
        </div>
        <div className="library-atrium__stats" aria-label="Library progress summary">
          <strong>{progressPercent}%</strong>
          <span>{completedCount} of {activeItems.length} watched</span>
        </div>
      </header>

      <div className="library-atrium__actions" aria-label="Library quick actions">
        {currentItem && (
          <button type="button" className="library-card library-card--continue" onClick={() => onOpenDetail?.(currentItem)}>
            <span className="library-card__kicker">Continue Watching</span>
            <span className="library-card__title">{currentItem.title}</span>
            <span className="library-card__desc">Open the existing detail drawer for your next in-progress title.</span>
            {posterSrc?.(currentItem) && <img src={posterSrc(currentItem)} alt="" loading="lazy" />}
          </button>
        )}
        {actions.map((action) => (
          <button key={action.key} type="button" className="library-card" onClick={action.onClick}>
            <span className="library-card__kicker">Open</span>
            <span className="library-card__title">{action.label}</span>
            <span className="library-card__desc">{action.desc}</span>
          </button>
        ))}
      </div>

      <section className="library-atrium__collections" aria-labelledby="library-collections-title">
        <div className="library-atrium__section-head">
          <div>
            <p className="library-atrium__eyebrow">Curated Rooms</p>
            <h3 id="library-collections-title">Collections</h3>
          </div>
          <button type="button" className="fpill" onClick={onOpenCollections}>View all collections</button>
        </div>
        <CollectionRooms
          collections={collections}
          items={items}
          universe={universe}
          posterSrc={posterSrc}
          onSelectCollection={onOpenCollection}
          variant="library"
        />
      </section>
    </section>
  );
}
