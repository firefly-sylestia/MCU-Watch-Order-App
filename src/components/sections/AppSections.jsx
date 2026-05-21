import React, { memo } from 'react';

const PassThrough = memo(function PassThrough({ children }) {
  return <>{children}</>;
});

export const HeaderShell = PassThrough;
export const HeroBackdrop = PassThrough;
export const HeroCarousel = PassThrough;
export const FloatingQuickControls = PassThrough;
export const FilterBar = PassThrough;
export const PhaseList = PassThrough;
export const SettingsPanel = PassThrough;
export const DetailModal = PassThrough;
