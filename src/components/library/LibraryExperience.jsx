import React, { useMemo, useState } from 'react';
import ArchiveCard from './ArchiveCard.jsx';
import { Bookmark, Check, Clock, Download, Film, Layers, Moon, Search, Settings, SlidersH, Sun, UserCircle } from '../../constants/icons.jsx';
import './library.css';

const navItems = [
  { id: 'home', label: 'Home', Icon: Layers },
  { id: 'library', label: 'Library', Icon: Film },
  { id: 'collections', label: 'Collections', Icon: Layers },
  { id: 'search', label: 'Search', Icon: Search },
  { id: 'progress', label: 'Progress', Icon: Check },
  { id: 'settings', label: 'Settings', Icon: Settings },
];

const statusLabels = {
  watched: 'Watched',
  watching: 'Watching',
  'plan-to-watch': 'Watchlist',
  'on-hold': 'On hold',
  dropped: 'Dropped',
  unwatched: 'Unwatched',
};

const collectionTests = [
  ['infinity', 'Infinity Saga', item => item.phase >= 1 && item.phase <= 3],
  ['multiverse', 'Multiverse Saga', item => item.phase >= 4 || /multiverse|loki|what if|wanda|quantumania|deadpool/i.test(`${item.title} ${item.desc || ''}`)],
  ['cosmic', 'Cosmic', item => /guardians|thor|captain marvel|eternals|marvels|infinity|galaxy|cosmic|asgard/i.test(`${item.title} ${item.desc || ''}`)],
  ['magic', 'Magic & Myth', item => /strange|wanda|witch|agatha|moon knight|blade|magic|myth|asgard|werewolf/i.test(`${item.title} ${item.desc || ''}`)],
  ['street', 'Street-Level', item => /spider|daredevil|hawkeye|echo|punisher|luke cage|jessica|iron fist|street|kingpin/i.test(`${item.title} ${item.desc || ''}`)],
  ['series', 'Series', item => item.type === 'series'],
  ['shorts', 'Shorts/Specials', item => item.type === 'short' || /special|one-shot|short/i.test(`${item.title} ${item.desc || ''}`)],
  ['essentials', 'Essentials', item => Boolean(item.essential)],
];

function afterCreditsImportant(item, getAfterCreditsMeta) {
  const meta = getAfterCreditsMeta?.(item);
  return Boolean(meta?.important || meta?.connectsTo?.length || /important|essential|sets up/i.test(`${meta?.note || ''} ${meta?.notes || ''}`));
}

function buildCollections(items, universe, getAfterCreditsMeta) {
  const rooms = collectionTests.map(([id, label, test]) => ({ id, label, items: items.filter(test) }));
  rooms.push({ id: 'after-credits', label: 'After-Credits Important', items: items.filter(item => afterCreditsImportant(item, getAfterCreditsMeta)) });
  if (universe === 'dc') rooms.push({ id: 'dc', label: 'DC Collection', items });
  return rooms.filter(room => room.items.length);
}

function runtimeBucket(item) {
  const value = item.episodes || (item.type === 'film' ? 2.3 : 6);
  if (value <= 2.5) return 'short';
  if (value <= 6) return 'medium';
  return 'long';
}

function inferMembership(item, getAfterCreditsMeta) {
  const names = [];
  collectionTests.forEach(([, label, test]) => { if (test(item)) names.push(label); });
  if (afterCreditsImportant(item, getAfterCreditsMeta)) names.push('After-Credits Important');
  return names;
}

