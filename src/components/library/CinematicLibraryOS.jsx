import React, { useMemo, useState } from 'react';
import ArchiveNavigation from './ArchiveNavigation.jsx';
import LibraryAtrium from './LibraryAtrium.jsx';
import CollectionRooms from './CollectionRooms.jsx';
import CommandCatalog from './CommandCatalog.jsx';
import ArchiveCard from './ArchiveCard.jsx';
import LibrarianDetailDrawer from './LibrarianDetailDrawer.jsx';
import { X } from '../../constants/icons.jsx';
import './CinematicLibraryOS.css';

export default function CinematicLibraryOS(props) {
  const [mobileMenu, setMobileMenu] = useState(false);
  const {
    browseMode,
    setBrowseMode,
    activeItems,
    filtered,
    totalWatched,
    totalEntries,
    historyItems,
    detailItem,
    closeDetail,
    currentPhases,
    posterSrc,
    bookmarks,
    myRating,
    reviews,
    setReviewRating,
    setReviews,
    toggleBookmark,
    setStatusDirect,
    openDetail,
    getAfterCreditsMeta,
    universe,
    profile,
    settingsOpen,
    openSettings,
    analyticsOpen,
    openAnalytics,
    detailData,
    openTrailerPlayer,
    openImdbForItem,
    phaseViewContent,
    mainRef,
  } = props;

  const activeView = browseMode === 'search' ? 'search' : browseMode || 'home';
  const progress = totalEntries ? Math.round((totalWatched / totalEntries) * 100) : 0;
  const navigate = (view) => setBrowseMode(view === 'progress' ? 'progress' : view);
  const allGrid = useMemo(() => activeItems.slice(0, 80), [activeItems]);

  return (
    <div className="cinematic-library-os">
      <ArchiveNavigation activeView={activeView} onNavigate={navigate} onOpenSettings={openSettings} onOpenMobileMenu={() => setMobileMenu(true)} universe={universe} profile={profile} progress={progress} />
      <main ref={mainRef} className="archive-main" id="main-content">
        {activeView === 'home' && <LibraryAtrium {...props} progress={progress} onNavigate={navigate} />}
        {activeView === 'phase' && (phaseViewContent || <CollectionRooms {...props} />)}
        {activeView === 'collections' && <CollectionRooms {...props} />}
        {activeView === 'search' && <CommandCatalog {...props} />}
        {activeView === 'library' && <section className="archive-library"><div className="archive-section-head"><p className="archive-kicker">Library</p><h2>All titles in the archive</h2><p>Grid-first browsing with reusable archive cards.</p></div><div className="archive-grid">{allGrid.map((item) => <ArchiveCard key={item.id} item={item} variant="grid" posterSrc={posterSrc} bookmarked={bookmarks[item.id]} rating={myRating[item.id]} onOpen={openDetail} onToggleBookmark={toggleBookmark} onStatus={setStatusDirect} />)}</div></section>}
        {activeView === 'progress' && <section className="archive-progress"><div className="archive-section-head"><p className="archive-kicker">Progress</p><h2>{progress}% complete</h2><p>{totalWatched} of {totalEntries} titles completed. Open Analytics for export and deeper review history.</p><button className="archive-btn archive-btn--primary" type="button" onClick={openAnalytics}>Open Analytics & Export</button></div><div className="archive-progress__meter"><span style={{ width: `${progress}%` }} /></div><div className="archive-row">{historyItems.slice(0, 18).map((item) => <ArchiveCard key={item.id} item={item} variant="shelf" posterSrc={posterSrc} bookmarked={bookmarks[item.id]} rating={myRating[item.id]} onOpen={openDetail} onToggleBookmark={toggleBookmark} onStatus={setStatusDirect} />)}</div></section>}
      </main>
      {mobileMenu && <div className="archive-sheet" role="dialog" aria-modal="true" aria-label="More archive actions"><div className="archive-sheet__panel"><button className="archive-sheet__close" type="button" onClick={() => setMobileMenu(false)}><X size={16} /> Close</button><button onClick={() => { openSettings(); setMobileMenu(false); }}>Settings</button><button onClick={() => { openAnalytics(); setMobileMenu(false); }}>Progress Analytics</button><button onClick={() => { navigate('phase'); setMobileMenu(false); }}>Phases</button><button onClick={() => { navigate('collections'); setMobileMenu(false); }}>Collections</button><button onClick={() => { navigate('search'); setMobileMenu(false); }}>Search Catalog</button></div></div>}
      <LibrarianDetailDrawer item={detailItem} open={Boolean(detailItem) && !settingsOpen && !analyticsOpen} onClose={closeDetail} posterSrc={posterSrc} detailData={detailData} getAfterCreditsMeta={getAfterCreditsMeta} universe={universe} bookmarked={detailItem ? bookmarks[detailItem.id] : false} rating={detailItem ? myRating[detailItem.id] : ''} review={detailItem ? reviews[detailItem.id] : ''} onToggleBookmark={toggleBookmark} onStatus={setStatusDirect} onRating={setReviewRating} onReview={(id, value) => setReviews((prev) => ({ ...prev, [id]: value }))} onOpenTrailer={openTrailerPlayer} onOpenImdb={openImdbForItem} />
    </div>
  );
}
