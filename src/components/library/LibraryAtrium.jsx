import React, { useMemo } from 'react';
import ArchiveCard from './ArchiveCard.jsx';
import { COLLECTIONS, uniqueById } from './archiveUtils.js';

const shelfLimit = 12;

export default function LibraryAtrium({ activeItems, historyItems, currentPhases, getAfterCreditsMeta, universe, posterSrc, bookmarks, myRating, openDetail, toggleBookmark, setStatusDirect, onNavigate, progress }) {
  const shelves = useMemo(() => {
    const continueWatching = activeItems.filter((i) => i.status === 'watching' || i.status === 'on-hold');
    const watchlist = activeItems.filter((i) => i.status === 'plan-to-watch');
    const bookmarked = activeItems.filter((i) => bookmarks[i.id]);
    const essentials = activeItems.filter((i) => i.essential);
    const characterArcs = activeItems.filter((i) => /iron man|captain america|thor|spider|wanda|loki|daredevil|guardians|black panther|batman|superman|wonder woman/i.test(`${i.title} ${i.desc || ''}`));
    const phaseCollections = currentPhases.map((phase) => activeItems.find((item) => item.phase === phase.id)).filter(Boolean);
    const afterCredits = activeItems.filter((i) => {
      const after = getAfterCreditsMeta?.(i);
      return after?.important || after?.connectsTo?.length || after?.note;
    });
    return [
      { id: 'continue', title: 'Continue Watching', subtitle: 'Resume active missions.', items: continueWatching },
      { id: 'watchlist', title: 'Watchlist', subtitle: 'Queued titles waiting in your archive.', items: watchlist },
      { id: 'bookmarked', title: 'Bookmarked', subtitle: 'Hand-picked titles you saved.', items: bookmarked },
      { id: 'essentials', title: 'Essentials', subtitle: 'A high-signal pathway through the library.', items: essentials },
      { id: 'arcs', title: 'Character Arcs', subtitle: 'Hero, antihero, and team journeys.', items: characterArcs },
      ...(historyItems.length ? [{ id: 'recent', title: 'Recently Watched', subtitle: 'Your latest completed or rated entries.', items: historyItems }] : []),
      { id: 'phases', title: 'Phase Collections', subtitle: 'Open the phase loading system with the full phase navigator and watch rows.', items: phaseCollections },
      { id: 'credits', title: 'After-Credits Important', subtitle: 'Stingers that matter for future connections.', items: afterCredits },
    ].map((shelf) => ({ ...shelf, items: uniqueById(shelf.items).slice(0, shelfLimit) }));
  }, [activeItems, bookmarks, currentPhases, getAfterCreditsMeta, historyItems]);

  const hero = shelves.find((s) => s.items.length)?.items[0] || activeItems[0];

  return (
    <section className="library-atrium" aria-labelledby="library-atrium-title">
      <div className="library-hero">
        <div className="library-hero__copy">
          <p className="archive-kicker">Cinematic Library OS</p>
          <h1 id="library-atrium-title">A library-first home for every saga, arc, queue, and credits note.</h1>
          <p>Browse like a media library instead of a phase checklist. Your watched states, bookmarks, ratings, reviews, posters, trailers, universe switch, theme, export tools, and deep links remain connected.</p>
          <div className="library-hero__actions">
            <button className="archive-btn archive-btn--primary" type="button" onClick={() => onNavigate('search')}>Open Command Catalog</button>
            <button className="archive-btn archive-btn--ghost" type="button" onClick={() => onNavigate('phase')}>Open Phase Navigator</button>
          </div>
        </div>
        <div className="library-hero__card">{hero && <ArchiveCard item={hero} variant="hero" posterSrc={posterSrc} bookmarked={bookmarks[hero.id]} rating={myRating[hero.id]} onOpen={openDetail} onToggleBookmark={toggleBookmark} onStatus={setStatusDirect} />}</div>
        <div className="library-hero__metrics"><span><strong>{progress}%</strong> complete</span><span><strong>{activeItems.length}</strong> titles</span><span><strong>{universe === 'dc' ? 'DC' : 'MCU'}</strong> universe</span></div>
      </div>

      <div className="library-shelves">
        {shelves.map((shelf) => (
          <section key={shelf.id} className="library-shelf" aria-labelledby={`shelf-${shelf.id}`}>
            <div className="library-shelf__head"><div><h2 id={`shelf-${shelf.id}`}>{shelf.title}</h2><p>{shelf.subtitle}</p></div>{shelf.items.length > 0 && <button type="button" onClick={() => onNavigate(shelf.id === 'phases' ? 'phase' : 'library')}>View all</button>}</div>
            {shelf.items.length ? <div className="archive-row">{shelf.items.map((item) => <ArchiveCard key={item.id} item={item} variant="shelf" posterSrc={posterSrc} bookmarked={bookmarks[item.id]} rating={myRating[item.id]} onOpen={openDetail} onToggleBookmark={toggleBookmark} onStatus={setStatusDirect} />)}</div> : <div className="library-empty">Nothing here yet. Use quick actions on cards to fill this shelf.</div>}
          </section>
        ))}
      </div>
    </section>
  );
}
