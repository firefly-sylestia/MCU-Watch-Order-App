import React, { useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  Bookmark,
  Check,
  ChevronRight,
  Circle,
  Clock3,
  Film,
  Home,
  Library,
  Moon,
  Pause,
  Play,
  RotateCcw,
  Search,
  Settings,
  Sparkles,
  Sun,
  Tv,
  X,
} from 'lucide-react';
import { ESSENTIAL_LIST, PHASES, RAW } from '../data/mcuData';
import { RHYTHM_APP_AREAS, RHYTHM_UPSTREAM } from './rhythmSourceManifest';
import './RhythmMarvelApp.css';

const STORAGE_KEY = 'rhythm-marvel-library-status-v1';
const THEME_KEY = 'rhythm-marvel-theme-v1';

const STATUS_OPTIONS = [
  { id: 'unwatched', label: 'Unwatched', icon: Circle, tone: 'neutral' },
  { id: 'watching', label: 'Watching', icon: Play, tone: 'active' },
  { id: 'watched', label: 'Watched', icon: Check, tone: 'success' },
  { id: 'plan', label: 'Saved', icon: Bookmark, tone: 'info' },
  { id: 'hold', label: 'Paused', icon: Pause, tone: 'warn' },
  { id: 'dropped', label: 'Skipped', icon: X, tone: 'danger' },
];

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'library', label: 'Library', icon: Library },
  { id: 'progress', label: 'Progress', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const typeIcon = {
  film: Film,
  series: Tv,
  short: Sparkles,
};

function readJson(key, fallback) {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function titlePoster(title) {
  const safe = title
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `/posters/${safe}.webp`;
}

function normalizeItems() {
  const byId = new Map();
  [...ESSENTIAL_LIST, ...RAW].forEach((item) => {
    if (!item?.id || byId.has(item.id)) return;
    byId.set(item.id, {
      ...item,
      phase: Number(item.phase) || 1,
      type: item.type || 'film',
      runtime: item.runtime || (item.type === 'series' ? 320 : 125),
    });
  });
  return Array.from(byId.values()).sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));
}

