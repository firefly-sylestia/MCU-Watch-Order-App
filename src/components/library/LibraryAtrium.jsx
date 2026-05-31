import React, { useMemo } from 'react';
import { Bookmark, Clock, Layers, PlayCircle, Search, Star } from '../../constants/icons.jsx';
import { UNIVERSE_META } from '../../constants/universeSwitch.js';
import { CHARACTER_POV_TITLE_SETS } from '../../data/timelineModes.js';
import { collectionMatchesItem, getLibraryCollections, phaseCollectionsForUniverse } from '../../data/libraryCollections.js';
import ArchiveCard from './ArchiveCard.jsx';
import CollectionRooms from './CollectionRooms.jsx';
import './LibraryAtrium.css';

function Shelf({ title, kicker, items, empty, renderItem, archive = false }) {
  return (
    <section className={`library-shelf archive-shelf${archive ? ' library-shelf--archive' : ''}`} aria-label={title}>
      <div className="library-shelf__head"><div><p>{kicker}</p><h2>{title}</h2></div><span>{items.length} titles</span></div>
      {items.length ? <div className="library-shelf__rail">{items.map(renderItem)}</div> : <div className="library-shelf__empty">{empty}</div>}
    </section>
  );
}

function EditorialCard({ item, poster, eyebrow, cta = 'Open title', onOpenDetail }) {
  if (!item) return null;
  return (
    <button type="button" className="home-editorial-card" onClick={() => onOpenDetail?.(item)}>
      <img src={poster} alt="" loading="lazy" />
      <span><small>{eyebrow}</small><strong>{item.title}</strong><em>{item.year} · {item.type}</em><b>{cta}</b></span>
    </button>
  );
}