export default function LibraryExperience({
  activeUniverse,
  universe,
  profile,
  items,
  filtered,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
  releaseFilter,
  setReleaseFilter,
  activePhase,
  setActivePhase,
  essentialOnly,
  setEssOnly,
  watchedOnly,
  setWatchedOnly,
  sortBy,
  setSortBy,
  listMode,
  setListMode,
  darkMode,
  setDarkMode,
  switchUniverse,
  onOpenSettings,
  onOpenProgress,
  onOpenDetail,
  setStatusDirect,
  toggleBookmark,
  bookmarks,
  myRating,
  metaCache,
  posterSrc,
  currentPhases,
  getAfterCreditsMeta,
  exportProgress,
}) {
  const [section, setSection] = useState('home');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [collectionFilter, setCollectionFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('any');
  const [runtimeFilter, setRuntimeFilter] = useState('any');
  const baseItems = filtered?.length || search || statusFilter || typeFilter || watchedOnly || essentialOnly ? filtered : items;

  const collections = useMemo(() => buildCollections(items, universe, getAfterCreditsMeta), [items, universe, getAfterCreditsMeta]);
  const shelves = useMemo(() => {
    const afterCreditItems = items.filter(item => afterCreditsImportant(item, getAfterCreditsMeta));
    const phaseCollectionItems = [...items].sort((a, b) => (a.phase || 0) - (b.phase || 0) || (a.order || 0) - (b.order || 0));
    const arcItems = items.filter(item => /iron man|captain america|thor|spider|wanda|loki|black panther|guardians|avengers|daredevil|batman|superman|wonder woman/i.test(`${item.title} ${item.desc || ''}`));
    return [
      { id: 'continue', label: 'Continue Watching', kicker: 'Active sessions', items: items.filter(item => item.status === 'watching' || item.status === 'on-hold').slice(0, 12) },
      { id: 'watchlist', label: 'Watchlist', kicker: 'Planned next', items: items.filter(item => item.status === 'plan-to-watch').slice(0, 12) },
      { id: 'bookmarked', label: 'Bookmarked', kicker: 'Saved dossiers', items: items.filter(item => bookmarks[item.id]).slice(0, 12) },
      { id: 'essentials', label: 'Essentials', kicker: 'Core canon shelf', items: items.filter(item => item.essential).slice(0, 12) },
      { id: 'arcs', label: 'Character Arcs', kicker: 'Hero pathways', items: arcItems.slice(0, 12) },
      { id: 'recent', label: 'Recently Watched', kicker: 'Latest completions', items: items.filter(item => item.watchedDate).sort((a, b) => String(b.watchedDate).localeCompare(String(a.watchedDate))).slice(0, 12) },
      { id: 'phases', label: 'Phase Collections', kicker: 'Phase as one facet', items: phaseCollectionItems.slice(0, 12) },
      { id: 'after', label: 'After-Credits Important', kicker: 'Stingers with consequences', items: afterCreditItems.slice(0, 12) },
    ].filter(shelf => shelf.id !== 'recent' || shelf.items.length);
  }, [items, bookmarks, getAfterCreditsMeta]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return baseItems.filter(item => {
      const memberships = inferMembership(item, getAfterCreditsMeta);
      if (collectionFilter !== 'all' && !memberships.includes(collectionFilter)) return false;
      if (runtimeFilter !== 'any' && runtimeBucket(item) !== runtimeFilter) return false;
      const itemRating = Number(myRating[item.id] || metaCache[item.id]?.rating || 0);
      if (ratingFilter === 'rated' && !itemRating) return false;
      if (ratingFilter === '8plus' && itemRating < 8) return false;
      if (!q) return true;
      return `${item.title} ${item.desc || ''} ${item.type || ''} ${memberships.join(' ')}`.toLowerCase().includes(q);
    });
  }, [baseItems, search, getAfterCreditsMeta, collectionFilter, runtimeFilter, ratingFilter, myRating, metaCache]);

  const stats = useMemo(() => {
    const watched = items.filter(item => item.status === 'watched').length;
    const watchlist = items.filter(item => item.status === 'plan-to-watch').length;
    const bookmarked = items.filter(item => bookmarks[item.id]).length;
    return { watched, total: items.length, watchlist, bookmarked, percent: items.length ? Math.round((watched / items.length) * 100) : 0 };
  }, [items, bookmarks]);

  const renderCard = (item, variant = 'grid') => (
    <ArchiveCard
      key={`${variant}-${item.id}`}
      item={item}
      variant={variant}
      poster={posterSrc(item)}
      rating={myRating[item.id] || metaCache[item.id]?.rating}
      bookmarked={Boolean(bookmarks[item.id])}
      onOpen={onOpenDetail}
      onBookmark={toggleBookmark}
      onStatus={setStatusDirect}
    />
  );

  const chooseSection = (next) => {
    if (next === 'settings') onOpenSettings?.();
    else if (next === 'progress') onOpenProgress?.();
    else setSection(next);
  };

  const filterControls = (
    <div className="catalog-facets" aria-label="Archive filters">
      <div className="catalog-facet-group">
        <span>Type</span>
        {['all', 'film', 'series', 'short'].map(type => (
          <button key={type} type="button" className="catalog-chip" data-active={(type === 'all' ? !typeFilter : typeFilter === type) ? 'true' : 'false'} onClick={() => setTypeFilter(type === 'all' ? null : type)}>{type}</button>
        ))}
      </div>
      <div className="catalog-facet-group">
        <span>Status</span>
        {['all', 'watching', 'plan-to-watch', 'watched', 'on-hold'].map(status => (
          <button key={status} type="button" className="catalog-chip" data-active={(status === 'all' ? !statusFilter && !watchedOnly : (status === 'watched' ? watchedOnly || statusFilter === status : statusFilter === status)) ? 'true' : 'false'} onClick={() => { setWatchedOnly(status === 'watched'); setStatusFilter(status === 'all' || status === 'watched' ? null : status); }}>{status === 'all' ? 'all' : statusLabels[status]}</button>
        ))}
      </div>
      <div className="catalog-facet-group catalog-facet-group--wide">
        <span>Phase</span>
        <button type="button" className="catalog-chip" data-active={!activePhase ? 'true' : 'false'} onClick={() => setActivePhase(0)}>All</button>
        {currentPhases.map(phase => <button key={phase.id} type="button" className="catalog-chip" data-active={activePhase === phase.id ? 'true' : 'false'} onClick={() => setActivePhase(phase.id)}>{phase.name || phase.label || `Phase ${phase.id}`}</button>)}
      </div>
      <div className="catalog-facet-group">
        <span>Release</span>
        {['all', 'released', 'upcoming'].map(value => <button key={value} type="button" className="catalog-chip" data-active={releaseFilter === value ? 'true' : 'false'} onClick={() => setReleaseFilter(value)}>{value}</button>)}
      </div>
      <div className="catalog-facet-group catalog-facet-group--wide">
        <span>Collection</span>
        <button type="button" className="catalog-chip" data-active={collectionFilter === 'all' ? 'true' : 'false'} onClick={() => setCollectionFilter('all')}>All rooms</button>
        {collections.map(room => <button key={room.id} type="button" className="catalog-chip" data-active={collectionFilter === room.label ? 'true' : 'false'} onClick={() => setCollectionFilter(room.label)}>{room.label}</button>)}
      </div>
      <div className="catalog-facet-group">
        <span>Rating</span>
        {[['any', 'any'], ['rated', 'rated'], ['8plus', '8+']].map(([value, label]) => <button key={value} type="button" className="catalog-chip" data-active={ratingFilter === value ? 'true' : 'false'} onClick={() => setRatingFilter(value)}>{label}</button>)}
      </div>
      <div className="catalog-facet-group">
        <span>Runtime</span>
        {['any', 'short', 'medium', 'long'].map(value => <button key={value} type="button" className="catalog-chip" data-active={runtimeFilter === value ? 'true' : 'false'} onClick={() => setRuntimeFilter(value)}>{value}</button>)}
      </div>
      <div className="catalog-facet-group">
        <span>Essentials</span>
        <button type="button" className="catalog-chip" data-active={essentialOnly ? 'true' : 'false'} onClick={() => setEssOnly(!essentialOnly)}>Essential only</button>
      </div>
      <div className="catalog-facet-group">
        <span>Sort</span>
        {['order', 'title', 'year', 'runtime', 'watched', 'status'].map(value => <button key={value} type="button" className="catalog-chip" data-active={sortBy === value ? 'true' : 'false'} onClick={() => setSortBy(value)}>{value}</button>)}
      </div>
    </div>
  );

  return (
    <div className="library-os-shell">
      <aside className="archive-rail" aria-label="Archive navigation">
        <div className="archive-rail__brand"><Film size={22} /><span>Cinematic<br />Library OS</span></div>
        {navItems.map(({ id, label, Icon }) => (
          <button key={id} type="button" className="archive-rail__item" data-active={(section === id || (id === 'home' && section === 'home')) ? 'true' : 'false'} onClick={() => chooseSection(id)}>
            <Icon size={18} /><span>{label}</span>
          </button>
        ))}
        <button type="button" className="archive-rail__universe" onClick={() => switchUniverse(universe === 'dc' ? 'mcu' : 'dc')}>{universe === 'dc' ? 'Switch to MCU' : 'Switch to DC'}</button>
      </aside>

      <main className="library-atrium" id="library-main" tabIndex={-1}>
        <header className="library-hero" aria-label="Library Atrium homepage">
          <div className="library-hero__copy">
            <p className="archive-kicker">{activeUniverse?.title || 'Cinematic'} archive</p>
            <h1>Cinematic Library OS</h1>
            <p>Browse stories as a media library: shelves, collection rooms, command search, progress, and saved dossiers. Phases are still here—now as one facet in the archive.</p>
            <div className="library-hero__actions">
              <button type="button" className="archive-primary-btn" onClick={() => chooseSection('search')}><Search size={17} /> Open Command Catalog</button>
              <button type="button" className="archive-secondary-btn" onClick={() => chooseSection('collections')}><Layers size={17} /> Enter Collection Rooms</button>
            </div>
          </div>
          <div className="library-hero__panel" aria-label="Archive progress summary">
            <div className="profile-orb">{profile?.pfp ? <img src={profile.pfp} alt="Profile" /> : <UserCircle size={38} />}</div>
            <strong>{profile?.name || 'Library Keeper'}</strong>
            <span>{stats.percent}% complete</span>
            <div className="progress-ring" style={{ '--progress': `${stats.percent * 3.6}deg` }}><span>{stats.watched}/{stats.total}</span></div>
          </div>
        </header>

        <section className="archive-stat-grid" aria-label="Archive statistics">
          <article><Check size={18} /><strong>{stats.watched}</strong><span>Watched</span></article>
          <article><Clock size={18} /><strong>{stats.watchlist}</strong><span>Watchlist</span></article>
          <article><Bookmark size={18} /><strong>{stats.bookmarked}</strong><span>Bookmarked</span></article>
          <article><Layers size={18} /><strong>{collections.length}</strong><span>Rooms</span></article>
        </section>

        {(section === 'home' || section === 'library') && (
          <div className="shelf-stack">
            {shelves.map((shelf, index) => (
              <section key={shelf.id} className="archive-shelf" aria-labelledby={`shelf-${shelf.id}`}>
                <div className="archive-section-head">
                  <div><p>{shelf.kicker}</p><h2 id={`shelf-${shelf.id}`}>{shelf.label}</h2></div>
                  <button type="button" className="archive-link-btn" onClick={() => { setSection('search'); setSearch(shelf.label === 'Essentials' ? 'essential' : ''); }}>View all</button>
                </div>
                {shelf.items.length ? <div className="archive-shelf__rail">{shelf.items.map(item => renderCard(item, index === 0 ? 'hero' : 'shelf'))}</div> : <div className="empty-shelf">No titles here yet. Add statuses or bookmarks to populate this shelf.</div>}
              </section>
            ))}
          </div>
        )}

        {section === 'collections' && (
          <section className="collection-rooms" aria-labelledby="collection-rooms-title">
            <div className="archive-section-head"><div><p>Collection Rooms</p><h2 id="collection-rooms-title">Curated archive wings</h2></div></div>
            <div className="collection-room-grid">
              {collections.map(room => (
                <article key={room.id} className="collection-room">
                  <div><p>{room.items.length} titles</p><h3>{room.label}</h3></div>
                  <div className="collection-room__posters">{room.items.slice(0, 4).map(item => <img key={item.id} src={posterSrc(item)} alt="" loading="lazy" />)}</div>
                  <button type="button" className="archive-secondary-btn" onClick={() => { setSection('search'); setSearch(room.label); }}>Browse room</button>
                </article>
              ))}
            </div>
          </section>
        )}

        {section === 'search' && (
          <section className="command-catalog" aria-labelledby="command-catalog-title">
            <div className="command-search-bar">
              <Search size={24} />
              <input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search title, character, collection, notes…" aria-label="Search command catalog" autoFocus />
              <button type="button" className="archive-secondary-btn command-filter-mobile" onClick={() => setMobileFiltersOpen(true)}><SlidersH size={16} /> Filters</button>
            </div>
            <div className="active-filter-row" aria-label="Active filters">
              {typeFilter && <button type="button" onClick={() => setTypeFilter(null)}>Type: {typeFilter} ×</button>}
              {statusFilter && <button type="button" onClick={() => setStatusFilter(null)}>Status: {statusLabels[statusFilter] || statusFilter} ×</button>}
              {watchedOnly && <button type="button" onClick={() => setWatchedOnly(false)}>Watched ×</button>}
              {essentialOnly && <button type="button" onClick={() => setEssOnly(false)}>Essentials ×</button>}
              {activePhase ? <button type="button" onClick={() => setActivePhase(0)}>Phase {activePhase} ×</button> : null}
              {releaseFilter !== 'all' && <button type="button" onClick={() => setReleaseFilter('all')}>Release: {releaseFilter} ×</button>}
              {collectionFilter !== 'all' && <button type="button" onClick={() => setCollectionFilter('all')}>Collection: {collectionFilter} ×</button>}
              {ratingFilter !== 'any' && <button type="button" onClick={() => setRatingFilter('any')}>Rating: {ratingFilter} ×</button>}
              {runtimeFilter !== 'any' && <button type="button" onClick={() => setRuntimeFilter('any')}>Runtime: {runtimeFilter} ×</button>}
            </div>
            <div className="command-catalog__layout">
              <aside className="command-catalog__facets">{filterControls}</aside>
              <div className="command-catalog__results">
                <div className="archive-section-head"><div><p>Command Catalog</p><h2 id="command-catalog-title">{visible.length} Results</h2></div><span>{listMode === 'core' ? 'Core library' : 'Extended library'}</span></div>
                <div className="archive-grid">{visible.map(item => renderCard(item, 'grid'))}</div>
              </div>
            </div>
          </section>
        )}

        <section className="archive-footer-tools" aria-label="Library utilities">
          <button type="button" onClick={() => setListMode(listMode === 'core' ? 'extended' : 'core')}><Layers size={16} /> {listMode === 'core' ? 'Show Extended Library' : 'Show Core Library'}</button>
          <button type="button" onClick={() => setDarkMode(!darkMode)}>{darkMode ? <Sun size={16} /> : <Moon size={16} />} {darkMode ? 'Light Mode' : 'Dark Mode'}</button>
          <button type="button" onClick={exportProgress}><Download size={16} /> Export / Share</button>
        </section>
      </main>

      <nav className="archive-bottom-dock" aria-label="Mobile archive navigation">
        {navItems.slice(0, 5).map(({ id, label, Icon }) => <button key={id} type="button" data-active={section === id ? 'true' : 'false'} onClick={() => chooseSection(id)}><Icon size={19} /><span>{label}</span></button>)}
        <button type="button" onClick={() => setMobileFiltersOpen(true)}><SlidersH size={19} /><span>More</span></button>
      </nav>

      {mobileFiltersOpen && (
        <div className="archive-sheet-backdrop" role="dialog" aria-modal="true" aria-label="Mobile filters" onClick={() => setMobileFiltersOpen(false)}>
          <div className="archive-mobile-sheet" onClick={event => event.stopPropagation()}>
            <div className="archive-sheet-handle" />
            <h2>Refine archive</h2>
            <div className="archive-sheet-actions" aria-label="Secondary archive actions">
              <button type="button" className="archive-secondary-btn" onClick={() => chooseSection('settings')}>Settings</button>
              <button type="button" className="archive-secondary-btn" onClick={() => switchUniverse(universe === 'dc' ? 'mcu' : 'dc')}>{universe === 'dc' ? 'MCU Library' : 'DC Library'}</button>
              <button type="button" className="archive-secondary-btn" onClick={() => setDarkMode(!darkMode)}>{darkMode ? 'Light Mode' : 'Dark Mode'}</button>
            </div>
            {filterControls}
            <button type="button" className="archive-primary-btn" onClick={() => setMobileFiltersOpen(false)}>Show {visible.length} Results</button>
          </div>
        </div>
      )}
    </div>
  );
}
