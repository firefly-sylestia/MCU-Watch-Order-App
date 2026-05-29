import React, { useMemo, useState } from 'react';
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
  darkMode,
  setDarkMode,
  appearanceMode,
  setAppearanceMode,
  themeChoices = [],
  themeMode,
  setThemeMode,
  uiBuildCacheEnabled = false,
  setUiBuildCacheEnabled = () => {},
  onBuildUiCache = () => {},
  uiBuildStatus = { active: false, message: '' },
}) {
  const [activeStep, setActiveStep] = useState(0);
  const fetchStatus = fetchState.active ? 'loading' : (fetchState.message?.toLowerCase().includes('built') ? 'success' : (fetchState.message?.toLowerCase().includes('could not') ? 'error' : 'idle'));
  const stepStatus = {
    profile: profile.name?.trim() ? 'Complete' : 'In progress',
    preload: fetchState.active ? 'In progress' : (fetchStatus === 'success' ? 'Complete' : 'Optional'),
    style: `${darkMode ? 'Dark' : 'Light'} · ${normalizeAppearanceMode(appearanceMode)}`,
    tuning: 'Optional',
  };
  const activeAppearance = normalizeAppearanceMode(appearanceMode);
  const steps = useMemo(() => [
    { id: 'profile', title: 'Profile', eyebrow: 'Identity', status: stepStatus.profile },
    { id: 'preload', title: 'Library preload', eyebrow: 'Cache', status: stepStatus.preload },
    { id: 'style', title: 'Choose your style', eyebrow: 'Theme', status: stepStatus.style },
    { id: 'tuning', title: 'Advanced tuning', eyebrow: 'Performance', status: stepStatus.tuning },
  ], [stepStatus.profile, stepStatus.preload, stepStatus.style, stepStatus.tuning]);
  const currentStep = steps[activeStep] || steps[0];
  const goNext = () => setActiveStep((step) => Math.min(step + 1, steps.length - 1));
  const goBack = () => setActiveStep((step) => Math.max(step - 1, 0));

  if (!open) return null;

  return (
    <div className="setup-overlay" role="dialog" aria-modal="true" aria-label="First time setup">
      <div className="setup-card">
        <div className="setup-header">
          <h2>Let&apos;s get you set up</h2>
          <p>Four quick steps. No sign-in needed now, and you can sync across devices later from Settings.</p>
        </div>

        <ol className="setup-step-progress" aria-label="Setup progress">
          {steps.map((step, index) => (
            <li key={step.id} className={index === activeStep ? 'is-active' : index < activeStep ? 'is-complete' : ''}>
              <button type="button" onClick={() => setActiveStep(index)} aria-current={index === activeStep ? 'step' : undefined}>
                <span>{index + 1}</span>
                <strong>{step.title}</strong>
                <em>{step.status}</em>
              </button>
            </li>
          ))}
        </ol>

        <div className="setup-current-step" aria-live="polite">
          <p className="setup-step-eyebrow">{currentStep.eyebrow}</p>
          <h3>Step {activeStep + 1} · {currentStep.title}</h3>
        </div>

        <div className="setup-grid setup-step-shell" data-step={currentStep.id}>
          {activeStep === 0 && (
          <section className="setup-section setup-section-active">
            <h3>Build your local profile</h3>
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
          </section>
          )}

          {activeStep === 1 && (
          <section className="setup-section setup-section-active">
            <h3>Preload for smooth browsing</h3>
            <div className="setup-actions-row">
              <button className={`fpill setup-preload-btn is-${fetchStatus}`} onClick={onFetchCore} disabled={fetchState.active} data-state={fetchStatus}>Core preload {fetchState.active ? '• Loading…' : (fetchStatus === 'success' ? '• Ready' : '')}</button>
              <button className={`fpill setup-preload-btn is-${fetchStatus}`} onClick={onFetchAll} disabled={fetchState.active} data-state={fetchStatus}>Full preload {fetchState.active ? '• Loading…' : (fetchStatus === 'success' ? '• Ready' : '')}</button>
            </div>
            <label className="settings-toggle-row setup-build-row">
              <span><strong>Build UI cache</strong><small>Pre-render list hints and warm visible poster assets during idle time.</small></span>
              <button className='fpill settings-toggle-pill' type='button' aria-pressed={uiBuildCacheEnabled} onClick={() => setUiBuildCacheEnabled(v => !v)}>{uiBuildCacheEnabled ? 'On' : 'Off'}</button>
            </label>
            <button className="fpill setup-primary-action" type="button" onClick={onBuildUiCache} disabled={uiBuildStatus.active}>{uiBuildStatus.active ? 'Building UI cache…' : 'Build now'}</button>
            <small className="setup-note">{uiBuildStatus.message || fetchState.message || 'Choose how much content to cache for smoother browsing.'}</small>
          </section>
          )}

          {activeStep === 2 && (
          <section className="setup-section setup-style-section setup-section-active">
            <h3>Choose your style</h3>
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
          </section>
          )}

          {activeStep === 3 && (
          <section className="setup-section setup-tuning-section setup-section-active">
            <h3>Optional advanced tuning</h3>
            <div className="settings-toggle-grid">
              <label className="settings-toggle-row"><span>Spoiler Safe</span><button className='fpill settings-toggle-pill' type='button' aria-pressed={spoilerSafeMode} onClick={() => setSpoilerSafeMode(v => !v)}>{spoilerSafeMode ? 'On' : 'Off'}</button></label>
              <label className="settings-toggle-row"><span>Reduce Motion</span><button className='fpill settings-toggle-pill' type='button' aria-pressed={performanceMode} onClick={() => setPerformanceMode(v => !v)}>{performanceMode ? 'On' : 'Off'}</button></label>
              <label className="settings-toggle-row"><span>Universe Language</span><button className='fpill settings-toggle-pill' type='button' aria-pressed={marvelLangMode} onClick={() => setMarvelLangMode(v => !v)}>{marvelLangMode ? 'On' : 'Off'}</button></label>
              <label className="settings-toggle-row"><span>Poster Data Saver</span><button className='fpill settings-toggle-pill' type='button' aria-pressed={posterDataSaver} onClick={() => setPosterDataSaver(v => !v)}>{posterDataSaver ? 'On' : 'Off'}</button></label>
            </div>
            <small className="setup-note">Data saver uses smaller poster assets from TMDB to cut home screen data usage.</small>
          </section>
          )}
        </div>

        <div className="setup-footer">
          <button className="fpill setup-secondary-action" onClick={activeStep === 0 ? onSkip : goBack}>{activeStep === 0 ? 'Skip' : 'Back'}</button>
          {activeStep < steps.length - 1 ? (
            <button className="fpill setup-primary-action" onClick={goNext}>Continue</button>
          ) : (
            <button className="fpill setup-primary-action" onClick={onFinish}>{fetchState.active ? 'Continue' : 'Finish'}</button>
          )}
        </div>
      </div>
    </div>
  );
}
