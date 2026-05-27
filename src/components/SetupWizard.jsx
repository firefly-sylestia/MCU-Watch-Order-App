import React, { useEffect } from 'react';

export default function SetupWizard({ open, profile, setProfile, onPickPhoto, onGoogleLogin, onFetchCore, onFetchAll, fetchState, onSkip, onFinish, onExpandToggle, expanded }) {
  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  if (!open) return null;
  return (
    <div className="setup-overlay" role="dialog" aria-modal="true" aria-label="First time setup">
      <div className="setup-card">
        <div className="setup-header"><h2>Let&apos;s personalize your app</h2><p>Pick profile, preload content, and start your watch journey.</p></div>
        <div className="setup-grid">
          <section className="setup-section"><h3>Profile</h3>
            <input value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} placeholder="Display name" className="setup-input" />
            <div className="setup-actions-row"><button className="fpill" onClick={onPickPhoto}>Upload photo</button><button className="fpill" onClick={onGoogleLogin}>Sign in with Google</button></div>
          </section>
          <section className="setup-section"><h3>Content preload</h3>
            <div className="setup-actions-row"><button className="fpill" onClick={onFetchCore} disabled={fetchState.active}>Quick preload</button><button className="fpill" onClick={onFetchAll} disabled={fetchState.active}>Full preload</button></div>
            <small className="setup-note">{fetchState.message || 'Preload posters and metadata for smoother browsing.'}</small>
          </section>
          <section className="setup-section">
            <button className="setup-expand-btn" onClick={onExpandToggle}>{expanded ? 'Hide details' : 'Show details'}</button>
            {expanded && <div className="setup-expanded"><p>This preloads timeline details, local cache, and artwork for faster navigation.</p></div>}
          </section>
        </div>
        <div className="setup-footer"><button className="fpill" onClick={onSkip}>Skip</button><button className="fpill" onClick={onFinish}>Finish setup</button></div>
      </div>
    </div>
  );
}
