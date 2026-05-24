import React, { useMemo, useState } from 'react';

const SPOILER_LEVELS = ['none', 'mild', 'full'];

export default function FeatureLab({ items = [], themeMuted = 'var(--theme-text-muted)' }) {
  const [timelineMode, setTimelineMode] = useState('release');
  const [spoilerLevel, setSpoilerLevel] = useState('none');
  const [entryPath, setEntryPath] = useState('spider');
  const [pickedTitle, setPickedTitle] = useState(null);

  const timelineGroups = useMemo(() => {
    const ordered = [...items].sort((a, b) => (a.order || 0) - (b.order || 0));
    const release = [...items].sort((a, b) => String(a.releaseDate || '').localeCompare(String(b.releaseDate || '')));
    const wanda = ordered.filter(i => /wanda|vision|strange|agatha/i.test(`${i.title} ${i.desc || ''}`));
    const loki = ordered.filter(i => /loki|thor|avengers/i.test(`${i.title} ${i.desc || ''}`));
    const byMode = {
      release,
      chronological: ordered,
      character: entryPath === 'magic' ? wanda : loki,
      branch: ordered.filter(i => /what if|loki|multiverse|deadpool|strange/i.test(`${i.title} ${i.desc || ''}`)),
    };
    return (byMode[timelineMode] || ordered).slice(0, 8);
  }, [items, timelineMode, entryPath]);

  const recommendations = useMemo(() => {
    if (!pickedTitle) return [];
    const base = items.find(i => i.id === pickedTitle);
    if (!base) return [];
    return items
      .filter(i => i.id !== base.id)
      .map(i => {
        let score = 0;
        if ((i.phase || 0) === (base.phase || 0)) score += 2;
        if (i.type === base.type) score += 2;
        if (/(avengers|multiverse|quantum|magic|shield)/i.test(`${i.title} ${base.title}`)) score += 1;
        if (Math.abs((i.order || 0) - (base.order || 0)) <= 3) score += 1;
        return { ...i, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [items, pickedTitle]);

  const spoilerStyle = spoilerLevel === 'full' ? {} : { filter: spoilerLevel === 'mild' ? 'blur(2px)' : 'blur(6px)' };

  return (
    <section style={{ maxWidth: 1480, margin: '0 auto', padding: '0 16px 12px', display: 'grid', gap: 12 }}>
      <div className="glass-panel" style={{ padding: 16, display: 'grid', gap: 12 }}>
        <h3 style={{ fontSize: 18 }}>Multiverse Intelligence Hub</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {[
            ['release', 'Release Order'],
            ['chronological', 'Chronological Story'],
            ['character', 'Character POV'],
            ['branch', 'Branching Map'],
          ].map(([id, label]) => (
            <button key={id} className="fpill" onClick={() => setTimelineMode(id)} aria-pressed={timelineMode === id}>{label}</button>
          ))}
        </div>
        <div style={{ display: 'grid', gap: 8 }}>
          {timelineGroups.map((item, idx) => (
            <div key={item.id} className="rrow" style={{ padding: 10, display: 'flex', justifyContent: 'space-between' }}>
              <span>{idx + 1}. {item.title}</span><span style={{ color: themeMuted }}>Phase {item.phase || '-'}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 12 }}>
        <div className="glass-panel" style={{ padding: 16, display: 'grid', gap: 10 }}>
          <h4>After-Credits Navigator</h4>
          {(items.slice(0, 4)).map((it, i) => (
            <div key={it.id} style={{ border: '1px solid var(--theme-border)', borderRadius: 12, padding: 10 }}>
              <div>{it.title}</div>
              <div style={{ fontSize: 12, color: themeMuted }}>Post-credit scenes: {i % 3}</div>
              <div style={{ fontSize: 12 }}>{i % 2 === 0 ? 'Must watch now' : 'Can skip now'}</div>
            </div>
          ))}
        </div>

        <div className="glass-panel" style={{ padding: 16, display: 'grid', gap: 10 }}>
          <h4>Variant Tracker + Spoiler Layer</h4>
          <input type="range" min="0" max="2" value={SPOILER_LEVELS.indexOf(spoilerLevel)} onChange={(e) => setSpoilerLevel(SPOILER_LEVELS[Number(e.target.value)])} />
          <div style={{ fontSize: 12, color: themeMuted }}>Spoiler level: {spoilerLevel}</div>
          <div style={{ ...spoilerStyle, border: '1px solid var(--theme-border)', borderRadius: 12, padding: 10 }}>
            <div>Sacred timeline: Loki (TVA tagged)</div>
            <div>Variant seen: Sylvie · Classic Loki · Kid Loki</div>
            <div>Seen in your progress badge: 2/4</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: 16, display: 'grid', gap: 10 }}>
          <h4>Entry Points + Lore-aware Recs</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {[['spider', 'Spider-Man lover'], ['cosmic', 'Cosmic fan'], ['street', 'Street-level'], ['magic', 'Magic fan']].map(([id, label]) => (
              <button key={id} className="fpill" onClick={() => setEntryPath(id)} aria-pressed={entryPath === id}>{label}</button>
            ))}
          </div>
          <select value={pickedTitle || ''} onChange={(e) => setPickedTitle(e.target.value)} style={{ background: 'var(--theme-surface)', color: 'var(--theme-text)', border: '1px solid var(--theme-border)', borderRadius: 10, padding: 8 }}>
            <option value="">If you loved...</option>
            {items.slice(0, 30).map(i => <option key={i.id} value={i.id}>{i.title}</option>)}
          </select>
          {recommendations.map(r => <div key={r.id} style={{ fontSize: 13 }}>→ {r.title} <span style={{ color: themeMuted }}>(score {r.score})</span></div>)}
        </div>
      </div>
    </section>
  );
}
