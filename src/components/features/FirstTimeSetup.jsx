import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Check, Upload, Film, PlayCircle, ChevRight, Moon, Sun, Eye, Settings } from '../../constants/icons';
import './FirstTimeSetup.css';

const parseGoogleCredential = (credential) => {
  if (!credential || typeof credential !== 'string') return null;
  const parts = credential.split('.');
  if (parts.length < 2) return null;
  try {
    return JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return null;
  }
};

export default function FirstTimeSetup({ darkMode, setDarkMode, profile, setProfile, onAvatarUploadRequest, onContinue, onSkip, onRunPosters, posterState, onRunMetadata, metadataState, spoilerSafeMode, setSpoilerSafeMode, performanceMode, setPerformanceMode }) {
  const googleBtnRef = useRef(null);
  const fileInputRef = useRef(null);
  const [stepDone, setStepDone] = useState({ profile: false, metadata: false, posters: false });

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId || !window.google?.accounts?.id || !googleBtnRef.current) return;
    googleBtnRef.current.innerHTML = '';
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response) => {
        const payload = parseGoogleCredential(response?.credential);
        if (!payload) return;
        setProfile((prev) => ({ ...prev, name: payload.name || payload.given_name || prev.name || '', pfp: payload.picture || prev.pfp || '' }));
        setStepDone(prev => ({ ...prev, profile: true }));
      },
    });
    window.google.accounts.id.renderButton(googleBtnRef.current, { theme: darkMode ? 'filled_black' : 'outline', size: 'large', width: 320, shape: 'pill', text: 'continue_with' });
  }, [darkMode, setProfile]);

  const hasGoogleClientId = useMemo(() => Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID), []);

  const onPickFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = String(reader.result || '');
      if (onAvatarUploadRequest) {
        onAvatarUploadRequest(img);
      } else {
        setProfile(prev => ({ ...prev, pfp: img }));
      }
      setStepDone(prev => ({ ...prev, profile: true }));
    };
    reader.readAsDataURL(file);
  };

  const metaRunning = metadataState?.status === 'running';
  const posterRunning = posterState?.active;

  return (
    <section className="first-setup" data-mode={darkMode ? 'dark' : 'light'}>
      <div className="setup-card">
        <p className="setup-eyebrow">First-time setup</p>
        <h1>Let&apos;s personalize and prep your app</h1>
        <p className="setup-copy">You can complete everything now, or skip any step and continue.</p>

        <div className="setup-step">
          <div className="setup-step-title"><span>1</span> Profile setup {stepDone.profile && <Check size={16} />}</div>
          <label>Display name
            <input value={profile.name} onChange={(e) => { setProfile((prev) => ({ ...prev, name: e.target.value })); setStepDone(prev => ({ ...prev, profile: Boolean(e.target.value.trim()) })); }} placeholder="Enter your display name" />
          </label>
          <div className="setup-upload-row">
            <button type="button" className="setup-btn ghost" onClick={() => fileInputRef.current?.click()}><Upload size={14} /> Upload photo from gallery</button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={onPickFile} style={{ display: 'none' }} />
            {profile.pfp ? <img src={profile.pfp} alt="profile" className="setup-avatar-preview" /> : <div className="setup-avatar-placeholder"><Film size={16} /></div>}
          </div>
          <div className="setup-google-row">
            <div ref={googleBtnRef} className="google-btn-slot" />
            {!hasGoogleClientId && <p className="setup-hint">Add <code>VITE_GOOGLE_CLIENT_ID</code> to enable Google login.</p>}
          </div>
        </div>

        <div className="setup-step">
          <div className="setup-step-title"><span>2</span> Fetch app data</div>
          <div className="setup-fetch-grid">
            <button type="button" className="setup-btn ghost" onClick={async () => { await onRunMetadata?.(); setStepDone(prev => ({ ...prev, metadata: true })); }} disabled={metaRunning}>{metaRunning ? <><Settings size={14} className="spin" />Fetching metadata...</> : <><PlayCircle size={14} />Fetch metadata</>}</button>
            <button type="button" className="setup-btn ghost" onClick={async () => { await onRunPosters?.(); setStepDone(prev => ({ ...prev, posters: true })); }} disabled={posterRunning}>{posterRunning ? <><Settings size={14} className="spin" />Fetching posters...</> : <><Film size={14} />Fetch posters</>}</button>
          </div>
          <p className="setup-hint">Metadata: {metadataState?.status || 'idle'} · Posters: {posterState?.message || 'idle'}</p>
        </div>

        <div className="setup-step">
          <div className="setup-step-title"><span>3</span> Quick settings</div>
          <div className="setup-toggle-grid">
            <button type="button" className="setup-toggle" onClick={() => setDarkMode((v) => !v)}><span>{darkMode ? <Moon size={14} /> : <Sun size={14} />} Theme</span><strong>{darkMode ? 'Dark' : 'Light'}</strong></button>
            <button type="button" className="setup-toggle" onClick={() => setSpoilerSafeMode((v) => !v)}><span><Eye size={14} />Spoiler Safe</span><strong>{spoilerSafeMode ? 'On' : 'Off'}</strong></button>
            <button type="button" className="setup-toggle" onClick={() => setPerformanceMode((v) => !v)}><span><Settings size={14} />Performance</span><strong>{performanceMode ? 'On' : 'Off'}</strong></button>
          </div>
        </div>

        <div className="setup-actions">
          <button type="button" className="setup-btn ghost" onClick={onSkip}><ChevRight size={14} />Skip for now</button>
          <button type="button" className="setup-btn primary" onClick={onContinue}><Eye size={14} />Save and continue</button>
        </div>
      </div>
    </section>
  );
}
