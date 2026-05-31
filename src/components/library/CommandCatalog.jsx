import React, { useMemo, useState } from 'react';
import { Search, SlidersH, X } from '../../constants/icons.jsx';
import { collectionMatchesItem, getVisibleCollectionRooms } from '../../data/libraryCollections.js';
import { matchesSearch } from '../../utils/searchUtils.js';
import ArchiveCard from './ArchiveCard.jsx';
import './CommandCatalog.css';

const TYPE_OPTIONS = [['film', 'Films'], ['series', 'Series'], ['short', 'Shorts']];
const STATUS_OPTIONS = [['watched', 'Completed'], ['watching', 'Watching'], ['plan-to-watch', 'Watchlist'], ['unwatched', 'Unwatched']];
const RUNTIME_OPTIONS = [['short', '< 60m'], ['feature', 'Feature'], ['long', 'Long / Series']];
const RELEASE_OPTIONS = [['released', 'Released'], ['upcoming', 'Upcoming'], ['TBA', 'TBA']];

const runtimeMatches = (item, value) => {
  if (!value) return true;
  const minutes = item.runtime || (item.episodes ? item.episodes * 42 : item.type === 'film' ? 140 : 0);
  if (value === 'short') return minutes && minutes < 60;
  if (value === 'feature') return minutes >= 60 && minutes <= 180;
  if (value === 'long') return minutes > 180 || item.type === 'series';
  return true;
};

