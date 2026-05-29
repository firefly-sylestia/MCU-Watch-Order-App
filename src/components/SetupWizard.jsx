import React, { useMemo, useState } from 'react';
import { APPEARANCE_MODES, normalizeAppearanceMode } from '../constants/themeSettings';

const SETUP_STEPS = [
  { id: 'profile', label: 'Profile' },
  { id: 'preload', label: 'Library build' },
  { id: 'style', label: 'Style' },
  { id: 'tuning', label: 'Tuning' },
];

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
  uiBuildEnabled,
  setUiBuildEnabled,
  uiBuildState,
  onBuildUiCache,
}) {
  const [activeStep, setActiveStep] = useState(0);
  const fetchStatus = fetchState.active ? 'loading' : (fetchState.message?.toLowerCase().includes('built') ? 'success' : (fetchState.message?.toLowerCase().includes('could not') ? 'error' : 'idle'));
  const activeAppearance = normalizeAppearanceMode(appearanceMode);
  const stepStatus = useMemo(() => ({
    profile: profile.name?.trim() ? 'Complete' : 'In progress',
    preload: fetchState.active ? 'In progress' : (fetchStatus === 'success' ? 'Complete' : 'Optional'),
    style: `${darkMode ? 'Dark' : 'Light'} · ${activeAppearance}`,
    tuning: uiBuildEnabled ? (uiBuildState?.status === 'ready' ? 'Built' : 'Enabled') : 'Optional',
  }), [profile.name, fetchState.active, fetchStatus, darkMode, activeAppearance, uiBuildEnabled, uiBuildState?.status]);
  const stepId = SETUP_STEPS[activeStep]?.id || 'profile';
  const isLastStep = activeStep === SETUP_STEPS.length - 1;
  const goNext = () => setActiveStep((step) => Math.min(SETUP_STEPS.length - 1, step + 1));
  const goBack = () => setActiveStep((step) => Math.max(0, step - 1));

  if (!open) return null;

  return (
    <div className="setup-overlay" role="dialog" aria-modal="true" aria-label="First time setup">
      <div className="setup-card setup-card-stepped">
        <div className="setup-header">
          <p className="setup-kicker">Guided launch</p>
          <h2>Let&apos;s get you set up</h2>
          <p>Four focused steps build a polished local experience. No sign-in needed now, and you can sync across devices later from Settings.</p>
        </div>

        <ol className="setup-step-progress setup-step-progress-stepped" aria-label="Setup progress">
          {SETUP_STEPS.map((step, idx) => (
            <li key={step.id} data-active={idx === activeStep} data-complete={idx < activeStep}>
              <button type="button" onClick={() => setActiveStep(idx)} aria-current={idx === activeStep ? 'step' : undefined}>
                <span>{idx + 1}</span>
                <strong>{step.label}</strong>
                <em>{stepStatus[step.id]}</em>
              </button>
            </li>
          ))}
        </ol>

        <div className="setup-step-stage" data-step={stepId}>
          {stepId === 'profile' && (
            <section className="setup-section setup-step-pane">
              <div className="setup-section-head"><span>Step 1</span><h3>Profile</h3></div>
              <input
                value={profile.name}
                onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                placeholder="Display name"
                className="setup-input"
              />
              <div className="setup-actions-row">
                <button className="fpill" onClick={onPickPhoto}>Upload photo from gallery</button>
              </div>
              <small className="setup-note">This stays local. Add sync later anytime in Settings.</small>
            </section>
          )}

          {stepId === 'preload' && (
            <section className="setup-section setup-step-pane">
              <div className="setup-section-head"><span>Step 2</span><h3>Library build</h3></div>
              <p className="setup-pane-copy">Preload metadata and poster references only when you choose. Work is batched during idle time to avoid blocking taps or scrolling.</p>
              <div className="setup-actions-row">
                <button className={`fpill setup-preload-btn is-${fetchStatus}`} onClick={onFetchCore} disabled={fetchState.active} data-state={fetchStatus}>Core preload {fetchState.active ? '• Loading…' : (fetchStatus === 'success' ? '• Ready' : '')}</button>
                <button className={`fpill setup-preload-btn is-${fetchStatus}`} onClick={onFetchAll} disabled={fetchState.active} data-state={fetchStatus}>Full preload {fetchState.active ? '• Loading…' : (fetchStatus === 'success' ? '• Ready' : '')}</button>
              </div>
              <small className="setup-note">{fetchState.message || 'Choose how much content to cache for smoother browsing.'}</small>
            </section>
          )}

          {stepId === 'style' && (
            <section className="setup-section setup-style-section setup-step-pane">
              <div className="setup-section-head"><span>Step 3</span><h3>Choose your style</h3></div>
              <div className="setup-style-modes" aria-label="Color mode">
                <button className="setup-choice-card" type="button" aria-pressed={!darkMode} onClick={() => setDarkMode(false)}>
                  <span className="setup-choice-card__title">Light mode</span>
                  <span className="setup-choice-card__meta">Crisp minimal surfaces with softer glow.</span>
                </button>
                <button className="setup-choice-card" type="button" aria-pressed={darkMode} onClick={() => setDarkMode(true)}>
                  <span className="setup-choice-card__title">Dark mode</span>
                  <span className="setup-choice-card__meta">Cinema contrast with neon highlights.</span>
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
              <small className="setup-note">Theme changes now use a short compositor-friendly transition.</small>
            </section>
          )}

          {stepId === 'tuning' && (
            <section className="setup-section setup-tuning-section setup-step-pane">
              <div className="setup-section-head"><span>Step 4</span><h3>Optional advanced tuning</h3></div>
              <div className="settings-toggle-grid">
                <label className="settings-toggle-row"><span>Spoiler Safe</span><button className='fpill settings-toggle-pill' type='button' aria-pressed={spoilerSafeMode} onClick={() => setSpoilerSafeMode(v => !v)}>{spoilerSafeMode ? 'On' : 'Off'}</button></label>
                <label className="settings-toggle-row"><span>Reduce Motion</span><button className='fpill settings-toggle-pill' type='button' aria-pressed={performanceMode} onClick={() => setPerformanceMode(v => !v)}>{performanceMode ? 'On' : 'Off'}</button></label>
                <label className="settings-toggle-row"><span>Universe Language</span><button className='fpill settings-toggle-pill' type='button' aria-pressed={marvelLangMode} onClick={() => setMarvelLangMode(v => !v)}>{marvelLangMode ? 'On' : 'Off'}</button></label>
                <label className="settings-toggle-row"><span>Poster Data Saver</span><button className='fpill settings-toggle-pill' type='button' aria-pressed={posterDataSaver} onClick={() => setPosterDataSaver(v => !v)}>{posterDataSaver ? 'On' : 'Off'}</button></label>
                <label className="settings-toggle-row"><span>UI Build Cache</span><button className='fpill settings-toggle-pill' type='button' aria-pressed={uiBuildEnabled} onClick={() => setUiBuildEnabled(v => !v)}>{uiBuildEnabled ? 'On' : 'Off'}</button></label>
              </div>
              <div className="setup-build-card" data-state={uiBuildEnabled ? uiBuildState?.status : 'off'}>
                <div><strong>{uiBuildEnabled ? 'Build the UI for this device' : 'UI build cache is off'}</strong><span>{uiBuildEnabled ? (uiBuildState?.message || 'Warm theme layers and poster decodes.') : 'Enable to cache bounded UI work without growing memory forever.'}</span></div>
                <button className="fpill" type="button" disabled={!uiBuildEnabled || uiBuildState?.status === 'building'} onClick={() => onBuildUiCache?.({ includeData: true })}>{uiBuildState?.status === 'building' ? `${uiBuildState.done}/${uiBuildState.total}` : 'Build UI'}</button>
              </div>
              <small className="setup-note">The cache is bounded and idle-scheduled so it improves first interactions without creating a new lag source.</small>
            </section>
          )}
        </div>

        <div className="setup-footer setup-footer-stepped">
          <button className="fpill setup-secondary-action" onClick={onSkip}>Skip</button>
          <div className="setup-step-nav">
            <button className="fpill setup-secondary-action" onClick={goBack} disabled={activeStep === 0}>Back</button>
            {!isLastStep && <button className="fpill setup-primary-action" onClick={goNext}>Next</button>}
            {isLastStep && <button className="fpill setup-primary-action" onClick={onFinish}>{fetchState.active ? 'Continue' : 'Finish'}</button>}
          </div>
        </div>
      </div>
    </div>
  );
}
