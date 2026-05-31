import React, { useMemo } from 'react';
import ArchiveCard from './ArchiveCard.jsx';
import { COLLECTIONS, DC_COLLECTION } from './archiveUtils.js';

export default function CollectionRooms({ activeItems, universe, getAfterCreditsMeta, posterSrc, bookmarks, myRating, openDetail, toggleBookmark, setStatusDirect }) {
  const rooms = useMemo(() => (universe === 'dc' ? [DC_COLLECTION] : COLLECTIONS).map((room) => {
    const items = activeItems.filter((item) => room.test(item, getAfterCreditsMeta?.(item))).slice(0, 18);
    const watched = items.filter((item) => item.status === 'watched').length;
    return { ...room, items, watched };
  }), [activeItems, getAfterCreditsMeta, universe]);
  return (
    <section className="collection-rooms" aria-labelledby="collection-rooms-title">
      <div className="archive-section-head"><p className="archive-kicker">Collection Rooms</p><h2 id="collection-rooms-title">Enter by saga, tone, format, or importance</h2><p>Phase Collections remain available as a room and search facet instead of controlling the whole app.</p></div>
      <div className="collection-room-grid">
        {rooms.map((room) => (
          <article key={room.id} className="collection-room">
            <div className="collection-room__head"><div><h3>{room.label}</h3><p>{room.description}</p></div><span>{room.watched}/{room.items.length}</span></div>
            <div className="collection-room__cards">{room.items.slice(0, 6).map((item) => <ArchiveCard key={item.id} item={item} variant="compact" posterSrc={posterSrc} bookmarked={bookmarks[item.id]} rating={myRating[item.id]} onOpen={openDetail} onToggleBookmark={toggleBookmark} onStatus={setStatusDirect} />)}</div>
          </article>
        ))}
      </div>
    </section>
  );
}
