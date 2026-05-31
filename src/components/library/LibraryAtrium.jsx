import React, { useMemo } from 'react';
import { Bookmark, Search, Star } from '../../constants/icons.jsx';
import { collectionMatchesItem, getVisibleCollectionRooms } from '../../data/libraryCollections.js';
import ArchiveCard from './ArchiveCard.jsx';
import CollectionRooms from './CollectionRooms.jsx';
import CommandCatalog from './CommandCatalog.jsx';
import './LibraryAtrium.css';

const HERO_LIMIT = 1;

export default function LibraryAtrium({
  items = [],
  filteredItems = [],
  universe = 'mcu',
  bookmarks = {},
  ratings = {},
  phases = [],
  timelineModes = [],
  timelineMode,
  onTimelineModeChange,
  search,
  onSearchChange,
  searchScope,
  sortBy,
  onSortChange,
  typeFilter,
  onTypeFilterChange,
  statusFilter,
  onStatusFilterChange,
  activePhase,
  onActivePhaseChange,
  essentialOnly,
  onEssentialOnlyChange,
  watchedOnly,
  onWatchedOnlyChange,
  autoHideStatuses,
  onAutoHideStatusesChange,
  selectedCollectionId = '',
  onCollectionChange,
  posterSrc,
  releaseStatusFor,
  onOpenDetail,
  onSetStatus,
  onToggleBookmark,
  characterSets = {},
  afterCredits = {},
}) {
  const source = filteredItems.length || search || typeFilter || statusFilter || activePhase || selectedCollectionId ? filteredItems : items;
  const rooms = getVisibleCollectionRooms(universe);
  const activeCollection = rooms.find((room) => room.id === selectedCollectionId);
  const roomScoped = activeCollection ? source.filter((item) => collectionMatchesItem(activeCollection, item, { universe })) : source;

  const shelves = useMemo(() => {
    const recentlyWatched = [...items].filter((item) => item.status === 'watched' && item.watchedDate).sort((a, b) => (b.watchedDate || '').localeCompare(a.watchedDate || '')).slice(0, 14);
    const characterArcItems = Object.entries(characterSets).map(([id, set]) => ({ id, title: id === 'loki' ? 'Loki TVA Arc' : id === 'wanda' ? 'Wanda Maximoff Arc' : `${id} Arc`, items: items.filter((item) => set.has(item.title)).slice(0, 12) })).filter((arc) => arc.items.length);
    const phaseCollections = phases.map((phase) => ({ id: `phase-${phase.id}`, title: phase.name || phase.label || `Phase ${phase.id}`, accent: phase.color, items: items.filter((item) => item.phase === phase.id).slice(0, 12) })).filter((phase) => phase.items.length);
    return [
      { id: 'continue', title: 'Continue Watching', subtitle: 'Titles currently marked in progress.', items: items.filter((item) => item.status === 'watching') },
      { id: 'watchlist', title: 'Watchlist', subtitle: 'Planned titles waiting in your queue.', items: items.filter((item) => item.status === 'plan-to-watch') },
      { id: 'bookmarked', title: 'Pinned Collection', subtitle: 'Your bookmarked cards across the archive.', items: items.filter((item) => bookmarks[item.id]) },
      { id: 'recent', title: 'Recently Watched', subtitle: 'History sorted by latest completion.', items: recentlyWatched },
      { id: 'essentials', title: 'Essentials', subtitle: 'Core continuity and high-signal viewing.', items: items.filter((item) => item.essential).slice(0, 18) },
      { id: 'post-credit', title: 'Post-credit Important', subtitle: 'Stingers and setup worth staying through.', items: items.filter((item) => { const meta = afterCredits[item.title]; return meta?.advice === 'must' || meta?.connectsTo?.length; }).slice(0, 18) },
      ...characterArcItems.map((arc) => ({ id: `arc-${arc.id}`, title: arc.title, subtitle: 'Character point-of-view shelf.', items: arc.items })),
      ...phaseCollections.map((phase) => ({ id: phase.id, title: phase.title, subtitle: 'Phase collection facet.', items: phase.items, accent: phase.accent })),
    ].filter((shelf) => shelf.items.length);
  }, [items, bookmarks, characterSets, phases, afterCredits]);

  const heroItems = roomScoped.slice(0, HERO_LIMIT);
  const recentlyAdded = [...items].sort((a, b) => (b.year - a.year) || (b.order - a.order)).slice(0, 14);

  const renderShelf = (shelf) => (
    <section key={shelf.id} className="library-shelf archive-shelf" style={{ '--shelf-accent': shelf.accent || 'var(--theme-accent)' }}>
      <div className="library-shelf__head">
        <div>
          <p className="library-eyebrow">Shelf</p>
          <h2>{shelf.title}</h2>
          <span>{shelf.subtitle}</span>
        </div>
        <strong>{shelf.items.length}</strong>
      </div>
      <div className="library-shelf__rail">
        {shelf.items.map((item) => <ArchiveCard key={`${shelf.id}-${item.id}`} item={item} poster={posterSrc?.(item)} rating={ratings[item.id]?.rating || ratings[item.id]} status={item.status} isBookmarked={Boolean(bookmarks[item.id])} isWatched={item.status === 'watched'} releaseStatus={releaseStatusFor?.(item)} variant="shelf" onOpenDetail={onOpenDetail} onSetStatus={onSetStatus} onToggleBookmark={onToggleBookmark} />)}
      </div>
    </section>
  );

  return (
    <div className="library-atrium">
      <section className="library-atrium__hero archive-surface">
        <div className="library-atrium__hero-copy">
          <p className="library-eyebrow">Library Atrium</p>
          <h1>{universe === 'dc' ? 'Enter the DC archive.' : 'Enter the cinematic archive.'}</h1>
          <p>Browse like a media library: shelves, rooms, command search, progress, and phase facets without making phases the architecture.</p>
          <label className="library-atrium__search">
            <Search size={20} />
            <input value={search || ''} onChange={(event) => onSearchChange?.(event.target.value)} placeholder="Search the archive…" />
            <button type="button" onClick={() => onSearchChange?.(search || '')}>Catalog</button>
          </label>
          <div className="library-atrium__stats">
            <span><Star size={13} /> {items.filter((item) => item.essential).length} essentials</span>
            <span><Bookmark size={13} /> {Object.values(bookmarks).filter(Boolean).length} pinned</span>
            <span>{items.filter((item) => item.status === 'watched').length}/{items.length} watched</span>
          </div>
        </div>
        <div className="library-atrium__hero-card">
          {heroItems.map((item) => <ArchiveCard key={item.id} item={item} poster={posterSrc?.(item)} rating={ratings[item.id]?.rating || ratings[item.id]} status={item.status} isBookmarked={Boolean(bookmarks[item.id])} isWatched={item.status === 'watched'} releaseStatus={releaseStatusFor?.(item)} variant="hero" onOpenDetail={onOpenDetail} onSetStatus={onSetStatus} onToggleBookmark={onToggleBookmark} />)}
        </div>
      </section>

      <CommandCatalog items={items} universe={universe} search={search} onSearchChange={onSearchChange} searchScope={searchScope} sortBy={sortBy} onSortChange={onSortChange} typeFilter={typeFilter} onTypeFilterChange={onTypeFilterChange} statusFilter={statusFilter} onStatusFilterChange={onStatusFilterChange} activePhase={activePhase} onActivePhaseChange={onActivePhaseChange} essentialOnly={essentialOnly} onEssentialOnlyChange={onEssentialOnlyChange} watchedOnly={watchedOnly} onWatchedOnlyChange={onWatchedOnlyChange} autoHideStatuses={autoHideStatuses} onAutoHideStatusesChange={onAutoHideStatusesChange} phases={phases} releaseStatusFor={releaseStatusFor} posterSrc={posterSrc} bookmarks={bookmarks} ratings={ratings} selectedCollectionId={selectedCollectionId} onCollectionChange={onCollectionChange} timelineMode={timelineMode} onTimelineModeChange={onTimelineModeChange} timelineModes={timelineModes} onOpenDetail={onOpenDetail} onSetStatus={onSetStatus} onToggleBookmark={onToggleBookmark} />

      <CollectionRooms items={items} universe={universe} posterSrc={posterSrc} activeCollectionId={selectedCollectionId} onSelectCollection={onCollectionChange} />

      {renderShelf({ id: 'recently-added', title: 'Recently Added', subtitle: 'Newest release years and future placeholders.', items: recentlyAdded })}
      {shelves.map(renderShelf)}
    </div>
  );
}
