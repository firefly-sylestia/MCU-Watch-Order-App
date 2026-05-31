import React, { useMemo } from 'react';
import { collectionMatchesItem } from '../../data/libraryCollections';
import './CollectionRooms.css';

export default function CollectionRooms({
  collections = [],
  items = [],
  universe = 'mcu',
  posterSrc,
  onSelectCollection,
  activeCollectionId,
  variant = 'archive',
}) {
  const cards = useMemo(() => collections.map(collection => {
    const matches = items.filter(item => collectionMatchesItem(collection, item));
    return { collection, matches, posters: matches.slice(0, 3) };
  }), [collections, items]);

  if (!cards.length) {
    return <div className="collection-rooms collection-rooms--empty">No {universe === 'dc' ? 'DC' : 'Marvel'} collections available.</div>;
  }

  return (
    <div className={`collection-rooms collection-rooms--${variant}`} data-universe={universe}>
      <div className="collection-rooms__grid">
        {cards.map(({ collection, matches, posters }) => (
          <button
            key={collection.id}
            type="button"
            className="collection-room-card"
            style={{ '--collection-accent': collection.accent || 'var(--theme-accent)' }}
            onClick={() => onSelectCollection?.(collection.id)}
            aria-label={`Open ${collection.title} collection`}
            aria-pressed={activeCollectionId === collection.id}
            data-active={activeCollectionId === collection.id ? 'true' : 'false'}
          >
            <span className="collection-room-card__glow" aria-hidden="true" />
            <span className="collection-room-card__icon" aria-hidden="true">{collection.icon || '◆'}</span>
            <span className="collection-room-card__body">
              <span className="collection-room-card__title">{collection.title}</span>
              <span className="collection-room-card__description">{collection.description}</span>
              <span className="collection-room-card__meta">{matches.length} {matches.length === 1 ? 'title' : 'titles'}</span>
            </span>
            {posterSrc && posters.length > 0 && (
              <span className="collection-room-card__posters" aria-hidden="true">
                {posters.map((item, index) => (
                  <img key={item.id} src={posterSrc(item)} alt="" style={{ '--poster-index': index }} loading="lazy" decoding="async" />
                ))}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