export default function LibraryAtrium({
  mode = 'library',
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
  const postCreditImportant = useMemo(() => collections.find((collection) => collection.id === 'after-credits' || collection.id === 'dc-chronological'), [collections]);
  const postCreditItems = useMemo(() => postCreditImportant ? source.filter((item) => collectionMatchesItem(postCreditImportant, item, { universe })).slice(0, 18) : [], [postCreditImportant, source, universe]);
  const characterArcShelves = useMemo(() => Object.entries(CHARACTER_POV_TITLE_SETS).map(([id, set]) => ({ id, title: `${id[0].toUpperCase()}${id.slice(1)} Arc`, items: source.filter((item) => set.has(item.title)).slice(0, 14) })).filter((shelf) => shelf.items.length), [source]);
  const allCollections = useMemo(() => [...collections, ...phaseCollectionsForUniverse(universe)], [collections, universe]);
  const universeMeta = UNIVERSE_META[universe] || UNIVERSE_META.mcu;

  const renderCard = (variant = 'shelf') => (item) => <ArchiveCard key={item.id} item={item} poster={posterSrc?.(item)} rating={getRating?.(item)} status={item.status} isBookmarked={Boolean(bookmarks[item.id])} isWatched={item.status === 'watched'} releaseStatus={releaseStatusFor?.(item)} onOpenDetail={onOpenDetail} onSetStatus={onSetStatus} onToggleBookmark={onToggleBookmark} variant={variant} />;
  const heroItem = continueWatching[0] || watchlist[0] || essentials[0] || source[0];
  const recommended = source.find((item) => item.status !== 'watched' && item.essential) || source.find((item) => item.status !== 'watched') || source[0];
  const featuredCollection = collections.find((collection) => source.some((item) => collectionMatchesItem(collection, item, { universe }))) || collections[0];
  const featuredCollectionItems = featuredCollection ? source.filter((item) => collectionMatchesItem(featuredCollection, item, { universe })).slice(0, 6) : [];

  if (mode === 'home') {
    return (
      <div className="home-collections" data-universe={universe}>
        <section className="home-collections__hero archive-surface">
          <div className="home-collections__copy">
            <p>{universe === 'dc' ? 'Watchtower briefing' : 'Mission briefing'}</p>
            <h1>{universe === 'dc' ? 'Choose the next heroic arc.' : 'Choose your next timeline move.'}</h1>
            <span>Curated shortcuts for resuming, catching essentials, and jumping into a featured {universeMeta.title} path.</span>
            <div className="home-collections__actions">
              <button type="button" onClick={() => heroItem && onOpenDetail?.(heroItem)}><PlayCircle size={16}/>Continue</button>
              <button type="button" onClick={onOpenCatalog}><Search size={16}/>Open Library Search</button>
            </div>
          </div>
          <EditorialCard item={heroItem} poster={posterSrc?.(heroItem)} eyebrow="Up next" cta="Resume path" onOpenDetail={onOpenDetail} />
        </section>

        <div className="home-collections__grid">
          <EditorialCard item={recommended} poster={posterSrc?.(recommended)} eyebrow="Recommended next" cta="Start title" onOpenDetail={onOpenDetail} />
          <section className="home-featured-room" style={{ '--room-accent': featuredCollection?.accent || 'var(--theme-accent)' }}>
            <p>{universe === 'dc' ? 'Featured file' : 'Featured saga'}</p>
            <h2>{featuredCollection?.title || 'Essentials'}</h2>
            <span>{featuredCollection?.description || 'A curated path for your current universe.'}</span>
            <button type="button" onClick={() => featuredCollection && setActiveCollectionId?.(featuredCollection.id)}>{featuredCollectionItems.length} titles · Enter room</button>
          </section>
          <section className="home-activity-card">
            <p>Recent activity</p>
            <strong>{recentlyWatched[0]?.title || 'No watches yet'}</strong>
            <span>{recentlyWatched.length ? `${recentlyWatched.length} recent completions tracked` : 'Mark titles watched to build your activity stream.'}</span>
          </section>
        </div>

        <Shelf title={universe === 'dc' ? 'Essential case files' : 'Essential timeline picks'} kicker="Curated" items={essentials.slice(0, 10)} empty="No essential titles match your current filters." renderItem={renderCard('shelf')} />
        <Shelf title="Continue Watching" kicker="Resume" items={continueWatching} empty="Mark a title as watching to create a resume lane." renderItem={renderCard('shelf')} />
        <Shelf title="Quick entry cards" kicker="Shortcuts" items={[...watchlist, ...bookmarked, ...recentlyAdded].filter(Boolean).slice(0, 12)} empty="Add titles to your watchlist or pins for personalized shortcuts." renderItem={renderCard('compact')} />
      </div>
    );
  }

  return (
    <div className="library-atrium">
      <section className="library-atrium__hero archive-surface">
        <div className="library-atrium__hero-copy">
          <p>{universe === 'dc' ? 'DC Archive' : 'Library Atrium'}</p>
          <h1>{universe === 'dc' ? 'Complete DC chronicle catalog.' : 'Complete cinematic archive.'}</h1>
          <span>Dense browsing for phases, archive rooms, filters, collection rooms, and full-title search.</span>
          <label className="library-atrium__search">
            <Search size={19} />
            <input value={search} onChange={(event) => setSearch(event.target.value)} onFocus={onOpenCatalog} placeholder={universe === 'dc' ? 'Search DC files…' : 'Search the archive…'} />
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
        <div><Clock size={16} /><strong>{continueWatching.length}</strong><span>Continue</span></div>
        <div><Bookmark size={16} /><strong>{bookmarked.length}</strong><span>Pinned</span></div>
        <div><Star size={16} /><strong>{essentials.length}</strong><span>Essentials</span></div>
        <div><Layers size={16} /><strong>{allCollections.length}</strong><span>Rooms</span></div>
      </div>

      <CollectionRooms collections={allCollections} items={items} universe={universe} posterSrc={posterSrc} activeCollectionId={activeCollectionId} onSelectCollection={(collection) => setActiveCollectionId?.(collection.id)} />
      <Shelf archive title="Archive Room: Watchlist" kicker="Queued" items={watchlist} empty="Add titles to your watchlist from title cards." renderItem={renderCard('compact')} />
      <Shelf archive title="Archive Room: Recently Added" kicker="Catalog" items={recentlyAdded} empty="No recent titles available." renderItem={renderCard('compact')} />
      <Shelf archive title={universe === 'dc' ? 'Archive Room: Essentials' : 'Archive Room: Essentials'} kicker="Core" items={essentials} empty="No essential titles match current facets." renderItem={renderCard('compact')} />
      {universe !== 'dc' && characterArcShelves.map((shelf) => <Shelf archive key={shelf.id} title={shelf.title} kicker="Character Arcs" items={shelf.items} empty="" renderItem={renderCard('compact')} />)}
      <Shelf archive title={universe === 'dc' ? 'Chronological Case File' : 'Post-credit Important'} kicker={universe === 'dc' ? 'Order' : 'Stinger map'} items={postCreditItems} empty="No titles match this archive room." renderItem={renderCard('compact')} />
      <Shelf archive title="Recently Watched" kicker="History" items={recentlyWatched} empty="Watched history appears here once you complete titles." renderItem={renderCard('compact')} />
    </div>
  );
}
