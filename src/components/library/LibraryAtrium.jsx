import React, { useMemo } from 'react';
import { Bookmark, Clock, Film, Layers, Search, Star, Zap } from '../../constants/icons.jsx';
import { CHARACTER_POV_TITLE_SETS } from '../../data/timelineModes.js';
import { collectionMatchesItem, getLibraryCollections, phaseCollectionsForUniverse } from '../../data/libraryCollections.js';
import { UNIVERSE_META } from '../../constants/universeSwitch.js';
import ArchiveCard from './ArchiveCard.jsx';
import CollectionRooms from './CollectionRooms.jsx';
import './LibraryAtrium.css';

function Shelf({ title, kicker, items, empty, renderItem, dense = false }) {
  return (
    <section className={`library-shelf archive-shelf ${dense ? 'library-shelf--dense' : ''}`} aria-label={title}>
      <div className="library-shelf__head"><div><p>{kicker}</p><h2>{title}</h2></div><span>{items.length} titles</span></div>
      {items.length ? <div className="library-shelf__rail">{items.map(renderItem)}</div> : <div className="library-shelf__empty">{empty}</div>}
    </section>
  );
}

function ArchiveRoomGrid({ phases = [], collections = [], universe, items, activeCollectionId, setActiveCollectionId }) {
  const phaseLabel = universe === 'dc' ? 'Chapters' : 'Phases';
  return (
    <section className="library-archive-rooms archive-shelf" aria-label="Archive rooms">
      <div className="library-shelf__head"><div><p>Archive Rooms</p><h2>{phaseLabel}, categories, and catalog lanes</h2></div><span>{phases.length + collections.length} rooms</span></div>
      <div className="library-archive-rooms__grid">
        {phases.map(phase => {
          const count = items.filter(item => item.phase === phase.id).length;
          return <button key={phase.id} type="button" className="library-archive-room" style={{ '--room-accent': phase.color }} onClick={() => setActiveCollectionId?.(`phase-${phase.id}`)} data-active={activeCollectionId === `phase-${phase.id}`}><span>{phase.id}</span><strong>{phase.name}</strong><small>{count} titles · {phase.tagline || phase.summary || phaseLabel}</small></button>;
        })}
        {collections.slice(0, 6).map(collection => {
          const count = items.filter(item => collectionMatchesItem(collection, item, { universe })).length;
          return <button key={collection.id} type="button" className="library-archive-room" style={{ '--room-accent': collection.accent }} onClick={() => setActiveCollectionId?.(collection.id)} data-active={activeCollectionId === collection.id}><span>{collection.icon}</span><strong>{collection.title}</strong><small>{count} titles · {collection.sortMode}</small></button>;
        })}
      </div>
    </section>
  );
}

