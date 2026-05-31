import React, { useMemo } from 'react';
import { Check, Layers } from '../../constants/icons.jsx';
import { collectionMatchesItem, getVisibleCollectionRooms } from '../../data/libraryCollections.js';
import './CollectionRooms.css';

export default function CollectionRooms({ items = [], universe = 'mcu', posterSrc, activeCollectionId = '', onSelectCollection }) {
  const rooms = useMemo(() => getVisibleCollectionRooms(universe).map((room) => {
    const roomItems = items.filter((item) => collectionMatchesItem(room, item, { universe }));
    const watched = roomItems.filter((item) => item.status === 'watched').length;
    const pct = roomItems.length ? Math.round((watched / roomItems.length) * 100) : 0;
    return { ...room, items: roomItems, watched, pct };
  }).filter((room) => room.items.length > 0), [items, universe]);

  return (
    <section className="collection-rooms archive-surface" aria-labelledby="collection-rooms-title">
      <div className="library-section-head">
        <div>
          <p className="library-eyebrow">Collection Rooms</p>
          <h2 id="collection-rooms-title">Enter by story purpose</h2>
          <p>Rooms scope the same archive without replacing your global search or filters.</p>
        </div>
        {activeCollectionId && <button className="archive-room-clear" type="button" onClick={() => onSelectCollection?.('')}>Clear room</button>}
      </div>
      <div className="collection-room-grid">
        {rooms.map((room) => (
          <button
            key={room.id}
            type="button"
            className={`collection-room-card${activeCollectionId === room.id ? ' is-active' : ''}`}
            style={{ '--room-accent': room.accent }}
            onClick={() => onSelectCollection?.(activeCollectionId === room.id ? '' : room.id)}
          >
            <div className="collection-room-card__top">
              <span className="collection-room-card__icon">{room.icon || <Layers size={20} />}</span>
              {activeCollectionId === room.id && <span className="collection-room-card__active"><Check size={13} /> Active</span>}
            </div>
            <h3>{room.title}</h3>
            <p>{room.description}</p>
            <div className="collection-room-card__posters" aria-hidden="true">
              {room.items.slice(0, 4).map((item, index) => (
                <span key={item.id} style={{ '--stack-index': index }}>
                  {posterSrc?.(item) ? <img src={posterSrc(item)} alt="" loading="lazy" /> : item.title.slice(0, 1)}
                </span>
              ))}
            </div>
            <div className="collection-room-card__meter"><span style={{ width: `${room.pct}%` }} /></div>
            <div className="collection-room-card__stats">
              <span>{room.items.length} titles</span>
              <span>{room.watched} watched</span>
              <strong>{room.pct}%</strong>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
