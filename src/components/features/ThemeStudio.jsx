import React from 'react';
import { APPEARANCE_MODES, normalizeAppearanceMode } from '../../constants/themeSettings';
import './ThemeStudio.css';

const SIDEBAR_APPEARANCE_IDS = ['glass', 'neon', 'minimal', 'pixelated'];

export default function ThemeStudio({
  appearanceMode,
  onAppearanceChange,
  themeChoices,
  themeMode,
  onThemeChange,
  title = 'Universe Style',
  compact = false,
  universe = 'mcu',
  showDescriptions = false,
  appearanceIds = SIDEBAR_APPEARANCE_IDS,
}) {
  const activeAppearance = normalizeAppearanceMode(appearanceMode);
  const visibleModes = APPEARANCE_MODES.filter(mode => appearanceIds.includes(mode.id));
  const activeMode = visibleModes.find(mode => mode.id === activeAppearance) || visibleModes[0];

  return (
    <div className={`theme-studio ${compact ? 'theme-studio--compact' : ''}`} data-universe={universe === 'dc' ? 'dc' : 'mcu'}>
      <div className="theme-studio__header">
        <div>
          <p className="theme-studio__eyebrow">Styles & Themes</p>
          <h3>{title}</h3>
        </div>
        <span className="theme-studio__mode-chip">{activeMode?.label || 'Style'}</span>
      </div>

      <div className="theme-style-grid" aria-label="Appearance styles">
        {visibleModes.map(mode => {
          const isActive = activeAppearance === mode.id;
          return (
            <button
              key={mode.id}
              type="button"
              className={`theme-style-card theme-style-card--${mode.id} ${isActive ? 'is-active' : ''}`}
              onClick={() => onAppearanceChange(mode.id)}
              aria-pressed={isActive}
            >
              <span className="theme-style-card__visual" aria-hidden="true"><i /><b /><em /></span>
              <span className="theme-style-card__copy">
                <strong>{mode.label}</strong>
                {showDescriptions && <small>{mode.desc}</small>}
                <span>{mode.font}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="theme-accent-grid" aria-label={`${universe === 'dc' ? 'DC' : 'MCU'} accent themes`}>
        {themeChoices.map(({ id, displayLabel, displaySwatch }) => {
          const isActive = themeMode === id;
          return (
            <button
              key={id}
              type="button"
              className={`theme-accent-card ${isActive ? 'is-active' : ''}`}
              onClick={() => onThemeChange(id)}
              aria-pressed={isActive}
              style={{ '--swatch': displaySwatch }}
            >
              <span className="theme-accent-card__swatch" />
              <span>{displayLabel}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
