import React, { useMemo, useState } from 'react';
import { Check, Search, SlidersH, X } from '../../constants/icons.jsx';
import ArchiveCard from './ArchiveCard.jsx';
import { COLLECTIONS, DC_COLLECTION, statusLabel, typeLabel } from './archiveUtils.js';

const STATUSES = ['unwatched', 'watching', 'plan-to-watch', 'watched', 'on-hold', 'dropped'];
const TYPES = ['film', 'series', 'short'];

export default function CommandCatalog(props) {
  const {
    filtered,
    activeItems,
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    releaseFilter,
    setReleaseFilter,
    activePhase,
    setActivePhase,
    currentPhases,
    universe,
    posterSrc,
    bookmarks,
    myRating,
    toggleBookmark,
    setStatusDirect,
    openDetail,
  } = props;
  const [mobileFilters, setMobileFilters] = useState(false);
  const collections = universe === 'dc' ? [DC_COLLECTION] : COLLECTIONS;
  const activeChips = [
    search && { id: 'search', label: `“${search}”`, clear: () => setSearch('') },
    typeFilter && { id: 'type', label: typeLabel(typeFilter), clear: () => setTypeFilter(null) },
    statusFilter && { id: 'status', label: statusLabel(statusFilter), clear: () => setStatusFilter(null) },
    releaseFilter !== 'all' && { id: 'release', label: releaseFilter, clear: () => setReleaseFilter('all') },
    activePhase ? { id: 'phase', label: `Phase ${activePhase}`, clear: () => setActivePhase(0) } : null,
  ].filter(Boolean);

  const counts = useMemo(() => ({
    essentials: activeItems.filter((i) => i.essential).length,
    watched: activeItems.filter((i) => i.status === 'watched').length,
    results: filtered.length,
  }), [activeItems, filtered]);

  const Filters = () => (
    <div className="command-facets">
      <section><h3>Type</h3><div>{TYPES.map((type) => <button key={type} type="button" data-active={typeFilter === type ? 'true' : 'false'} onClick={() => setTypeFilter(typeFilter === type ? null : type)}>{typeLabel(type)}</button>)}</div></section>
      <section><h3>Status</h3><div>{STATUSES.map((status) => <button key={status} type="button" data-active={statusFilter === status ? 'true' : 'false'} onClick={() => setStatusFilter(statusFilter === status ? null : status)}>{statusLabel(status)}</button>)}</div></section>
      <section><h3>Phase</h3><div><button type="button" data-active={!activePhase ? 'true' : 'false'} onClick={() => setActivePhase(0)}>All</button>{currentPhases.map((phase) => <button key={phase.id} type="button" data-active={activePhase === phase.id ? 'true' : 'false'} onClick={() => setActivePhase(activePhase === phase.id ? 0 : phase.id)}>{phase.name || `Phase ${phase.id}`}</button>)}</div></section>
      <section><h3>Collection</h3><div>{collections.map((collection) => <button key={collection.id} type="button" onClick={() => { setSearch(collection.label); setMobileFilters(false); }}>{collection.label}</button>)}</div></section>
      <section><h3>Release State</h3><div>{['all', 'released', 'upcoming'].map((state) => <button key={state} type="button" data-active={releaseFilter === state ? 'true' : 'false'} onClick={() => setReleaseFilter(state)}>{state}</button>)}</div></section>
      <section><h3>Rating / Runtime / Essentials</h3><div><button type="button" onClick={() => setSearch('essential')}>Essentials ({counts.essentials})</button><button type="button" onClick={() => setSearch('film')}>Feature Runtime</button><button type="button" onClick={() => setSearch('series')}>Series Runtime</button><button type="button" onClick={() => setStatusFilter('watched')}>Rated / Watched ({counts.watched})</button></div></section>
    </div>
  );

  return (
    <section className="command-catalog" id="archive-search" aria-labelledby="command-catalog-title">
      <div className="command-catalog__head">
        <div><p className="archive-kicker">Command Catalog</p><h2 id="command-catalog-title">Find any title, arc, status, or collection</h2></div>
        <button className="archive-btn archive-btn--ghost command-catalog__filterBtn" type="button" onClick={() => setMobileFilters(true)}><SlidersH size={16} /> Filters</button>
      </div>
      <label className="command-search"><Search size={22} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search the full cinematic archive…" aria-label="Search cinematic archive" /></label>
      <div className="command-chips" aria-label="Active filters">
        {activeChips.length === 0 ? <span>No active filters</span> : activeChips.map((chip) => <button key={chip.id} type="button" onClick={chip.clear}>{chip.label}<X size={12} /></button>)}
      </div>
      <div className="command-catalog__layout">
        <Filters />
        <div className="command-results" aria-live="polite">
          <div className="command-results__bar"><strong>{filtered.length}</strong> results <span>Desktop filters update instantly</span></div>
          <div className="archive-grid archive-grid--catalog">
            {filtered.map((item) => <ArchiveCard key={item.id} item={item} variant="compact" posterSrc={posterSrc} bookmarked={bookmarks[item.id]} rating={myRating[item.id]} onOpen={openDetail} onToggleBookmark={toggleBookmark} onStatus={setStatusDirect} />)}
          </div>
        </div>
      </div>
      {mobileFilters && <div className="archive-sheet" role="dialog" aria-modal="true" aria-label="Catalog filters"><div className="archive-sheet__panel"><button className="archive-sheet__close" type="button" onClick={() => setMobileFilters(false)}><X size={16} /> Close</button><Filters /><button className="archive-btn archive-btn--primary" type="button" onClick={() => setMobileFilters(false)}><Check size={16} /> Show {filtered.length} Results</button></div></div>}
    </section>
  );
}
