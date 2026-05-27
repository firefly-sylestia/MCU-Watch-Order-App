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
  onExpandToggle,
  expanded,
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
            <button className="setup-expand-btn" onClick={onExpandToggle}>{expanded ? 'Hide expanded setup options' : 'Show expanded setup options'}</button>
            {expanded && (
              <div className="setup-expanded">
                <p>Advanced setup tunes preload depth and cache behavior for this device.</p>
              </div>
            )}
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
