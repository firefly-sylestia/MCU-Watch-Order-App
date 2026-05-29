import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { APPEARANCE_MODES, normalizeAppearanceMode } from '../constants/themeSettings';

export default function SetupWizard({
  open,
  profile,
  setProfile,
  onPickPhoto,
  onFetchCore,
  onFetchAll,
  fetchState,
  onSkip,
  onFinish,
  spoilerSafeMode,
  setSpoilerSafeMode,
  performanceMode,
  setPerformanceMode,
  marvelLangMode,
  setMarvelLangMode,
  posterDataSaver,
  setPosterDataSaver,
  uiBuildCacheEnabled,
  setUiBuildCacheEnabled,
  uiBuildState = { active: false, message: '', done: 0, total: 0 },
  onBuildUiCache,
  darkMode,
  setDarkMode,
  appearanceMode,
  setAppearanceMode,
  themeChoices = [],
  themeMode,
  setThemeMode,
  themeVars = {},
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = useMemo(() => [
    { id: 'profile', label: 'Profile' },
    { id: 'preload', label: 'Library' },
    { id: 'style', label: 'Style' },
    { id: 'tuning', label: 'Tuning' },
  ], []);
  const canUsePortal = typeof document !== 'undefined';
  if (!open) return null;
  const fetchStatus = fetchState.active ? 'loading' : (fetchState.message?.toLowerCase().includes('built') ? 'success' : (fetchState.message?.toLowerCase().includes('could not') ? 'error' : 'idle'));
  const stepStatus = {
    profile: profile.name?.trim() ? 'Complete' : 'In progress',
    preload: fetchState.active ? 'In progress' : (fetchStatus === 'success' ? 'Complete' : 'Optional'),
    style: `${darkMode ? 'Dark' : 'Light'} · ${normalizeAppearanceMode(appearanceMode)}`,
    tuning: 'Optional',
  };
  const activeAppearance = normalizeAppearanceMode(appearanceMode);

  const wizardMarkup = (
    <div className="setup-overlay setup-overlay--portal theme-switch" data-theme={activeAppearance} data-color-mode={darkMode ? 'dark' : 'light'} style={themeVars} role="dialog" aria-modal="true" aria-label="First time setup">
      <div className="setup-card">
        <div className="setup-header">
          <h2>Let&apos;s get you set up</h2>
          <p>Four quick steps. No sign-in needed now, and you can sync across devices later from Settings.</p>
        </div>

        <ol className="setup-step-progress" aria-label="Setup progress">
          {steps.map((step, index) => (
            <li key={step.id} className={currentStep === index ? 'is-active' : ''}>
              <button type="button" onClick={() => setCurrentStep(index)} aria-current={currentStep === index ? 'step' : undefined}>
                <span>{index + 1}</span> {step.label} <em>{stepStatus[step.id]}</em>
              </button>
            </li>
          ))}
        </ol>

        <div className="setup-grid setup-step-stage" data-step={steps[currentStep]?.id}>
          {currentStep === 0 && <section className="setup-section is-current">
            <h3>Step 1 · Profile</h3>
            <input
              value={profile.name}
              onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
              placeholder="Display name"
              className="setup-input"
            />
            <div className="setup-actions-row">
              <button className="fpill" onClick={onPickPhoto}>Upload photo from gallery</button>
            </div>
            <small className="setup-note">You can keep this local right now. Connect sync later anytime in Settings.</small>
          </section>}

          {currentStep === 1 && <section className="setup-section is-current">
            <h3>Step 2 · Library preload</h3>
            <div className="setup-actions-row">
              <button className={`fpill setup-preload-btn is-${fetchStatus}`} onClick={onFetchCore} disabled={fetchState.active} data-state={fetchStatus}>Core preload {fetchState.active ? '• Loading…' : (fetchStatus === 'success' ? '• Ready' : '')}</button>
              <button className={`fpill setup-preload-btn is-${fetchStatus}`} onClick={onFetchAll} disabled={fetchState.active} data-state={fetchStatus}>Full preload {fetchState.active ? '• Loading…' : (fetchStatus === 'success' ? '• Ready' : '')}</button>
            </div>
            <small className="setup-note">{fetchState.message || 'Choose how much content, metadata, and UI shell work to cache for smoother browsing.'}</small>
          </section>}

          {currentStep === 2 && <section className="setup-section setup-style-section is-current">
            <h3>Step 3 · Choose your style</h3>
            <div className="setup-style-modes" aria-label="Color mode">
              <button className="setup-choice-card" type="button" aria-pressed={!darkMode} onClick={() => setDarkMode(false)}>
                <span className="setup-choice-card__title">Light mode</span>
                <span className="setup-choice-card__meta">Default · crisp minimal surfaces</span>
              </button>
              <button className="setup-choice-card" type="button" aria-pressed={darkMode} onClick={() => setDarkMode(true)}>
                <span className="setup-choice-card__title">Dark mode</span>
                <span className="setup-choice-card__meta">Cinema contrast for night watching</span>
              </button>
            </div>

            <div className="setup-style-grid" aria-label="Appearance style">
              {APPEARANCE_MODES.map((mode) => (
                <button
                  className="setup-style-card"
                  type="button"
                  key={mode.id}
                  aria-pressed={activeAppearance === mode.id}
                  onClick={() => setAppearanceMode(mode.id)}
                >
                  <span className="setup-style-card__visual" aria-hidden="true"><i /><b /><em /></span>
                  <span className="setup-style-card__copy"><strong>{mode.label}</strong><small>{mode.desc}</small></span>
                </button>
              ))}
            </div>

            <div className="setup-accent-strip" aria-label="Hero accent">
              {themeChoices.slice(0, 8).map((choice) => (
                <button
                  key={choice.id}
                  type="button"
                  className="setup-accent-dot"
                  aria-label={choice.displayLabel}
                  aria-pressed={themeMode === choice.id}
                  onClick={() => setThemeMode(choice.id)}
                  style={{ '--setup-accent': choice.displaySwatch }}
                />
              ))}
            </div>
            <small className="setup-note">New installs start in Light · Minimal · Iron Man; you can still change every visual layer here.</small>
          </section>}

          {currentStep === 3 && <section className="setup-section setup-tuning-section is-current">
            <h3>Step 4 · Optional advanced tuning</h3>
            <div className="settings-toggle-grid">
              <label className="settings-toggle-row"><span>Spoiler Safe</span><button className='fpill settings-toggle-pill' type='button' aria-pressed={spoilerSafeMode} onClick={() => setSpoilerSafeMode(v => !v)}>{spoilerSafeMode ? 'On' : 'Off'}</button></label>
              <label className="settings-toggle-row"><span>Reduce Motion</span><button className='fpill settings-toggle-pill' type='button' aria-pressed={performanceMode} onClick={() => setPerformanceMode(v => !v)}>{performanceMode ? 'On' : 'Off'}</button></label>
              <label className="settings-toggle-row"><span>Universe Language</span><button className='fpill settings-toggle-pill' type='button' aria-pressed={marvelLangMode} onClick={() => setMarvelLangMode(v => !v)}>{marvelLangMode ? 'On' : 'Off'}</button></label>
              <label className="settings-toggle-row"><span>Poster Data Saver</span><button className='fpill settings-toggle-pill' type='button' aria-pressed={posterDataSaver} onClick={() => setPosterDataSaver(v => !v)}>{posterDataSaver ? 'On' : 'Off'}</button></label>
              <label className="settings-toggle-row"><span>UI Build Cache</span><button className='fpill settings-toggle-pill' type='button' aria-pressed={uiBuildCacheEnabled} onClick={() => setUiBuildCacheEnabled(v => !v)}>{uiBuildCacheEnabled ? 'On' : 'Off'}</button></label>
            </div>
            <div className="setup-build-box">
              <strong>Build smoother UI cache</strong>
              <small>{uiBuildState.message || 'Builds row measurements, overlay shells, critical fonts, carousel assets, and visible media during idle time.'}</small>
              <button className="fpill" type="button" disabled={uiBuildState.active} onClick={onBuildUiCache}>{uiBuildState.active ? `Building ${uiBuildState.done}/${uiBuildState.total}` : 'Build UI cache now'}</button>
            </div>
            <small className="setup-note">Data saver uses smaller poster assets from TMDB; UI Build Cache warms the first visible interface path without blocking scrolling.</small>
          </section>}
        </div>

        <div className="setup-footer">
          <button className="fpill setup-secondary-action" onClick={currentStep === 0 ? onSkip : () => setCurrentStep(step => Math.max(0, step - 1))}>{currentStep === 0 ? 'Skip' : 'Back'}</button>
          <button className="fpill setup-primary-action" onClick={currentStep === steps.length - 1 ? onFinish : () => setCurrentStep(step => Math.min(steps.length - 1, step + 1))}>{currentStep === steps.length - 1 ? (fetchState.active ? 'Continue' : 'Finish') : 'Next'}</button>
        </div>
      </div>
    </div>
  );

  return canUsePortal ? createPortal(wizardMarkup, document.body) : wizardMarkup;
}
