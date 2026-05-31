import React from 'react';
import CollectionRooms from './CollectionRooms';
import './LibraryAtrium.css';

export default function LibraryAtrium({
  universe = 'mcu', collections = [], items = [], activeItems = [], currentItem, posterSrc,
  onOpenSearch, onOpenCollections, onOpenCollection, onOpenPhases, onOpenProgress,
  onOpenListView, onOpenCalendarView, onOpenDetail,
}) {
  const isDc = universe === 'dc';
  const label = isDc ? 'DC' : 'Marvel';
  const watched = activeItems.filter(item => item.status === 'watched').length;
  const total = activeItems.length;
  const pct = total ? Math.round((watched / total) * 100) : 0;
  const actions = [
    { id: 'search', title: 'Search', meta: 'Find any title', icon: '🔎', onClick: onOpenSearch },
    { id: 'collections', title: 'Collections', meta: `${collections.length} curated rooms`, icon: '🗂️', onClick: onOpenCollections },
    { id: 'timeline', title: 'Timeline / Phases', meta: 'Browse by release group', icon: '🧭', onClick: onOpenPhases },
    { id: 'progress', title: 'Progress / Analytics', meta: `${pct}% complete`, icon: '📊', onClick: onOpenProgress },
    { id: 'list', title: 'List View', meta: 'Open Home list', icon: '☰', onClick: onOpenListView },
    { id: 'calendar', title: 'Calendar View', meta: 'Open Home calendar', icon: '📅', onClick: onOpenCalendarView },
  ];

  return (
    <section className="library-atrium" aria-labelledby="library-atrium-title">
      <header className="library-atrium__hero">
        <div>
          <p className="library-atrium__kicker">{isDc ? 'Watchtower Archive' : 'Timeline Archive'}</p>
          <h2 id="library-atrium-title">{label} Library</h2>
          <p>A hub for search, collections, timeline routing, progress analytics, and quick access back to the Home list or calendar.</p>
        </div>
        <div className="library-atrium__progress" aria-label={`${watched} of ${total} titles watched`}>
          <span>{pct}%</span>
          <small>{watched}/{total} watched</small>
        </div>
      </header>

      {currentItem && (
        <button type="button" className="library-continue" onClick={() => onOpenDetail?.(currentItem)}>
          {posterSrc && <img src={posterSrc(currentItem)} alt="" loading="lazy" decoding="async" />}
          <span><strong>Continue Watching</strong><em>{currentItem.title}</em></span>
        </button>
      )}

      <div className="library-atrium__actions" aria-label="Library quick actions">
        {actions.map(action => (
          <button key={action.id} type="button" className="library-card" onClick={action.onClick}>
            <span className="library-card__icon" aria-hidden="true">{action.icon}</span>
            <span><strong>{action.title}</strong><em>{action.meta}</em></span>
          </button>
        ))}
      </div>

      <section className="library-atrium__collections" aria-labelledby="library-collections-title">
        <div className="library-atrium__section-head">
          <div>
            <p className="library-atrium__kicker">Curated collections</p>
            <h3 id="library-collections-title">Start with a category</h3>
          </div>
          <button type="button" className="fpill" onClick={onOpenCollections}>View all Collections</button>
        </div>
        <CollectionRooms collections={collections} items={items} universe={universe} posterSrc={posterSrc} onSelectCollection={onOpenCollection} variant="library" />
      </section>
    </section>
  );
}
