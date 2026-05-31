import React, { useMemo } from 'react';
import CollectionRooms from './CollectionRooms';
import './LibraryAtrium.css';

const countByType = (items, type) => items.filter(item => item.type === type).length;

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
  const label = universe === 'dc' ? 'DC' : 'Marvel';
  const stats = useMemo(() => ({
    total: activeItems.length || items.length,
    films: countByType(activeItems.length ? activeItems : items, 'film'),
    series: countByType(activeItems.length ? activeItems : items, 'series'),
    collections: collections.length,
  }), [activeItems, collections.length, items]);

  const actions = [
    { id: 'search', title: 'Search', desc: 'Find titles with the current filters and result rows.', icon: '🔎', onClick: onOpenSearch },
    { id: 'collections', title: 'Collections', desc: 'Open curated universe categories and title lists.', icon: '🗂️', onClick: onOpenCollections },
    { id: 'timeline', title: 'Timeline / Phases', desc: 'Jump into phase and timeline browsing.', icon: '🧭', onClick: onOpenPhases },
    { id: 'progress', title: 'Progress / Analytics', desc: 'Review watch stats, ratings, and momentum.', icon: '📈', onClick: onOpenProgress },
    { id: 'list', title: 'List View', desc: 'Return Home in the familiar row-based list.', icon: '☰', onClick: onOpenListView },
    { id: 'calendar', title: 'Calendar View', desc: 'Return Home with release dates grouped by time.', icon: '📅', onClick: onOpenCalendarView },
  ];

  if (currentItem) {
    actions.unshift({ id: 'continue', title: 'Continue Watching', desc: currentItem.title, icon: '▶️', onClick: () => onOpenDetail?.(currentItem) });
  }

  return (
    <section className="library-atrium" aria-label={`${label} Library`}>
      <header className="library-atrium__hero">
        <div>
          <p className="library-atrium__kicker">{label} archive hub</p>
          <h2>{label} Library</h2>
          <p>Browse search, collections, timeline tools, progress, and quick routes back to the Home list or calendar without replacing your main viewing order.</p>
        </div>
        <dl className="library-atrium__stats" aria-label="Library stats">
          <div><dt>Titles</dt><dd>{stats.total}</dd></div>
          <div><dt>Films</dt><dd>{stats.films}</dd></div>
          <div><dt>Series</dt><dd>{stats.series}</dd></div>
          <div><dt>Collections</dt><dd>{stats.collections}</dd></div>
        </dl>
      </header>

      <div className="library-atrium__actions" aria-label="Library quick actions">
        {actions.map(action => (
          <button key={action.id} type="button" className="library-card" onClick={action.onClick}>
            <span className="library-card__icon" aria-hidden="true">{action.icon}</span>
            <span className="library-card__body">
              <span className="library-card__title">{action.title}</span>
              <span className="library-card__desc">{action.desc}</span>
            </span>
          </button>
        ))}
      </div>

      <section className="library-atrium__collections" aria-label="Collection preview">
        <div className="library-atrium__section-heading">
          <div>
            <p className="library-atrium__kicker">Curated rooms</p>
            <h3>Collection categories</h3>
          </div>
          <button type="button" className="fpill" onClick={onOpenCollections}>View all collections</button>
        </div>
        <CollectionRooms
          collections={collections}
          items={activeItems.length ? activeItems : items}
          universe={universe}
          posterSrc={posterSrc}
          onSelectCollection={onOpenCollection}
          variant="library"
        />
      </section>
    </section>
  );
}
