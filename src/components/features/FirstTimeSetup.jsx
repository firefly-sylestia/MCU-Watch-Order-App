import React, { useEffect, useMemo, useRef } from 'react';
import './FirstTimeSetup.css';

const parseGoogleCredential = (credential) => {
  if (!credential || typeof credential !== 'string') return null;
  const parts = credential.split('.');
  if (parts.length < 2) return null;
  try {
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload;
  } catch {
    return null;
  }
};

export default function FirstTimeSetup({
  darkMode,
  profile,
  setProfile,
  onContinue,
  onSkip,
  onGoogleSuccess,
}) {
  const googleBtnRef = useRef(null);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId || !window.google?.accounts?.id || !googleBtnRef.current) return;

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response) => {
        const payload = parseGoogleCredential(response?.credential);
        if (!payload) return;
        const nextProfile = {
          name: payload.name || payload.given_name || profile.name || '',
          pfp: payload.picture || profile.pfp || '',
        };
        setProfile((prev) => ({ ...prev, ...nextProfile }));
        onGoogleSuccess?.(nextProfile);
      },
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    window.google.accounts.id.renderButton(googleBtnRef.current, {
      theme: darkMode ? 'filled_black' : 'outline',
      size: 'large',
      width: 320,
      shape: 'pill',
      text: 'continue_with',
    });
  }, [darkMode, onGoogleSuccess, profile.name, profile.pfp, setProfile]);

  const hasGoogleClientId = useMemo(() => Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID), []);

  return (
    <section className="first-setup" data-mode={darkMode ? 'dark' : 'light'}>
      <div className="setup-card">
        <p className="setup-eyebrow">Welcome</p>
        <h1>Set up your profile</h1>
        <p className="setup-copy">Personalize your MCU journey now, or skip and do it later from Settings.</p>

        <label>
          Display name
          <input
            value={profile.name}
            onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Enter your display name"
          />
        </label>

        <label>
          Avatar URL (optional)
          <input
            value={profile.pfp}
            onChange={(e) => setProfile((prev) => ({ ...prev, pfp: e.target.value }))}
            placeholder="https://..."
          />
        </label>

        <div className="setup-google-row">
          <div ref={googleBtnRef} className="google-btn-slot" />
          {!hasGoogleClientId && (
            <p className="setup-hint">Add <code>VITE_GOOGLE_CLIENT_ID</code> to enable Google login.</p>
          )}
        </div>

        <div className="setup-actions">
          <button type="button" className="setup-btn ghost" onClick={onSkip}>Skip for now</button>
          <button type="button" className="setup-btn primary" onClick={onContinue}>Save and continue</button>
        </div>
      </div>
    </section>
  );
}