export default function LibraryAtrium({
  mode = 'home',
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
  const meta = UNIVERSE_META[universe] || UNIVERSE_META.mcu;
  const essentials = useMemo(() => source.filter((item) => item.essential).slice(0, 18), [source]);
  const continueWatching = useMemo(() => source.filter((item) => item.status === 'watching').slice(0, 18), [source]);
  const watchlist = useMemo(() => source.filter((item) => item.status === 'plan-to-watch').slice(0, 18), [source]);
  const bookmarked = useMemo(() => source.filter((item) => bookmarks[item.id]).slice(0, 18), [source, bookmarks]);
  const recentlyAdded = useMemo(() => [...source].sort((a, b) => (b.year || 0) - (a.year || 0) || (b.order || 0) - (a.order || 0)).slice(0, 24), [source]);
  const recentlyWatched = useMemo(() => (historyItems.length ? historyItems : source.filter((item) => item.watchedDate)).slice(0, 18), [historyItems, source]);
  const postCreditImportant = useMemo(() => collections.find((collection) => collection.id === 'after-credits'), [collections]);
  const postCreditItems = useMemo(() => postCreditImportant ? source.filter((item) => collectionMatchesItem(postCreditImportant, item, { universe })).slice(0, 18) : [], [postCreditImportant, source, universe]);
  const characterArcShelves = useMemo(() => Object.entries(CHARACTER_POV_TITLE_SETS).map(([id, set]) => ({ id, title: `${id[0].toUpperCase()}${id.slice(1)} Arc`, items: source.filter((item) => set.has(item.title)).slice(0, 14) })).filter((shelf) => shelf.items.length), [source]);
  const allCollections = useMemo(() => [...collections, ...phaseCollectionsForUniverse(universe)], [collections, universe]);
  const heroItem = continueWatching[0] || watchlist[0] || essentials[0] || source[0];
  const recommended = source.find(item => item.status !== 'watched' && item.essential) || source.find(item => item.status !== 'watched') || source[0];
  const featuredCollection = collections.find(collection => source.some(item => collectionMatchesItem(collection, item, { universe }))) || collections[0];
  const featuredItems = featuredCollection ? source.filter(item => collectionMatchesItem(featuredCollection, item, { universe })).slice(0, 5) : [];

  const renderCard = (variant = 'shelf') => (item) => <ArchiveCard key={item.id} item={item} poster={posterSrc?.(item)} rating={getRating?.(item)} status={item.status} isBookmarked={Boolean(bookmarks[item.id])} isWatched={item.status === 'watched'} releaseStatus={releaseStatusFor?.(item)} onOpenDetail={onOpenDetail} onSetStatus={onSetStatus} onToggleBookmark={onToggleBookmark} variant={variant} />;

  if (mode === 'home') {
    return (
      <div className="home-collections" data-universe={universe === 'dc' ? 'dc' : 'mcu'}>
        <section className="home-collections__hero archive-surface">
          <div className="home-collections__copy">
            <p>{universe === 'dc' ? 'Curated Watchtower Briefing' : 'Curated Timeline Briefing'}</p>
            <h1>{universe === 'dc' ? 'What heroic arc should you enter next?' : 'What should you watch next?'}</h1>
            <span>{universe === 'dc' ? 'Personalized shortcuts across Gotham cases, Metropolis files, League paths, and Elseworlds.' : 'Personalized shortcuts across continue watching, essentials, sagas, recent activity, and collection rooms.'}</span>
            <div className="home-collections__actions">
              <button type="button" onClick={() => recommended && onOpenDetail?.(recommended)}><Zap size={16} /> Recommended next</button>
              <button type="button" onClick={onOpenCatalog}><Search size={16} /> Search archive</button>
            </div>
          </div>
          {heroItem && <ArchiveCard item={heroItem} poster={posterSrc?.(heroItem)} rating={getRating?.(heroItem)} status={heroItem.status} isBookmarked={Boolean(bookmarks[heroItem.id])} isWatched={heroItem.status === 'watched'} releaseStatus={releaseStatusFor?.(heroItem)} onOpenDetail={onOpenDetail} onSetStatus={onSetStatus} onToggleBookmark={onToggleBookmark} variant="hero" />}
        </section>

        <div className="home-collections__next-grid">
          <button type="button" onClick={() => (continueWatching[0] || recommended) && onOpenDetail?.(continueWatching[0] || recommended)}><span><Clock size={16} /> Continue</span><strong>{continueWatching[0]?.title || recommended?.title || 'All caught up'}</strong><small>{continueWatching.length || 0} active titles</small></button>
          <button type="button" onClick={() => recommended && onOpenDetail?.(recommended)}><span><Star size={16} /> Recommended</span><strong>{recommended?.title || 'No recommendation yet'}</strong><small>{meta.title} priority path</small></button>
          <button type="button" onClick={onOpenCatalog}><span><Search size={16} /> Quick Entry</span><strong>Open catalog search</strong><small>Search, filter, sort</small></button>
        </div>

        {featuredCollection && <section className="home-featured-room archive-shelf" style={{ '--room-accent': featuredCollection.accent }}>
          <div><p>Featured Collection</p><h2>{featuredCollection.title}</h2><span>{featuredCollection.description}</span></div>
          <div className="home-featured-room__posters">{featuredItems.map(item => <button key={item.id} type="button" onClick={() => onOpenDetail?.(item)}><img src={posterSrc?.(item)} alt={`${item.title} poster`} /><span>{item.title}</span></button>)}</div>
        </section>}

        <Shelf title="Continue Watching" kicker="Resume" items={continueWatching} empty="Start a title to create a personalized continue lane." renderItem={renderCard('shelf')} />
        <Shelf title={universe === 'dc' ? 'Essentials Path' : 'Essentials Path'} kicker={universe === 'dc' ? 'Core hero arcs' : 'Core saga'} items={essentials} empty="No essential titles match your current view." renderItem={renderCard('shelf')} />
        <Shelf title="Recent Activity" kicker="Personal" items={recentlyWatched} empty="Completed titles and recent activity will appear here." renderItem={renderCard('compact')} />
      </div>
    );
  }

  return (
    <div className="library-atrium" data-universe={universe === 'dc' ? 'dc' : 'mcu'}>
      <section className="library-atrium__hero archive-surface">
        <div className="library-atrium__hero-copy">
          <p>{universe === 'dc' ? 'DC Archive Catalog' : 'Library Archive Catalog'}</p>
          <h1>{universe === 'dc' ? 'Browse the complete DC chronicle.' : 'Browse the complete cinematic archive.'}</h1>
          <span>{universe === 'dc' ? 'Dense archive rooms for Gotham files, Metropolis records, Justice League paths, Elseworlds, and DC chapters.' : 'Dense archive rooms for phases, sagas, categories, filters, sort modes, and every catalog entry.'}</span>
          <label className="library-atrium__search">
            <Search size={19} />
            <input value={search} onChange={(event) => setSearch(event.target.value)} onFocus={onOpenCatalog} placeholder={universe === 'dc' ? 'Search the DC archive…' : 'Search the archive…'} />
            <button type="button" onClick={onOpenCatalog}>Command Catalog</button>
          </label>
          <div className="library-atrium__facet-strip" aria-label="Timeline sort facet">
            <span><Layers size={13} /> Sort / POV</span>
            {timelineModes.map((mode) => <button key={mode.id} data-active={timelineMode === mode.id} onClick={() => setTimelineMode?.(mode.id)}>{mode.label}</button>)}
          </div>
        </div>
        <ArchiveRoomGrid phases={phases} collections={collections} universe={universe} items={items} activeCollectionId={activeCollectionId} setActiveCollectionId={setActiveCollectionId} />
      </section>

      <div className="library-atrium__stats">
        <div><Film size={16} /><strong>{source.length}</strong><span>Total Archive</span></div>
        <div><Bookmark size={16} /><strong>{bookmarked.length}</strong><span>Pinned</span></div>
        <div><Star size={16} /><strong>{essentials.length}</strong><span>{universe === 'dc' ? 'Core Arcs' : 'Essentials'}</span></div>
        <div><Layers size={16} /><strong>{allCollections.length}</strong><span>Rooms</span></div>
      </div>

      <CollectionRooms collections={allCollections} items={items} universe={universe} posterSrc={posterSrc} activeCollectionId={activeCollectionId} onSelectCollection={(collection) => setActiveCollectionId?.(collection.id)} />
      <Shelf dense title="Recently Added" kicker="Archive feed" items={recentlyAdded} empty="No recent titles available." renderItem={renderCard('compact')} />
      <Shelf dense title="Pinned Records" kicker="Saved" items={bookmarked} empty="Pin titles from any card to build this archive shelf." renderItem={renderCard('compact')} />
      <Shelf dense title={universe === 'dc' ? 'Core DC Files' : 'Essentials'} kicker={universe === 'dc' ? 'Continuity anchors' : 'Core canon'} items={essentials} empty="No essential titles match current facets." renderItem={renderCard('compact')} />
      {characterArcShelves.map((shelf) => <Shelf dense key={shelf.id} title={shelf.title} kicker="Character Arcs" items={shelf.items} empty="" renderItem={renderCard('compact')} />)}
      <Shelf dense title={universe === 'dc' ? 'Recent Watch History' : 'Post-credit Important'} kicker={universe === 'dc' ? 'History' : 'Stinger map'} items={universe === 'dc' ? recentlyWatched : postCreditItems} empty={universe === 'dc' ? 'Watched history appears here once you complete titles.' : 'No after-credit required titles match current facets.'} renderItem={renderCard('compact')} />
    </div>
  );
}
