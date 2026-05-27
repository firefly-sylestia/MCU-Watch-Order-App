import React, { useEffect, useMemo, useState } from 'react';
import { Upload, Check, XCircle } from '../constants/icons';
import './SetupFlow.css';

const GOOGLE_SCRIPT_ID = 'google-identity-services';

function decodeJwtPayload(token) {
  try {
    const payload = token.split('.')[1];
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = atob(normalized);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export default function SetupFlow({
  isOpen,
  darkMode,
  profile,
  onProfileNameChange,
  onPickPhoto,
  onSelectFetchScope,
  onFetchNow,
  fetchState,
  onSkip,
  onFinish,
  onGoogleProfile,
  googleClientId,
}) {
  const [googleReady, setGoogleReady] = useState(false);
  const [googleError, setGoogleError] = useState('');
  const [fetchScope, setFetchScope] = useState('core');

  const hint = useMemo(() => fetchScope === 'all' ? 'Fetch all MCU + expanded entries.' : 'Fetch core list first for speed.', [fetchScope]);

  useEffect(() => {
    if (!isOpen) return;
    if (window.google?.accounts?.id) {
      setGoogleReady(true);
      return;
    }
    const existing = document.getElementById(GOOGLE_SCRIPT_ID);
    if (existing) return;
    const script = document.createElement('script');
    script.id = GOOGLE_SCRIPT_ID;
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => setGoogleReady(true);
    script.onerror = () => setGoogleError('Google Sign-In script failed to load.');
    document.body.appendChild(script);
  }, [isOpen]);

  const handleGoogle = () => {
    if (!window.google?.accounts?.id) {
      setGoogleError('Google Sign-In not ready yet.');
      return;
    }
    setGoogleError('');
    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: (response) => {
        const payload = decodeJwtPayload(response.credential || '');
        if (!payload) {
          setGoogleError('Could not decode Google account profile.');
          return;
        }
        onGoogleProfile({ name: payload.name || '', email: payload.email || '', picture: payload.picture || '' });
      },
      ux_mode: 'popup',
    });
    window.google.accounts.id.prompt();
  };

  if (!isOpen) return null;

  return (
    <div className="setup-backdrop" data-theme={darkMode ? 'dark' : 'light'}>
      <div className="setup-card">
        <h2>First-time setup</h2>
        <p>Set up profile, photo, and fetch your data cache/posters. You can skip and do this later in Settings.</p>

        <label className="setup-field">
          <span>Display name</span>
          <input value={profile.name} onChange={(e) => onProfileNameChange(e.target.value)} placeholder="Enter your name" />
        </label>

        <div className="setup-actions-row">
          <button className="setup-btn" onClick={onPickPhoto}><Upload size={14} /> Upload photo from gallery</button>
          <button className="setup-btn setup-btn-google" onClick={handleGoogle} disabled={!googleReady}>Continue with Google</button>
        </div>
        {googleError && <div className="setup-error"><XCircle size={14} /> {googleError}</div>}

        <div className="setup-scope">
          <div className="setup-scope-head">Fetch scope</div>
          <div className="setup-segmented">
            <button className={fetchScope === 'core' ? 'active' : ''} onClick={() => { setFetchScope('core'); onSelectFetchScope('core'); }}>Core</button>
            <button className={fetchScope === 'all' ? 'active' : ''} onClick={() => { setFetchScope('all'); onSelectFetchScope('all'); }}>All + Expanded</button>
          </div>
          <small>{hint}</small>
        </div>

        <div className="setup-actions-row">
          <button className="setup-btn setup-btn-primary" onClick={() => onFetchNow(fetchScope)}>
            <Check size={14} /> Fetch database + posters
          </button>
          <button className="setup-btn" onClick={onSkip}>Skip for now</button>
          <button className="setup-btn" onClick={onFinish}>Done</button>
        </div>
        {!!fetchState?.message && <div className="setup-status">{fetchState.message}</div>}
      </div>
    </div>
  );
}