export default function CommandCatalog({
  items = [],
  universe = 'mcu',
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
  phases = [],
  releaseStatusFor,
  posterSrc,
  bookmarks = {},
  ratings = {},
  selectedCollectionId = '',
  onCollectionChange,
  timelineMode,
  onTimelineModeChange,
  timelineModes = [],
  onOpenDetail,
  onSetStatus,
  onToggleBookmark,
}) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [releaseFacet, setReleaseFacet] = useState('');
  const [runtimeFacet, setRuntimeFacet] = useState('');
  const rooms = getVisibleCollectionRooms(universe);
  const activeCollection = rooms.find((room) => room.id === selectedCollectionId);

  const results = useMemo(() => {
    const q = search || '';
    return items.filter((item) => {
      if (typeFilter && item.type !== typeFilter) return false;
      if (statusFilter && item.status !== statusFilter) return false;
      if (watchedOnly && item.status !== 'watched') return false;
      if (autoHideStatuses && ['watched', 'dropped'].includes(item.status)) return false;
      if (essentialOnly && !item.essential) return false;
      if (activePhase && item.phase !== activePhase) return false;
      if (releaseFacet && releaseStatusFor?.(item) !== releaseFacet) return false;
      if (!runtimeMatches(item, runtimeFacet)) return false;
      if (activeCollection && !collectionMatchesItem(activeCollection, item, { universe })) return false;
      return matchesSearch(item, q, {}, searchScope);
    }).sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'year') return a.year - b.year;
      if (sortBy === 'runtime') return (a.runtime || a.episodes || 0) - (b.runtime || b.episodes || 0);
      if (sortBy === 'watched') return (b.watchedDate || '').localeCompare(a.watchedDate || '');
      return a.order - b.order;
    });
  }, [items, search, searchScope, sortBy, typeFilter, statusFilter, watchedOnly, autoHideStatuses, essentialOnly, activePhase, releaseFacet, runtimeFacet, activeCollection, universe, releaseStatusFor]);

  const activeChips = [
    typeFilter && ['Type', TYPE_OPTIONS.find(([id]) => id === typeFilter)?.[1], () => onTypeFilterChange?.(null)],
    statusFilter && ['Status', STATUS_OPTIONS.find(([id]) => id === statusFilter)?.[1], () => onStatusFilterChange?.(null)],
    activePhase && ['Phase', phases.find((phase) => phase.id === activePhase)?.name || `Phase ${activePhase}`, () => onActivePhaseChange?.(0)],
    selectedCollectionId && ['Collection', activeCollection?.title || selectedCollectionId, () => onCollectionChange?.('')],
    releaseFacet && ['Release', releaseFacet, () => setReleaseFacet('')],
    runtimeFacet && ['Runtime', RUNTIME_OPTIONS.find(([id]) => id === runtimeFacet)?.[1], () => setRuntimeFacet('')],
    essentialOnly && ['Essentials', 'Only', () => onEssentialOnlyChange?.(false)],
    watchedOnly && ['Watched', 'Only', () => onWatchedOnlyChange?.(false)],
    autoHideStatuses && ['Hidden', 'Completed', () => onAutoHideStatusesChange?.(false)],
  ].filter(Boolean);

  const FacetPanel = (
    <div className="command-catalog__facets">
      <FacetGroup label="Type" options={TYPE_OPTIONS} value={typeFilter || ''} onChange={(value) => onTypeFilterChange?.(value || null)} />
      <FacetGroup label="Watch status" options={STATUS_OPTIONS} value={statusFilter || ''} onChange={(value) => onStatusFilterChange?.(value || null)} />
      <FacetGroup label="Phase" options={phases.map((phase) => [phase.id, phase.name || phase.label || `Phase ${phase.id}`])} value={activePhase || ''} onChange={(value) => onActivePhaseChange?.(Number(value) || 0)} />
      <FacetGroup label="Saga / Collection" options={rooms.map((room) => [room.id, room.title])} value={selectedCollectionId} onChange={(value) => onCollectionChange?.(value)} />
      <FacetGroup label="Release state" options={RELEASE_OPTIONS} value={releaseFacet} onChange={setReleaseFacet} />
      <FacetGroup label="Runtime" options={RUNTIME_OPTIONS} value={runtimeFacet} onChange={setRuntimeFacet} />
      <FacetGroup label="Sort / Timeline" options={[...timelineModes.map((mode) => [mode.id, mode.label]), ['title', 'Alphabetical'], ['year', 'Year'], ['runtime', 'Runtime']]} value={timelineMode || sortBy || ''} onChange={(value) => timelineModes.some((mode) => mode.id === value) ? onTimelineModeChange?.(value) : onSortChange?.(value)} />
      <div className="command-catalog__toggles">
        <button className={essentialOnly ? 'is-active' : ''} onClick={() => onEssentialOnlyChange?.(!essentialOnly)}>Essentials</button>
        <button className={watchedOnly ? 'is-active' : ''} onClick={() => onWatchedOnlyChange?.(!watchedOnly)}>Watched</button>
        <button className={autoHideStatuses ? 'is-active' : ''} onClick={() => onAutoHideStatusesChange?.(!autoHideStatuses)}>Hide completed</button>
      </div>
    </div>
  );

  return (
    <section className="command-catalog archive-surface" aria-labelledby="command-catalog-title">
      <div className="command-catalog__hero">
        <p className="library-eyebrow">Command Catalog</p>
        <h2 id="command-catalog-title">Search the archive by command, facet, or room.</h2>
        <label className="command-catalog__search">
          <Search size={20} />
          <input value={search || ''} onChange={(event) => onSearchChange?.(event.target.value)} placeholder="Search title, story brief, prerequisite, metadata…" />
          <span>{results.length} results</span>
        </label>
        <button className="command-catalog__mobile-filter" type="button" onClick={() => setMobileFiltersOpen(true)}><SlidersH size={15} /> Filters</button>
        {!!activeChips.length && <div className="command-catalog__active-chips">{activeChips.map(([kind, label, clear]) => <button key={`${kind}-${label}`} onClick={clear}>{kind}: {label}<X size={12} /></button>)}</div>}
      </div>

      <div className="command-catalog__layout">
        <aside className="command-catalog__desktop-panel">{FacetPanel}</aside>
        <div className="command-catalog__results">
          {results.length ? results.slice(0, 80).map((item) => (
            <ArchiveCard key={item.id} item={item} poster={posterSrc?.(item)} rating={ratings[item.id]?.rating || ratings[item.id]} status={item.status} isBookmarked={Boolean(bookmarks[item.id])} isWatched={item.status === 'watched'} releaseStatus={releaseStatusFor?.(item)} variant="compact" onOpenDetail={onOpenDetail} onSetStatus={onSetStatus} onToggleBookmark={onToggleBookmark} />
          )) : (
            <div className="command-catalog__empty">
              <h3>No archive records match.</h3>
              <p>Try clearing a status, phase, or collection facet. Nearby rooms: Cosmic Shelf, Essentials Only, Series Library.</p>
              <button onClick={() => { onTypeFilterChange?.(null); onStatusFilterChange?.(null); onActivePhaseChange?.(0); onCollectionChange?.(''); setReleaseFacet(''); setRuntimeFacet(''); }}>Clear scoped filters</button>
            </div>
          )}
        </div>
      </div>

      {mobileFiltersOpen && <div className="command-catalog__sheet" role="dialog" aria-modal="true" aria-label="Catalog filters"><div><button className="command-catalog__sheet-close" onClick={() => setMobileFiltersOpen(false)}><X size={16} /></button>{FacetPanel}<button className="command-catalog__show-results" onClick={() => setMobileFiltersOpen(false)}>Show {results.length} Results</button></div></div>}
    </section>
  );
}

function FacetGroup({ label, options, value, onChange }) {
  return <div className="facet-group"><span>{label}</span><div>{[[ '', 'All' ], ...options].map(([id, text]) => <button key={`${label}-${id || 'all'}`} className={String(value) === String(id) ? 'is-active' : ''} onClick={() => onChange?.(id)}>{text}</button>)}</div></div>;
}
