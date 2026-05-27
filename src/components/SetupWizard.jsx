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
}) {
  if (!open) return null;

  return (
    <div className="setup-overlay" role="dialog" aria-modal="true" aria-label="First time setup">
      <div className="setup-card">
        <div className="setup-header">
          <h2>Welcome setup</h2>
          <p>Personalize your profile and preload your library.</p>
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
            <h3>3) Next page setup</h3>
            <div className="setup-expanded">
              <p>Tune up settings before you start exploring:</p>
              <ul className="setup-note-list">
                <li>Dark / light mode automatically follows your profile preference.</li>
                <li>Performance mode keeps interactions smooth on lower-end devices.</li>
                <li>Posters are loaded lazily and prefer compressed variants when available.</li>
              </ul>
            </div>
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
