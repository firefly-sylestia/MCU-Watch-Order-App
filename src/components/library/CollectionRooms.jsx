import React, { useMemo } from 'react';
import { collectionMatchesItem } from '../../data/libraryCollections';
import './CollectionRooms.css';

const MAX_POSTERS = 3;

export default function CollectionRooms({
  collections = [],
  items = [],
  universe = 'mcu',
  posterSrc,
  onSelectCollection,
  activeCollectionId,
  variant = 'archive',
}) {
  const collectionSummaries = useMemo(() => collections.map((collection) => {
    const matchingItems = items.filter((item) => collectionMatchesItem(collection, item));
    return {
      collection,
      matchingItems,
      previewItems: matchingItems.slice(0, MAX_POSTERS),
    };
  }), [collections, items]);

  if (!collectionSummaries.length) {
    return (
      <section className="collection-rooms collection-rooms--empty" data-variant={variant} data-universe={universe}>
        <p>No collections are available for this universe yet.</p>
      </section>
    );
  }

  return (
    <section className="collection-rooms" data-variant={variant} data-universe={universe} aria-label={`${universe === 'dc' ? 'DC' : 'Marvel'} collections`}>
      <div className="collection-rooms__grid">
        {collectionSummaries.map(({ collection, matchingItems, previewItems }) => {
          const active = activeCollectionId === collection.id;
          return (
            <button
              key={collection.id}
              type="button"
              className="collection-room-card"
              style={{ '--collection-accent': collection.accent || 'var(--theme-accent)' }}
              aria-label={`Open ${collection.title} collection`}
              aria-pressed={active}
              data-active={active ? 'true' : 'false'}
              onClick={() => onSelectCollection?.(collection.id)}
            >
              <span className="collection-room-card__glow" aria-hidden="true" />
              <span className="collection-room-card__content">
                <span className="collection-room-card__eyebrow">
                  <span className="collection-room-card__icon" aria-hidden="true">{collection.icon || '▣'}</span>
                  {matchingItems.length} {matchingItems.length === 1 ? 'title' : 'titles'}
                </span>
                <span className="collection-room-card__title">{collection.title}</span>
                <span className="collection-room-card__description">{collection.description}</span>
              </span>

              {previewItems.length > 0 && (
                <span className="collection-room-card__posters" aria-hidden="true">
                  {previewItems.map((item, index) => (
                    <span key={item.id} className="collection-room-card__poster" style={{ '--poster-index': index }}>
                      <img src={posterSrc?.(item)} alt="" loading="lazy" />
                    </span>
                  ))}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
