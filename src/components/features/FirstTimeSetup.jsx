import React, { useEffect, useMemo, useRef } from 'react';
import { Moon, Sun, Zap, EyeOff, Upload } from '../../constants/icons';
import './FirstTimeSetup.css';

const parseGoogleCredential = (credential) => {
  if (!credential || typeof credential !== 'string') return null;
  const parts = credential.split('.');
  if (parts.length < 2) return null;
  try { return JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))); } catch { return null; }
};

export default function FirstTimeSetup(props) {
  const { darkMode, profile, setProfile, onContinue, onSkip, onGoogleSuccess, onAvatarFile, metadataStatusText, onFetchDetails, settings, onToggleSetting } = props;
  const googleBtnRef = useRef(null);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId || !window.google?.accounts?.id || !googleBtnRef.current) return;
    googleBtnRef.current.innerHTML = '';
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response) => {
        const payload = parseGoogleCredential(response?.credential);
        if (!payload) return;
        const nextProfile = { name: payload.name || payload.given_name || profile.name || '', pfp: payload.picture || profile.pfp || '' };
        setProfile((prev) => ({ ...prev, ...nextProfile }));
        onGoogleSuccess?.(nextProfile);
      },
    });
    window.google.accounts.id.renderButton(googleBtnRef.current, { theme: darkMode ? 'filled_black' : 'outline', size: 'large', width: 320, shape: 'pill', text: 'continue_with' });
  }, [darkMode, onGoogleSuccess, profile.name, profile.pfp, setProfile]);

  const hasGoogleClientId = useMemo(() => Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID), []);

  return <section className="first-setup"><div className="setup-card">
    <p className="setup-eyebrow">First-time setup</p><h1>Set up your profile & app</h1>
    <div className='setup-steps'>
      <div><strong>1.</strong> Profile</div><div><strong>2.</strong> Fetch posters + metadata</div><div><strong>3.</strong> Preferences</div>
    </div>
    <label>Display name<input value={profile.name} onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))} placeholder="Enter your display name"/></label>
    <div className='setup-avatar-row'>
      {profile.pfp ? <img src={profile.pfp} alt='avatar preview' className='setup-avatar-preview'/> : <div className='setup-avatar-placeholder'>No avatar</div>}
      <label className='setup-upload-btn'><Upload size={14}/> Upload from gallery<input type='file' accept='image/*' onChange={onAvatarFile}/></label>
    </div>
    <div className="setup-google-row"><div ref={googleBtnRef} className="google-btn-slot" />{!hasGoogleClientId && <p className="setup-hint">Add <code>VITE_GOOGLE_CLIENT_ID</code> in your .env.</p>}</div>
    <div className='setup-fetch-row'><button type='button' className='setup-btn ghost' onClick={onFetchDetails}>Fetch posters & details</button><p className='setup-hint'>{metadataStatusText}</p></div>
    <div className='setup-toggle-grid'>
      <button type='button' className='setup-pill' onClick={() => onToggleSetting('darkMode')}><Moon size={14}/>Dark mode: {settings.darkMode ? 'On' : 'Off'}</button>
      <button type='button' className='setup-pill' onClick={() => onToggleSetting('spoilerSafeMode')}><EyeOff size={14}/>Spoiler safe: {settings.spoilerSafeMode ? 'On' : 'Off'}</button>
      <button type='button' className='setup-pill' onClick={() => onToggleSetting('performanceMode')}><Zap size={14}/>Performance: {settings.performanceMode ? 'On' : 'Off'}</button>
      <button type='button' className='setup-pill' onClick={() => onToggleSetting('darkMode')}><Sun size={14}/>Light mode: {!settings.darkMode ? 'On' : 'Off'}</button>
    </div>
    <div className="setup-actions"><button type="button" className="setup-btn ghost" onClick={onSkip}>Skip for now</button><button type="button" className="setup-btn primary" onClick={onContinue}>Save and continue</button></div>
  </div></section>;
}
