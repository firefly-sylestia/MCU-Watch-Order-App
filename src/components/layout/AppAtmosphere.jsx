import React from 'react';
import './AppAtmosphere.css';

export default function AppAtmosphere({
  browseMode,
  previousHeroSrc,
  currentHeroSrc,
  heroBackdropOpacity,
  heroBackdropBackgroundSize,
  darkMode,
}) {
  return (
    <div className="app-atmosphere" aria-hidden="true">
      {browseMode !== 'phase' && previousHeroSrc && previousHeroSrc !== currentHeroSrc && (
        <div
          key={`backdrop-exit-${previousHeroSrc}`}
          className="hero-backdrop-image is-exiting app-atmosphere__poster"
          style={{
            '--backdrop-opacity': heroBackdropOpacity,
            backgroundImage: `url(${previousHeroSrc})`,
            backgroundSize: heroBackdropBackgroundSize,
            transition: browseMode === 'phase' ? 'none' : undefined,
          }}
        />
      )}
      {currentHeroSrc && (
        <div
          key={`backdrop-${currentHeroSrc}`}
          className="hero-backdrop-image app-atmosphere__poster"
          style={{
            '--backdrop-opacity': heroBackdropOpacity,
            backgroundImage: `url(${currentHeroSrc})`,
            backgroundSize: heroBackdropBackgroundSize,
            transition: browseMode === 'phase' ? 'none' : undefined,
          }}
        />
      )}
      <div className="hero-backdrop-blend" />
      <div className="app-atmosphere__aurora" data-mode={darkMode ? 'dark' : 'light'} />
      <div className="app-atmosphere__grid" />
    </div>
  );
}
