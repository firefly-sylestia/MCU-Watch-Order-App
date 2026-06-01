import React, { useMemo } from 'react';
import { Bookmark, Clock, Layers, Search, Star } from '../../constants/icons.jsx';
import { CHARACTER_POV_TITLE_SETS } from '../../data/timelineModes.js';
import { collectionMatchesItem, getLibraryCollections, phaseCollectionsForUniverse } from '../../data/libraryCollections.js';
import ArchiveCard from './ArchiveCard.jsx';
import CollectionRooms from './CollectionRooms.jsx';
import './LibraryAtrium.css';

function Shelf({ title, kicker, items, empty, renderItem }) {
  return (
    <section className="library-shelf archive-shelf" aria-label={title}>
      <div className="library-shelf__head"><div><p>{kicker}</p><h2>{title}</h2></div><span>{items.length} titles</span></div>
      {items.length ? <div className="library-shelf__rail">{items.map(renderItem)}</div> : <div className="library-shelf__empty">{empty}</div>}
    </section>
  );
}

export default function LibraryAtrium({
  items = [],
  filteredItems = [],
  search,
  setSearch,
  universe = 'mcu',
  phases = [],
  activeCollectionId,
  setActiveCollectionId,
  collections = getLibraryCollections(universe),
  posterSrc,
  getRating,
  releaseStatusFor,
  bookmarks = {},
  historyItems = [],
  timelineMode,
  setTimelineMode,
  timelineModes = [],
  onOpenDetail,
  onSetStatus,
  onToggleBookmark,
  onOpenCatalog,
}) {
  const source = filteredItems.length ? filteredItems : items;
  const essentials = useMemo(() => source.filter((item) => item.essential).slice(0, 18), [source]);
  const continueWatching = useMemo(() => source.filter((item) => item.status === 'watching').slice(0, 18), [source]);
  const watchlist = useMemo(() => source.filter((item) => item.status === 'plan-to-watch').slice(0, 18), [source]);
  const bookmarked = useMemo(() => source.filter((item) => bookmarks[item.id]).slice(0, 18), [source, bookmarks]);
  const recentlyAdded = useMemo(() => [...source].sort((a, b) => (b.year || 0) - (a.year || 0) || (b.order || 0) - (a.order || 0)).slice(0, 18), [source]);
  const recentlyWatched = useMemo(() => (historyItems.length ? historyItems : source.filter((item) => item.watchedDate)).slice(0, 18), [historyItems, source]);
  const postCreditImportant = useMemo(() => collections.find((collection) => collection.id === 'after-credits'), [collections]);
  const postCreditItems = useMemo(() => postCreditImportant ? source.filter((item) => collectionMatchesItem(postCreditImportant, item, { universe })).slice(0, 18) : [], [postCreditImportant, source, universe]);
  const characterArcShelves = useMemo(() => Object.entries(CHARACTER_POV_TITLE_SETS).map(([id, set]) => ({ id, title: `${id[0].toUpperCase()}${id.slice(1)} Arc`, items: source.filter((item) => set.has(item.title)).slice(0, 14) })).filter((shelf) => shelf.items.length), [source]);
  const allCollections = useMemo(() => [...collections, ...phaseCollectionsForUniverse(universe)], [collections, universe]);

  const renderCard = (variant = 'shelf') => (item) => <ArchiveCard key={item.id} item={item} poster={posterSrc?.(item)} rating={getRating?.(item)} status={item.status} isBookmarked={Boolean(bookmarks[item.id])} isWatched={item.status === 'watched'} releaseStatus={releaseStatusFor?.(item)} onOpenDetail={onOpenDetail} onSetStatus={onSetStatus} onToggleBookmark={onToggleBookmark} variant={variant} />;
  const heroItem = continueWatching[0] || watchlist[0] || essentials[0] || source[0];

  return (
    <div className="library-atrium">
      <section className="library-atrium__hero archive-surface">
        <div className="library-atrium__hero-copy">
          <p>Library Atrium</p>
          <h1>Cinematic archive for every watch path.</h1>
          <span>Phases now work as facets. Search, shelf-browse, or enter a collection room without losing your filters.</span>
          <label className="library-atrium__search">
            <Search size={19} />
            <input value={search} onChange={(event) => setSearch(event.target.value)} onFocus={onOpenCatalog} placeholder="Search the archive…" />
            <button type="button" onClick={onOpenCatalog}>Command Catalog</button>
          </label>
          <div className="library-atrium__facet-strip" aria-label="Timeline sort facet">
            <span><Layers size={13} /> Sort / POV</span>
            {timelineModes.map((mode) => <button key={mode.id} data-active={timelineMode === mode.id} onClick={() => setTimelineMode?.(mode.id)}>{mode.label}</button>)}
          </div>
        </div>
        {heroItem && <ArchiveCard item={heroItem} poster={posterSrc?.(heroItem)} rating={getRating?.(heroItem)} status={heroItem.status} isBookmarked={Boolean(bookmarks[heroItem.id])} isWatched={heroItem.status === 'watched'} releaseStatus={releaseStatusFor?.(heroItem)} onOpenDetail={onOpenDetail} onSetStatus={onSetStatus} onToggleBookmark={onToggleBookmark} variant="hero" />}
      </section>

      <div className="library-atrium__stats">
        <div><Clock size={16} /><strong>{continueWatching.length}</strong><span>Continue Watching</span></div>
        <div><Bookmark size={16} /><strong>{bookmarked.length}</strong><span>Pinned</span></div>
        <div><Star size={16} /><strong>{essentials.length}</strong><span>Essentials</span></div>
        <div><Layers size={16} /><strong>{allCollections.length}</strong><span>Rooms</span></div>
      </div>

      <Shelf title="Continue Watching" kicker="Resume" items={continueWatching} empty="Mark a title as watching to create a resume shelf." renderItem={renderCard('shelf')} />
      <Shelf title="Pinned Collection" kicker="Saved" items={bookmarked} empty="Pin titles from any card to build this collection." renderItem={renderCard('shelf')} />
      <Shelf title="Watchlist" kicker="Queued" items={watchlist} empty="Add titles to your watchlist from quick actions." renderItem={renderCard('shelf')} />
      <CollectionRooms collections={allCollections} items={items} universe={universe} posterSrc={posterSrc} activeCollectionId={activeCollectionId} onSelectCollection={(collection) => setActiveCollectionId?.(collection.id)} />
      <Shelf title="Recently Added" kicker="Fresh in archive" items={recentlyAdded} empty="No recent titles available." renderItem={renderCard('compact')} />
      <Shelf title="Essentials" kicker="Core canon" items={essentials} empty="No essential titles match current facets." renderItem={renderCard('shelf')} />
      {characterArcShelves.map((shelf) => <Shelf key={shelf.id} title={shelf.title} kicker="Character Arcs" items={shelf.items} empty="" renderItem={renderCard('compact')} />)}
      <Shelf title="Post-credit Important" kicker="Stinger map" items={postCreditItems} empty="No after-credit required titles match current facets." renderItem={renderCard('compact')} />
      <Shelf title="Recently Watched" kicker="History" items={recentlyWatched} empty="Watched history appears here once you complete titles." renderItem={renderCard('compact')} />
    </div>
  );
}
