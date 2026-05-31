import React, { useMemo } from 'react';
import { collectionMatchesItem } from '../../data/libraryCollections';
import './CollectionRooms.css';

const getPreviewItems = (collection, items) => items.filter(item => collectionMatchesItem(collection, item)).slice(0, 3);

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
    return { collection, matches, preview: matches.slice(0, 3) };
  }), [collections, items]);

  return (
    <section className="collection-rooms" data-variant={variant} data-universe={universe} aria-label={`${universe === 'dc' ? 'DC' : 'Marvel'} collection categories`}>
      <div className="collection-rooms__grid">
        {cards.map(({ collection, matches, preview }) => {
          const active = activeCollectionId === collection.id;
          return (
            <button
              key={collection.id}
              type="button"
              className="collection-room-card"
              data-active={active ? 'true' : 'false'}
              aria-pressed={active}
              aria-label={`Open ${collection.title} collection`}
              onClick={() => onSelectCollection?.(collection.id)}
              style={{ '--collection-accent': collection.accent || 'var(--theme-accent)' }}
            >
              <span className="collection-room-card__glow" aria-hidden="true" />
              <span className="collection-room-card__topline">
                <span className="collection-room-card__icon" aria-hidden="true">{collection.icon || '✦'}</span>
                <span className="collection-room-card__count">{matches.length} title{matches.length === 1 ? '' : 's'}</span>
              </span>
              <span className="collection-room-card__title">{collection.title}</span>
              <span className="collection-room-card__description">{collection.description}</span>
              {preview.length > 0 && (
                <span className="collection-room-card__posters" aria-hidden="true">
                  {preview.map((item, index) => {
                    const src = typeof posterSrc === 'function' ? posterSrc(item) : '';
                    return src ? <img key={item.id} src={src} alt="" style={{ '--poster-index': index }} loading="lazy" /> : null;
                  })}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