function AppNav({ activeArea, setActiveArea }) {
  return (
    <nav className="rm-nav" aria-label="App sections">
      <div className="rm-nav__brand">
        <span className="rm-logo">M</span>
        <div>
          <strong>MCU Order</strong>
          <span>Rhythm shell</span>
        </div>
      </div>
      <div className="rm-nav__items">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className="rm-nav__item"
            type="button"
            data-active={activeArea === id}
            onClick={() => setActiveArea(id)}
            aria-pressed={activeArea === id}
          >
            <Icon size={19} />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

function PhaseRail({ phases, selectedPhase, setSelectedPhase }) {
  return (
    <div className="rm-phase-rail" aria-label="Phase library">
      <button
        type="button"
        className="rm-phase-chip"
        data-active={selectedPhase === 'all'}
        onClick={() => setSelectedPhase('all')}
      >
        All phases
      </button>
      {phases.map((phase) => (
        <button
          key={phase.id}
          type="button"
          className="rm-phase-chip"
          style={{ '--phase': phase.color }}
          data-active={selectedPhase === phase.id}
          onClick={() => setSelectedPhase(phase.id)}
        >
          <span>{phase.name}</span>
          <small>{phase.tagline}</small>
        </button>
      ))}
    </div>
  );
}

function StatusPill({ status }) {
  const meta = STATUS_OPTIONS.find((option) => option.id === status) || STATUS_OPTIONS[0];
  const Icon = meta.icon;
  return (
    <span className="rm-status" data-tone={meta.tone}>
      <Icon size={13} /> {meta.label}
    </span>
  );
}

function TitleCard({ item, status, onStatus }) {
  const Icon = typeIcon[item.type] || Film;
  return (
    <article className="rm-title-card">
      <div className="rm-title-card__poster" aria-hidden="true">
        <img src={titlePoster(item.title)} alt="" loading="lazy" onError={(event) => { event.currentTarget.style.display = 'none'; }} />
        <span>{String(item.order ?? item.id).padStart(2, '0')}</span>
      </div>
      <div className="rm-title-card__body">
        <div className="rm-title-card__meta">
          <span><Icon size={14} /> {item.type}</span>
          <span>{item.year || 'TBA'}</span>
          <StatusPill status={status} />
        </div>
        <h3>{item.title}</h3>
        <p>{item.desc || item.prereq || 'Placed in your MCU watch library.'}</p>
        <div className="rm-status-grid" aria-label={`Set status for ${item.title}`}>
          {STATUS_OPTIONS.map(({ id, label, icon: StatusIcon, tone }) => (
            <button
              key={id}
              type="button"
              className="rm-status-button"
              data-tone={tone}
              data-active={status === id}
              onClick={() => onStatus(item.id, id)}
              aria-pressed={status === id}
            >
              <StatusIcon size={14} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </article>
  );
}

function RhythmMarvelApp() {
  const items = useMemo(() => normalizeItems(), []);
  const [activeArea, setActiveArea] = useState('home');
  const [selectedPhase, setSelectedPhase] = useState('all');
  const [query, setQuery] = useState('');
  const [theme, setTheme] = useState(() => readJson(THEME_KEY, 'dark'));
  const [statuses, setStatuses] = useState(() => readJson(STORAGE_KEY, {}));

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.colorMode = theme;
    window.localStorage.setItem(THEME_KEY, JSON.stringify(theme));
  }, [theme]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(statuses));
  }, [statuses]);

  const setStatus = (id, status) => {
    setStatuses((current) => ({ ...current, [id]: status }));
  };

  const filteredItems = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items.filter((item) => {
      const phaseMatch = selectedPhase === 'all' || item.phase === selectedPhase;
      const queryMatch = !needle || `${item.title} ${item.desc} ${item.type} ${item.year}`.toLowerCase().includes(needle);
      return phaseMatch && queryMatch;
    });
  }, [items, query, selectedPhase]);

  const stats = useMemo(() => {
    const counts = Object.fromEntries(STATUS_OPTIONS.map(({ id }) => [id, 0]));
    items.forEach((item) => {
      counts[statuses[item.id] || 'unwatched'] += 1;
    });
    const watched = counts.watched || 0;
    return {
      total: items.length,
      watched,
      watching: counts.watching || 0,
      saved: counts.plan || 0,
      completion: Math.round((watched / Math.max(items.length, 1)) * 100),
      counts,
    };
  }, [items, statuses]);

  const continueItems = useMemo(() => {
    const active = items.filter((item) => ['watching', 'plan', 'hold'].includes(statuses[item.id]));
    return (active.length ? active : items.slice(0, 6)).slice(0, 6);
  }, [items, statuses]);

  const phaseSummaries = useMemo(() => PHASES.map((phase) => {
    const phaseItems = items.filter((item) => item.phase === phase.id);
    const completed = phaseItems.filter((item) => statuses[item.id] === 'watched').length;
    return { ...phase, total: phaseItems.length, completed, percent: Math.round((completed / Math.max(phaseItems.length, 1)) * 100) };
  }), [items, statuses]);

  return (
    <div className="rm-app">
      <AppNav activeArea={activeArea} setActiveArea={setActiveArea} />
      <main className="rm-main">
        <header className="rm-topbar">
          <div>
            <p className="rm-eyebrow">{RHYTHM_UPSTREAM.designSystem}</p>
            <h1>Marvel phases library</h1>
          </div>
          <button className="rm-theme-toggle" type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            {theme === 'dark' ? 'Light' : 'Dark'} mode
          </button>
        </header>

        <section className="rm-hero">
          <div className="rm-hero__copy">
            <span className="rm-pill"><Sparkles size={15} /> Home page rebuilt for your APK</span>
            <h2>Your MCU watch rhythm, saved locally.</h2>
            <p>Phases, statuses, progress, and library actions are now assigned to clear app areas with persistent local-first storage.</p>
            <div className="rm-hero__actions">
              <button type="button" onClick={() => setActiveArea('library')}>Open library <ChevronRight size={17} /></button>
              <button type="button" className="ghost" onClick={() => setActiveArea('progress')}>View progress</button>
            </div>
          </div>
          <div className="rm-hero__stats">
            <strong>{stats.completion}%</strong>
            <span>completed</span>
            <div className="rm-progress"><i style={{ width: `${stats.completion}%` }} /></div>
          </div>
        </section>

        <section className="rm-dashboard" data-area={activeArea}>
          <div className="rm-section-head">
            <div>
              <p className="rm-eyebrow">{RHYTHM_APP_AREAS.find((area) => area.id === activeArea)?.purpose}</p>
              <h2>{NAV_ITEMS.find((item) => item.id === activeArea)?.label}</h2>
            </div>
            <label className="rm-search">
              <Search size={17} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search titles, years, types…" />
            </label>
          </div>

          {(activeArea === 'home' || activeArea === 'library') && (
            <>
              <PhaseRail phases={phaseSummaries} selectedPhase={selectedPhase} setSelectedPhase={setSelectedPhase} />
              {activeArea === 'home' && (
                <div className="rm-stat-grid">
                  <div><strong>{stats.total}</strong><span>Total titles</span></div>
                  <div><strong>{stats.watched}</strong><span>Watched</span></div>
                  <div><strong>{stats.watching}</strong><span>Watching</span></div>
                  <div><strong>{stats.saved}</strong><span>Saved</span></div>
                </div>
              )}
              {activeArea === 'home' && (
                <section className="rm-continue">
                  <h3><Clock3 size={18} /> Continue / saved queue</h3>
                  <div className="rm-mini-row">
                    {continueItems.map((item) => (
                      <button key={item.id} type="button" onClick={() => { setActiveArea('library'); setSelectedPhase(item.phase); }}>
                        <span>{item.title}</span>
                        <StatusPill status={statuses[item.id] || 'unwatched'} />
                      </button>
                    ))}
                  </div>
                </section>
              )}
              <div className="rm-library-grid">
                {filteredItems.slice(0, activeArea === 'home' ? 8 : 120).map((item) => (
                  <TitleCard key={item.id} item={item} status={statuses[item.id] || 'unwatched'} onStatus={setStatus} />
                ))}
              </div>
            </>
          )}

          {activeArea === 'progress' && (
            <div className="rm-progress-layout">
              {phaseSummaries.map((phase) => (
                <article key={phase.id} className="rm-phase-progress" style={{ '--phase': phase.color }}>
                  <div><strong>{phase.name}</strong><span>{phase.completed}/{phase.total} watched</span></div>
                  <div className="rm-progress"><i style={{ width: `${phase.percent}%` }} /></div>
                  <p>{phase.summary}</p>
                </article>
              ))}
            </div>
          )}

          {activeArea === 'settings' && (
            <div className="rm-settings-panel">
              <h3>Saved app state</h3>
              <p>Status choices are stored in <code>localStorage</code> under <code>{STORAGE_KEY}</code>, so they remain saved across app launches.</p>
              <button type="button" className="danger" onClick={() => setStatuses({})}><RotateCcw size={16} /> Reset saved statuses</button>
              <h3>Placed app areas</h3>
              <ul>
                {RHYTHM_APP_AREAS.map((area) => <li key={area.id}><strong>{area.label}:</strong> {area.purpose}</li>)}
              </ul>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default RhythmMarvelApp;
