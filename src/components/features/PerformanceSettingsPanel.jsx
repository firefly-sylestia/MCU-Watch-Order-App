import React from 'react';

const OPTION_META = [
  { key: 'enhancedBackdrop', label: 'Enhanced Backdrop', desc: 'Keep hero backdrop visible in all modes.' },
  { key: 'cinematicMotion', label: 'Cinematic Motion', desc: 'Subtle UI motion and transitions.' },
  { key: 'smoothHeroCarousel', label: 'Smooth Hero Carousel', desc: 'Enable smooth hero carousel easing.' },
  { key: 'glassSurfaces', label: 'Glass Surfaces', desc: 'Blurred panels for sidebar and settings.' },
  { key: 'optimizedTrailerLandscape', label: 'Landscape Trailer UI', desc: 'Keep accurate trailer landscape layout.' },
];

export default function PerformanceSettingsPanel({ presets, activePreset, options, onPreset, onToggle }) {
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--theme-text-muted)' }}>Performance Presets</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 6 }}>
        {Object.entries(presets).filter(([id]) => id !== 'custom').map(([id, preset]) => (
          <button key={id} className='fpill' type='button' onClick={() => onPreset(id)} style={{ justifyContent: 'center', borderColor: activePreset === id ? 'var(--theme-accent)' : 'var(--theme-border)', color: activePreset === id ? 'var(--theme-accent)' : 'var(--theme-text)' }}>{preset.label}</button>
        ))}
      </div>
      <div style={{ fontSize: 11, color: 'var(--theme-text-muted)' }}>Choose a preset, then fine-tune individual toggles below.</div>
      <div style={{ display: 'grid', gap: 6 }}>
        {OPTION_META.map((item) => (
          <label key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, border: '1px solid var(--theme-border)', borderRadius: 10, padding: '8px 10px', background: 'var(--theme-surface)' }}>
            <span style={{ display: 'grid', gap: 2 }}><strong style={{ fontSize: 13 }}>{item.label}</strong><span style={{ fontSize: 11, color: 'var(--theme-text-muted)' }}>{item.desc}</span></span>
            <button className='fpill settings-toggle-pill' type='button' onClick={() => onToggle(item.key)} style={{ minWidth: 68, justifyContent: 'center', borderColor: options[item.key] ? 'var(--theme-accent)' : 'var(--theme-border)' }}>{options[item.key] ? 'On' : 'Off'}</button>
          </label>
        ))}
      </div>
    </div>
  );
}
