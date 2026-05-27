import React from 'react';

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
}) {
  if (!open) return null;

  return (
    <div className="setup-overlay" role="dialog" aria-modal="true" aria-label="First time setup">
      <div className="setup-card">
        <div className="setup-header">
          <h2>Welcome setup</h2>
          <p>Personalize your profile, preload your library, and tune performance for this device.</p>
        </div>

        <div className="setup-grid">
          <section className="setup-section">
            <h3>1) Profile</h3>
            <input
              value={profile.name}
              onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
              placeholder="Display name"
              className="setup-input"
            />
            <div className="setup-actions-row">
              <button className="fpill" onClick={onPickPhoto}>Upload photo from gallery</button>
            </div>
            <small className="setup-note">You can continue without sign-in and connect syncing later from Settings.</small>
          </section>

          <section className="setup-section">
            <h3>2) Library preload</h3>
            <div className="setup-actions-row">
              <button className="fpill" onClick={onFetchCore} disabled={fetchState.active}>Fetch Core Only</button>
              <button className="fpill" onClick={onFetchAll} disabled={fetchState.active}>Fetch All</button>
            </div>
            <small className="setup-note">{fetchState.message || 'Choose how much content to cache for smoother browsing.'}</small>
          </section>

          <section className="setup-section">
            <h3>3) Next page tuning</h3>
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
          <button className="fpill" onClick={onSkip}>Skip for now</button>
          <button className="fpill" onClick={onFinish}>Finish setup</button>
        </div>
      </div>
    </div>
  );
}
