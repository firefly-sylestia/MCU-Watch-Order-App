import React from 'react';
import ThemeStudio from './features/ThemeStudio';

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
}) {
  if (!open) return null;
  const fetchStatus = fetchState.active ? 'loading' : (fetchState.message?.toLowerCase().includes('built') ? 'success' : (fetchState.message?.toLowerCase().includes('could not') ? 'error' : 'idle'));
  const stepStatus = {
    profile: profile.name?.trim() ? 'Complete' : 'In progress',
    preload: fetchState.active ? 'In progress' : (fetchStatus === 'success' ? 'Complete' : 'Optional'),
    style: 'Recommended',
    tuning: 'Optional',
  };

  return (
    <div className="setup-overlay" role="dialog" aria-modal="true" aria-label="First time setup">
      <div className="setup-card">
        <div className="setup-header">
          <h2>Let&apos;s get you set up</h2>
          <p>Four quick steps. No sign-in needed now, and you can sync across devices later from Settings.</p>
        </div>

        <ol className="setup-step-progress" aria-label="Setup progress">
          <li><span>1</span> Profile <em>{stepStatus.profile}</em></li>
          <li><span>2</span> Library preload <em>{stepStatus.preload}</em></li>
          <li><span>3</span> Style <em>{stepStatus.style}</em></li>
          <li><span>4</span> Optional advanced tuning <em>{stepStatus.tuning}</em></li>
        </ol>

        <div className="setup-grid">
          <section className="setup-section">
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
          </section>

          <section className="setup-section">
            <h3>Step 2 · Library preload</h3>
            <div className="setup-actions-row">
              <button className={`fpill setup-preload-btn is-${fetchStatus}`} onClick={onFetchCore} disabled={fetchState.active} data-state={fetchStatus}>Core preload {fetchState.active ? '• Loading…' : (fetchStatus === 'success' ? '• Ready' : '')}</button>
              <button className={`fpill setup-preload-btn is-${fetchStatus}`} onClick={onFetchAll} disabled={fetchState.active} data-state={fetchStatus}>Full preload {fetchState.active ? '• Loading…' : (fetchStatus === 'success' ? '• Ready' : '')}</button>
            </div>
            <small className="setup-note">{fetchState.message || 'Choose how much content to cache for smoother browsing.'}</small>
          </section>

          <section className="setup-section setup-style-section">
            <h3>Step 3 · Style</h3>
            <div className="setup-color-mode-row" aria-label="Color mode">
              <button className="fpill" type="button" aria-pressed={!darkMode} onClick={() => setDarkMode(false)}>Light default</button>
              <button className="fpill" type="button" aria-pressed={darkMode} onClick={() => setDarkMode(true)}>Dark mode</button>
            </div>
            <ThemeStudio
              compact
              title="Choose your opening style"
              appearanceMode={appearanceMode}
              onAppearanceChange={setAppearanceMode}
              themeChoices={themeChoices}
              themeMode={themeMode}
              onThemeChange={setThemeMode}
            />
            <small className="setup-note">New installs start in light, minimal, Iron Man mode. You can switch style systems anytime.</small>
          </section>

          <section className="setup-section">
            <h3>Step 4 · Optional advanced tuning</h3>
            <div className="settings-toggle-grid">
              <label className="settings-toggle-row"><span>Spoiler Safe</span><button className='fpill settings-toggle-pill' type='button' aria-pressed={spoilerSafeMode} onClick={() => setSpoilerSafeMode(v => !v)}>{spoilerSafeMode ? 'On' : 'Off'}</button></label>
              <label className="settings-toggle-row"><span>Reduce Motion</span><button className='fpill settings-toggle-pill' type='button' aria-pressed={performanceMode} onClick={() => setPerformanceMode(v => !v)}>{performanceMode ? 'On' : 'Off'}</button></label>
              <label className="settings-toggle-row"><span>Universe Language</span><button className='fpill settings-toggle-pill' type='button' aria-pressed={marvelLangMode} onClick={() => setMarvelLangMode(v => !v)}>{marvelLangMode ? 'On' : 'Off'}</button></label>
              <label className="settings-toggle-row"><span>Poster Data Saver</span><button className='fpill settings-toggle-pill' type='button' aria-pressed={posterDataSaver} onClick={() => setPosterDataSaver(v => !v)}>{posterDataSaver ? 'On' : 'Off'}</button></label>
            </div>
            <small className="setup-note">Data saver uses smaller poster assets from TMDB to cut home screen data usage.</small>
          </section>
        </div>

        <div className="setup-footer">
          <button className="fpill setup-secondary-action" onClick={onSkip}>Skip</button>
          <button className="fpill setup-primary-action" onClick={onFinish}>{fetchState.active ? 'Continue' : 'Finish'}</button>
        </div>
      </div>
    </div>
  );
}
