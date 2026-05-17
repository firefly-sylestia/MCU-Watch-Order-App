import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Media } from '@capacitor-community/media';
import CropModal from './components/CropModal';
import { SpeedInsights } from '@vercel/speed-insights/react';
import {
  ESSENTIAL_LIST,
  NO_PREREQ,
  PHASES,
  RAW,
  RELEASE_INFO,
  UPCOMING_PLACEHOLDERS,
} from './data/mcuData';

// ─── Icon primitives ────────────────────────────────────────────────────────
const Icon = ({ children, size = 16, style = {} }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size}
    viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    {children}
  </svg>
);
const Search    = p => <Icon {...p}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></Icon>;
const Eye       = p => <Icon {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></Icon>;
const EyeOff    = p => <Icon {...p}><path d="m3 3 18 18"/><path d="M10.5 10.5a2 2 0 0 0 3 3"/><path d="M9.9 4.2A10.9 10.9 0 0 1 12 4c6.5 0 10 8 10 8a17.6 17.6 0 0 1-3.2 4.2"/><path d="M6.6 6.6A17.5 17.5 0 0 0 2 12s3.5 8 10 8a10.7 10.7 0 0 0 5.4-1.4"/></Icon>;
const RatingGem = p => <Icon {...p}><path d="M12 2 21 9 12 22 3 9 12 2Z"/></Icon>;
const Film      = p => <Icon {...p}><rect x="2" y="2" width="20" height="20" rx="2"/><path d="M7 2v20"/><path d="M17 2v20"/><path d="M2 7h20"/><path d="M2 17h20"/></Icon>;
const Tv        = p => <Icon {...p}><rect x="2" y="7" width="20" height="15" rx="2"/><path d="M17 2 12 7 7 2"/></Icon>;
const Zap       = p => <Icon {...p}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></Icon>;
const ChevDown  = p => <Icon {...p}><path d="m6 9 6 6 6-6"/></Icon>;
const ChevRight = p => <Icon {...p}><path d="m9 6 6 6-6 6"/></Icon>;
const Check     = p => <Icon {...p}><path d="M20 6 9 17l-5-5"/></Icon>;
const Clock     = p => <Icon {...p}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></Icon>;
const Heart     = p => <Icon {...p}><path d="M12 20.8s-7.4-4.7-9.4-8.7C1 9.3 2.8 5.2 6.2 5.2c2.2 0 3.6 1.2 4.5 2.6.9-1.4 2.3-2.6 4.5-2.6 3.4 0 5.2 4.1 3.6 6.9-2 4-9.4 8.7-9.4 8.7z"/></Icon>;
const Pause     = p => <Icon {...p}><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></Icon>;
const Trash2    = p => <Icon {...p}><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></Icon>;
const Upload    = p => <Icon {...p}><path d="M12 16V4"/><path d="m7 9 5-5 5 5"/><path d="M20 16v4H4v-4"/></Icon>;
const Download  = p => <Icon {...p}><path d="M12 4v12"/><path d="m17 11-5 5-5-5"/><path d="M20 20H4"/></Icon>;
const Sun       = p => <Icon {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></Icon>;
const Star      = p => <Icon {...p}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></Icon>;
const Moon      = p => <Icon {...p}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></Icon>;
const Settings  = p => <Icon {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.02.02a2 2 0 1 1-2.83 2.83l-.02-.02A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21a2 2 0 1 1-4 0v-.03a1.7 1.7 0 0 0-.4-1.1 1.7 1.7 0 0 0-1-.6 1.7 1.7 0 0 0-1.87.34l-.02.02a2 2 0 1 1-2.83-2.83l.02-.02A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H2.9a2 2 0 1 1 0-4h.03a1.7 1.7 0 0 0 1.1-.4 1.7 1.7 0 0 0 .6-1 1.7 1.7 0 0 0-.34-1.87l-.02-.02a2 2 0 1 1 2.83-2.83l.02.02A1.7 1.7 0 0 0 9 4.6c.4 0 .78-.2 1-.6.25-.31.39-.7.4-1.1V2.9a2 2 0 1 1 4 0v.03c0 .4.15.79.4 1.1.22.4.6.6 1 .6.67.07 1.34-.16 1.87-.62l.02-.02a2 2 0 1 1 2.83 2.83l-.02.02a1.7 1.7 0 0 0-.34 1.87c0 .4.2.78.6 1 .31.25.7.39 1.1.4h.03a2 2 0 1 1 0 4h-.03a1.7 1.7 0 0 0-1.1.4 1.7 1.7 0 0 0-.6 1z"/></Icon>;
const Info      = p => <Icon {...p}><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></Icon>;
const Bookmark  = p => <Icon {...p}><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z"/></Icon>;
const SlidersH  = p => <Icon {...p}><line x1="21" y1="4" x2="14" y2="4"/><line x1="10" y1="4" x2="3" y2="4"/><circle cx="12" cy="4" r="2"/><line x1="21" y1="12" x2="12" y2="12"/><line x1="8" y1="12" x2="3" y2="12"/><circle cx="10" cy="12" r="2"/><line x1="21" y1="20" x2="16" y2="20"/><line x1="12" y1="20" x2="3" y2="20"/><circle cx="14" cy="20" r="2"/></Icon>;
const UserCircle = p => <Icon {...p}><circle cx="12" cy="8" r="4"/><path d="M4 20c1.9-3.4 5-5 8-5s6.1 1.6 8 5"/></Icon>;
const Menu = p => <Icon {...p}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></Icon>;
const SwitchIcon = p => <Icon {...p}><path d="M16 3h5v5"/><path d="M8 21H3v-5"/><path d="M21 8a9 9 0 0 0-15-3"/><path d="M3 16a9 9 0 0 0 15 3"/></Icon>;


const TYPE_META = {
  film:   { label: 'Film',   Icon: Film, color: '#d4372f' },
  series: { label: 'Series', Icon: Tv,   color: '#4a9ede' },
  short:  { label: 'Short',  Icon: Zap,  color: '#a06cd5' },
};

const STATUS_META = {
  watched:        { label: 'Watched',        color: '#3ec47a', Icon: Check,  bg: 'rgba(62,196,122,0.1)'  },
  'plan-to-watch':{ label: 'Plan to Watch',  color: '#4a9ede', Icon: Clock,  bg: 'rgba(74,158,222,0.1)'  },
  watching:       { label: 'Watching',       color: '#d4372f', Icon: Eye,    bg: 'rgba(212,55,47,0.1)'   },
  'on-hold':      { label: 'On Hold',        color: '#f39c12', Icon: Pause,  bg: 'rgba(243,156,18,0.1)'  },
  dropped:        { label: 'Dropped',        color: '#e05252', Icon: Trash2, bg: 'rgba(224,82,82,0.1)'   },
  unwatched:      { label: 'Not Watched',    color: '#334455', Icon: EyeOff, bg: 'transparent'           },
};

const SORT_LABELS = { order: 'Chronological', year: 'By Year', title: 'Alphabetical', runtime: 'Runtime', watched: 'Recently Watched', status: 'By Status' };
const HIDDEN_FILTER_STATUSES = new Set(['dropped']);
const TITLE_ROW_STATIC = {
  titleBtn: { overflow: 'hidden' },
  titleLine: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  genreMeta: { marginTop: 2, fontSize: 10, fontFamily: 'var(--font-marvel-ui)', letterSpacing: 1.2 },
};
const DESKTOP_TEXT_SCALES = [0.9, 1, 1.1, 1.2, 1.35];
// ─── Static data ────────────────────────────────────────────────────────────
const LIST_MODES = [
  { id: 'core',     label: 'MCU',      sublabel: 'Curated List',       color: '#c0392b', desc: '60 curated films & series'           },
  { id: 'extended', label: 'Extended', sublabel: 'Full Chronological', color: '#4a9ede', desc: 'All entries incl. Netflix, SHIELD & more' },
];

// ─── OMDB ratings key (for ratings only — posters use TMDB) ─────────────────
const OMDB_RATINGS_KEY = '2c971c17';

const CACHE_KEYS = {
  poster: 'mcu-poster-cache-v1',
  meta: 'mcu-meta-cache-v1',
  posterExportFailures: 'mcu-poster-export-failures-v1',
  userActions: 'mcu-user-actions-v1',
  userActionsLikes: 'mcu-user-actions-likes-v1',
  userActionsRatings: 'mcu-user-actions-ratings-v1',
  userActionsRewatch: 'mcu-user-actions-rewatch-v1',
  userActionsBookmarks: 'mcu-user-actions-bookmarks-v1',
  userActionsReviews: 'mcu-user-actions-reviews-v1',
  uiState: 'mcu-ui-state-v1',
};


const UI_STATE_DEFAULTS = {
  listMode: 'core',
  search: '',
  sortBy: 'order',
  essentialOnly: false,
  watchedOnly: false,
  statusFilter: null,
  typeFilter: null,
  activePhase: 0,
  filtersOpen: false,
  viewMode: 'list',
  densityMode: 'comfortable',
  timelineMode: 'sacred',
  autoHideStatuses: false,
  scrollTop: 0,
};

const VALID_LIST_MODES = new Set(LIST_MODES.map(mode => mode.id));
const VALID_VIEW_MODES = new Set(['list', 'calendar']);
const VALID_PHASES = new Set([0, ...PHASES.map(phase => phase.id)]);
const VALID_TYPES = new Set([null, ...Object.keys(TYPE_META)]);
const VALID_STATUSES = new Set([null, ...Object.keys(STATUS_META)]);
const VALID_DENSITY_MODES = new Set(['comfortable', 'compact']);
const VALID_TIMELINE_MODES = new Set(['sacred', 'studio', 'whatif']);
const AUTO_HIDDEN_STATUSES = HIDDEN_FILTER_STATUSES;

const readSavedUiState = () => {
  if (typeof window === 'undefined') return UI_STATE_DEFAULTS;
  try {
    const raw = window.localStorage.getItem(CACHE_KEYS.uiState);
    if (!raw) return UI_STATE_DEFAULTS;
    const saved = JSON.parse(raw);
    return {
      ...UI_STATE_DEFAULTS,
      listMode: VALID_LIST_MODES.has(saved.listMode) ? saved.listMode : UI_STATE_DEFAULTS.listMode,
      search: typeof saved.search === 'string' ? saved.search : UI_STATE_DEFAULTS.search,
      sortBy: SORT_LABELS[saved.sortBy] ? saved.sortBy : UI_STATE_DEFAULTS.sortBy,
      essentialOnly: Boolean(saved.essentialOnly),
      watchedOnly: Boolean(saved.watchedOnly),
      statusFilter: VALID_STATUSES.has(saved.statusFilter) ? saved.statusFilter : UI_STATE_DEFAULTS.statusFilter,
      typeFilter: VALID_TYPES.has(saved.typeFilter) ? saved.typeFilter : UI_STATE_DEFAULTS.typeFilter,
      activePhase: VALID_PHASES.has(Number(saved.activePhase)) ? Number(saved.activePhase) : UI_STATE_DEFAULTS.activePhase,
      filtersOpen: Boolean(saved.filtersOpen),
      viewMode: VALID_VIEW_MODES.has(saved.viewMode) ? saved.viewMode : UI_STATE_DEFAULTS.viewMode,
      densityMode: VALID_DENSITY_MODES.has(saved.densityMode) ? saved.densityMode : UI_STATE_DEFAULTS.densityMode,
      timelineMode: VALID_TIMELINE_MODES.has(saved.timelineMode) ? saved.timelineMode : UI_STATE_DEFAULTS.timelineMode,
      autoHideStatuses: typeof saved.autoHideStatuses === 'boolean' ? saved.autoHideStatuses : UI_STATE_DEFAULTS.autoHideStatuses,
      scrollTop: Number.isFinite(Number(saved.scrollTop)) ? Math.max(0, Number(saved.scrollTop)) : UI_STATE_DEFAULTS.scrollTop,
    };
  } catch {
    return UI_STATE_DEFAULTS;
  }
};

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const runWhenIdle = (cb, timeout = 400) => {
  if (typeof window !== 'undefined' && typeof window.requestIdleCallback === 'function') {
    return window.requestIdleCallback(cb, { timeout });
  }
  return setTimeout(() => cb({ timeRemaining: () => 0, didTimeout: true }), 32);
};

const safeLocalStorageSetItem = (key, value) => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (err) {
    if (err?.name === 'QuotaExceededError') {
      console.warn(`Storage quota exceeded while writing ${key}.`, err);
      return false;
    }
    throw err;
  }
};

const scheduleStorageWrite = (() => {
  const queue = new Map();
  let scheduled = false;
  const flush = () => {
    scheduled = false;
    for (const [key, value] of queue) safeLocalStorageSetItem(key, value);
    queue.clear();
  };
  return (key, value) => {
    queue.set(key, value);
    if (scheduled) return;
    scheduled = true;
    runWhenIdle(flush, 1200);
  };
})();

const createManagedCache = (entries = {}, options = {}) => {
  const {
    maxItems = 120,
    maxSerializedSize = 350_000,
    eviction = 'lru',
  } = options;

  const normalized = Object.entries(entries || {}).reduce((acc, [k, v]) => {
    if (v && typeof v === 'object' && 'value' in v) acc[k] = v;
    else if (v !== undefined) acc[k] = { value: v, touchedAt: Date.now(), createdAt: Date.now() };
    return acc;
  }, {});

  const toOrderedEntries = () => Object.entries(normalized).sort(([, a], [, b]) => {
    const aTime = eviction === 'timestamp' ? (a.createdAt || a.touchedAt || 0) : (a.touchedAt || a.createdAt || 0);
    const bTime = eviction === 'timestamp' ? (b.createdAt || b.touchedAt || 0) : (b.touchedAt || b.createdAt || 0);
    return aTime - bTime;
  });

  const trim = () => {
    let ordered = toOrderedEntries();
    while (ordered.length > maxItems) {
      const [oldestKey] = ordered.shift();
      delete normalized[oldestKey];
    }
    let serialized = JSON.stringify(normalized);
    while (serialized.length > maxSerializedSize && ordered.length) {
      const [oldestKey] = ordered.shift();
      delete normalized[oldestKey];
      serialized = JSON.stringify(normalized);
    }
    return normalized;
  };

  trim();
  return normalized;
};

const extractCacheValues = (cache) => Object.entries(cache || {}).reduce((acc, [k, v]) => {
  if (v && typeof v === 'object' && 'value' in v) acc[k] = v.value;
  else acc[k] = v;
  return acc;
}, {});

const slugifyPosterName = (value) => String(value || '')
  .toLowerCase()
  .replace(/&/g, 'and')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const posterFileName = (item, ext = 'jpg') => `${String(item.id).padStart(3, '0')}-${slugifyPosterName(item.title)}.${ext}`;
const posterExportName = (item, ext = 'jpg') => posterFileName(item, ext);



const loadedPosterSrcs = new Set();

const LazyPoster = React.memo(function LazyPoster({ src, alt, className = 'poster', eager = false }) {
  const [loaded, setLoaded] = useState(() => loadedPosterSrcs.has(src));

  useEffect(() => {
    setLoaded(loadedPosterSrcs.has(src));
  }, [src]);

  const handleLoad = () => {
    loadedPosterSrcs.add(src);
    setLoaded(true);
  };

  return <div className={`poster-shell ${loaded ? 'is-loaded' : ''}`}>
    <img className={`${className} ${loaded ? 'is-loaded' : ''}`} src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" fetchpriority={eager ? 'high' : 'auto'} onLoad={handleLoad} />
  </div>;
});
const TMDB_LOOKUP_OVERRIDES = {
  1: { tmdbId: 1771, mediaType: 'movie' },
  2: { tmdbId: 1726, mediaType: 'movie' },
  3: { tmdbId: 1724, mediaType: 'movie' },
  4: { tmdbId: 10138, mediaType: 'movie' },
  5: { tmdbId: 10195, mediaType: 'movie' },
  6: { tmdbId: 24428, mediaType: 'movie' },
  8: { tmdbId: 118340, mediaType: 'movie' },
  9: { tmdbId: 100402, mediaType: 'movie' },
  10: { tmdbId: 68721, mediaType: 'movie' },
  11: { tmdbId: 283995, mediaType: 'movie' },
  12: { tmdbId: 232125, mediaType: 'tv' },
  13: { tmdbId: 99861, mediaType: 'movie' },
  17: { tmdbId: 497698, mediaType: 'movie' },
  20: { tmdbId: 363088, mediaType: 'movie' },
  25: { tmdbId: 85271, mediaType: 'tv' },
  26: { tmdbId: 88396, mediaType: 'tv' },
  28: { tmdbId: 634649, mediaType: 'movie' },
  29: { tmdbId: 88329, mediaType: 'tv' },
  30: { tmdbId: 774752, mediaType: 'movie' },
  31: { tmdbId: 84958, mediaType: 'tv' },
  32: { tmdbId: 640146, mediaType: 'movie' },
  33: { tmdbId: 84958, mediaType: 'tv' },
  34: { tmdbId: 91363, mediaType: 'tv' },
  35: { tmdbId: 91363, mediaType: 'tv' },
  36: { tmdbId: 91363, mediaType: 'tv' },
  37: { tmdbId: 533535, mediaType: 'movie' },
  38: { tmdbId: 616037, mediaType: 'movie' },
  39: { tmdbId: 447365, mediaType: 'movie' },
  40: { tmdbId: 505642, mediaType: 'movie' },
  41: { tmdbId: 92749, mediaType: 'tv' },
  42: { tmdbId: 566525, mediaType: 'movie' },
  43: { tmdbId: 453395, mediaType: 'movie' },
  44: { tmdbId: 138501, mediaType: 'tv' },
  45: { tmdbId: 524434, mediaType: 'movie' },
  46: { tmdbId: 92783, mediaType: 'tv' },
  47: { tmdbId: 92782, mediaType: 'tv' },
  48: { tmdbId: 609681, mediaType: 'movie' },
  49: { tmdbId: 114472, mediaType: 'tv' },
  50: { tmdbId: 122226, mediaType: 'tv' },
  51: { tmdbId: 202555, mediaType: 'tv' },
  53: { tmdbId: 822119, mediaType: 'movie' },
  54: { tmdbId: 114471, mediaType: 'tv' },
  55: { tmdbId: 986056, mediaType: 'movie' },
  56: { tmdbId: 617126, mediaType: 'movie' },
  58: { tmdbId: 894205, mediaType: 'movie' },
  60: { tmdbId: 138505, mediaType: 'tv' },
  151: { tmdbId: 1403, mediaType: 'tv' },
};

const POSTER_OVERRIDES = {
  // Keep combined or episodic entries pinned to the correct franchise/show when TMDB search is ambiguous.
  12: '/posters/012-i-am-groot-s1-and-s2.jpg',
  30: '/posters/030-guardians-holiday-special.jpg',
  103: '/posters/009-A-Funny-Thing-Happened-on-the-Way-to-Thors-Hammer.jpg',
  151: '/posters/151-agents-of-shield-s6-and-s7.jpg',
};

const getPosterExtension = (src) => {
  const withoutQuery = String(src || '').split('?')[0];
  const match = withoutQuery.match(/\.([a-zA-Z0-9]+)$/);
  const ext = match?.[1]?.toLowerCase();
  return ext && ext.length <= 5 ? ext : 'jpg';
};

const triggerDownload = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

const inferFileExtFromSrc = (src) => getPosterExtension(src);

const fetchBlob = async (src) => {
  const response = await fetch(src);
  if (!response.ok) throw new Error('Poster unavailable');
  return response.blob();
};

const blobToBase64 = (blob) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(String(reader.result || '').split(',')[1] || '');
  reader.onerror = reject;
  reader.readAsDataURL(blob);
});

const wrapCacheEntries = (values, previousCache = {}) => {
  const now = Date.now();
  return Object.entries(values || {}).reduce((acc, [k, value]) => {
    if (value === undefined || value === null || value === '') return acc;
    const prev = previousCache[k];
    const prevValue = prev && typeof prev === 'object' && 'value' in prev ? prev.value : prev;
    const prevCreatedAt = prev && typeof prev === 'object' && 'createdAt' in prev ? prev.createdAt : now;
    acc[k] = {
      value,
      createdAt: prevCreatedAt,
      touchedAt: prevValue === value ? (prev?.touchedAt || now) : now,
    };
    return acc;
  }, {});
};

const useDebouncedEffect = (effect, deps, delay = 350) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      effect();
    }, delay);
    return () => clearTimeout(timer);
  }, [...deps, delay]);
};


const MemoizedTitleRow = React.memo(function MemoizedTitleRow({
  item,
  idx,
  ph,
  T,
  typeMeta,
  statusMeta,
  releaseStatus,
  releaseStatusStyleObj,
  releaseStatusText,
  releaseLabel,
  poster,
  genres,
  isExpanded,
  isWatched,
  isBookmarked,
  statusDropdown,
  rating,
  onOpenDetail,
  onSetStatus,
  onToggleBookmark,
  onOpenStatus,
  bulkSelectMode = false,
  isSelected = false,
  onToggleSelected,
  statusLabelOverride = null,
  isWorthy = false,
  multiverseShuffle = false,
  onThorLongPress,
}) {
  const StatusIcon = statusMeta.Icon;
  const TypeIcon = typeMeta.Icon;
  const RowStatusIcon = statusMeta.Icon;
  const hideWatchToggle = releaseStatus === 'upcoming';
  return (
    <div>
      <div className={`rrow row-in type-${item.type} ${isWatched ? 'glass-panel' : ''} ${isExpanded ? 'curvy-selected' : ''}`} onPointerDown={() => { if (item.title.toLowerCase().includes('thor')) { window.__thorPress = setTimeout(() => onThorLongPress?.(item), 650); } }} onPointerUp={() => clearTimeout(window.__thorPress)} onPointerLeave={() => clearTimeout(window.__thorPress)} style={{ background: isWatched ? 'var(--theme-watched-bg)' : 'transparent', opacity: 1, borderLeftColor: isExpanded ? 'var(--theme-accent)' : 'transparent', '--phase-color': ph.color, '--phase-glow': ph.glow, borderColor: multiverseShuffle ? `hsl(${(item.id * 47) % 360} 90% 60% / 0.7)` : undefined }}>
        <div style={{ fontFamily: 'var(--font-marvel-ui)', fontSize: 15, color: isWatched ? '#f1bfd3' : T.textMuted, transition: 'color 0.26s', textAlign: 'center', flexShrink: 0 }}>
          {bulkSelectMode ? (
            <input
              type="checkbox"
              checked={isSelected}
              aria-label={`Select ${item.title}`}
              onChange={(event) => onToggleSelected(item.id, event.target.checked)}
              onClick={(event) => event.stopPropagation()}
              style={{ width: 18, height: 18, accentColor: 'var(--theme-accent)' }}
            />
          ) : (isWatched ? <Check size={14} style={{ color: '#f4a8ca' }} /> : (idx + 1))}
        </div>
        <LazyPoster className="poster" src={poster} alt={`${item.title} poster`} eager={idx < 8} />

        <button className="title-btn" onClick={() => onOpenDetail(item)} style={TITLE_ROW_STATIC.titleBtn}>
          <div style={TITLE_ROW_STATIC.titleLine}>
            <span style={{ fontSize: 'clamp(18px, 2.4vw, 20px)', fontWeight: 700, lineHeight: 1.5, color: isWatched ? '#9df1c2' : 'var(--theme-text)', opacity: 1, transition: 'color 0.26s', fontFamily: 'var(--font-marvel-display)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block', maxWidth: '100%' }}>{item.title}</span>
            {item.episodes && <span style={{ fontSize: 9, color: T.textMuted, background: T.expandBg, border: `1px solid ${T.expandBorder}`, borderRadius: 3, padding: '1px 5px', fontFamily: 'var(--font-marvel-ui)', letterSpacing: 1, flexShrink: 0 }}>{item.episodes} EP</span>}
            <span style={{ fontSize: 14, color: typeMeta.color, opacity: 0.82, fontWeight: 700, letterSpacing: 0.6, display: 'flex', alignItems: 'center', gap: 2, fontFamily: 'var(--font-marvel-ui)', flexShrink: 0 }}><TypeIcon size={8} />{typeMeta.label}</span>
            <span style={{ fontSize: 8.5, color: releaseStatusStyleObj.color, background: releaseStatusStyleObj.background, border: `1px solid ${releaseStatusStyleObj.border}`, borderRadius: 3, padding: '1px 4px', letterSpacing: 1, fontFamily: 'var(--font-marvel-ui)', flexShrink: 0 }}>{releaseStatusText}</span>
            {!item.essential && <span style={{ fontSize: 8.5, color: T.textMuted, background: T.expandBg, border: `1px solid ${T.expandBorder}`, borderRadius: 3, padding: '1px 4px', letterSpacing: 1, fontFamily: 'var(--font-marvel-ui)', flexShrink: 0 }}>OPT</span>}
            <ChevRight size={10} style={{ color: T.textFaint, transition: 'transform 0.2s', flexShrink: 0, marginLeft: 2 }} />
          </div>
          <div className="meta-muted" style={TITLE_ROW_STATIC.genreMeta}>GENRES: {genres.join(' • ').toUpperCase()}</div>
        </button>

        <div className="row-actions" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', gap: 8, minWidth: 104, flexShrink: 0 }}>
          <div style={{ fontFamily: 'var(--font-marvel-ui)', fontSize: '12px', letterSpacing: 1.1, color: T.text, textAlign: 'right', fontWeight: 600, whiteSpace: 'nowrap' }}>{item.year || releaseLabel}</div>
          <div style={{ fontSize: 11, color: 'var(--theme-warning)', fontFamily: 'var(--font-marvel-ui)', letterSpacing: 0.6, whiteSpace: 'nowrap' }}>★ {rating || '—'}</div>
          <button
            className="wbtn status-pill"
            aria-label={`Open status menu for ${item.title}`}
            aria-haspopup="menu"
            aria-expanded={statusDropdown === item.id}
            onClick={(event) => onOpenStatus(event, item.id)}
            style={{ minWidth: 104, height: 28, padding: '0 10px', background: statusMeta.bg || 'transparent', color: statusMeta.color || T.textMuted, borderColor: `${statusMeta.color || T.surfaceBorder}66`, borderRadius: 999, fontSize: 10.5, fontFamily: 'var(--font-marvel-ui)', letterSpacing: 0.9, justifyContent: 'space-between' }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <RowStatusIcon size={10} />
              {statusLabelOverride || statusMeta.label}
            </span>
            <ChevDown size={10} style={{ opacity: 0.8, transform: statusDropdown === item.id ? 'rotate(180deg)' : 'none' }} />
          </button>
          <button className="wbtn" aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'} onClick={() => onToggleBookmark(item.id)} style={{ width: 24, height: 24, background: isBookmarked ? 'rgba(125,211,252,0.2)' : 'transparent', color: isBookmarked ? '#7dd3fc' : T.textMuted, borderColor: isBookmarked ? '#7dd3fc66' : `${T.surfaceBorder}` }}><Bookmark size={11} /></button>
          {!hideWatchToggle && (
            <button
              className="wbtn status-toggle"
              aria-label={isWatched ? `Mark ${item.title} as unwatched` : `Mark ${item.title} as watched`}
              title={isWatched ? 'Mark unwatched' : 'Mark watched'}
              onClick={(event) => {
                event.stopPropagation();
                onSetStatus(item.id, isWatched ? 'unwatched' : 'watched');
              }}
              style={{ width: 28, height: 28, background: statusMeta.bg || 'transparent', color: statusMeta.color || T.textMuted, borderColor: `${statusMeta.color || T.surfaceBorder}66` }}
            ><RowStatusIcon size={12} /></button>
          )}
          {isWorthy && <span style={{ fontSize: 10, fontWeight: 700, color: '#9bd6ff', border: '1px solid #7dc3ff88', borderRadius: 999, padding: '1px 6px', background: 'rgba(60,166,255,0.14)', letterSpacing: 1 }}>WORTHY</span>}
        </div>
        {isWatched && <Check size={12} style={{ position: 'absolute', top: 8, right: 8, color: '#9be8bc', filter: 'drop-shadow(0 0 6px rgba(155,232,188,0.75))' }} />}
      </div>
    </div>
  );
});


const PhaseRows = React.memo(function PhaseRows({ rows, renderRow }) {
  return (
    <div className="phase-rows-full">
      {rows.map((item, idx) => renderRow(item, idx))}
    </div>
  );
});
// ─── Component ───────────────────────────────────────────────────────────────
export default function MCUViewer() {
  const initialUiState = useMemo(() => readSavedUiState(), []);
  const [items,          setItems]          = useState(RAW);
  const [listMode,       setListMode]       = useState(initialUiState.listMode);
  const [search,         setSearch]         = useState(initialUiState.search);
  const [sortBy,         setSortBy]         = useState(initialUiState.sortBy);
  const [essentialOnly,  setEssOnly]        = useState(initialUiState.essentialOnly);
  const [watchedOnly,    setWatchedOnly]    = useState(initialUiState.watchedOnly);
  const [statusFilter,   setStatusFilter]   = useState(initialUiState.statusFilter);
  const [typeFilter,     setTypeFilter]     = useState(initialUiState.typeFilter);
  const [activePhase,    setActivePhase]    = useState(initialUiState.activePhase);
  const [sortOpen,       setSortOpen]       = useState(false);
  const [phaseOpen,      setPhaseOpen]      = useState(false);
  const [statusDropdown, setStatusDropdown] = useState(null);
  const [filterStatusOpen, setFilterStatusOpen] = useState(false);
  const [dockStatusOpen, setDockStatusOpen] = useState(false);
  const [filtersOpen,    setFiltersOpen]    = useState(initialUiState.filtersOpen);
  const [dropdownPos,    setDropdownPos]    = useState({ x: 0, y: 0 });
  const [darkMode,       setDarkMode]       = useState(true);
  const [expandedItem,   setExpandedItem]   = useState(null);
  const [expandedPhase,  setExpandedPhase]  = useState(null);
  const [celebPhase,     setCelebPhase]     = useState(null);
  const [editingDateId,  setEditingDateId]  = useState(null);
  const [headerCompact]  = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [heroIndex, setHeroIndex] = useState(() => {
    if (typeof window === 'undefined') return 0;
    const saved = Number(window.sessionStorage.getItem('mcu-hero-index-v1'));
    return Number.isFinite(saved) ? Math.max(0, saved) : 0;
  });
  const [currentHeroSrc, setCurrentHeroSrc] = useState(() => {
    if (typeof window === 'undefined') return '';
    return window.sessionStorage.getItem('mcu-hero-src-v1') || '';
  });
  const [detailItem,     setDetailItem]     = useState(null);
  const [detailData,     setDetailData]     = useState(null);
  const [detailPlotState, setDetailPlotState] = useState({ active: 'primary', primary: '', secondary: '', loadingSecondary: false, secondaryProvider: 'OMDb' });
  const [metaCache,      setMetaCache]      = useState({});
  const [detailLoading,  setDetailLoading]  = useState(false);
  const [detailPosterFailed, setDetailPosterFailed] = useState(false);
  const [posterCache,    setPosterCache]    = useState({});
  const [localPosterMap, setLocalPosterMap] = useState({});
  const [posterFetchState, setPosterFetchState] = useState({ active: false, done: 0, total: 0, message: '' });
  const [posterExportState, setPosterExportState] = useState({ active: false, done: 0, total: 0, message: '' });
  const [posterExportFailures, setPosterExportFailures] = useState({});
  const [settingsOpen,   setSettingsOpen]   = useState(false);
  const [showAllFiltersOverride, setShowAllFiltersOverride] = useState(false);
  const [profile,        setProfile]        = useState({ name: '', pfp: '' });
  const [uploadedAvatars,setUploadedAvatars]= useState([]);
  const [avatarCropSrc, setAvatarCropSrc] = useState('');
  const [themeMode,      setThemeMode]      = useState('classic');
  const [spoilerSafeMode, setSpoilerSafeMode] = useState(true);
  const [autoHideStatuses, setAutoHideStatuses] = useState(initialUiState.autoHideStatuses);
  const [viewMode, setViewMode] = useState(initialUiState.viewMode);
  const [densityMode, setDensityMode] = useState(initialUiState.densityMode);
  const [timelineMode,   setTimelineMode]   = useState(initialUiState.timelineMode);
  const [genreFilter] = useState('all');
  const [myLikes,        setMyLikes]        = useState({});
  const [myRating,       setMyRating]       = useState({});
  const [rewatchCount,   setRewatchCount]   = useState({});
  const [reviews,        setReviews]        = useState({});
  const [bookmarks,      setBookmarks]      = useState({});
  const [reviewCardTheme, setReviewCardTheme] = useState('midnight');
  const [reviewShareStatus, setReviewShareStatus] = useState({ type: '', message: '' });
  const [analyticsOpen,  setAnalyticsOpen]  = useState(false);
  const [bulkSelectMode, setBulkSelectMode] = useState(false);
  const [selectedIds,    setSelectedIds]    = useState(() => new Set());
  const [scrollCheckpoint, setScrollCheckpoint] = useState(initialUiState.scrollTop);
  const [metadataBuild, setMetadataBuild] = useState({ status: 'idle', currentTitle: '', done: 0, total: 0, failedIds: [] });
  const [grootMode, setGrootMode] = useState(false);
  const [worthyIds, setWorthyIds] = useState({});
  const [snapMode, setSnapMode] = useState(false);
  const [spiderSense, setSpiderSense] = useState(false);
  const [multiverseShuffle, setMultiverseShuffle] = useState(false);
  const [desktopTextScale, setDesktopTextScale] = useState(1);
  const [isDesktopViewport, setIsDesktopViewport] = useState(() => (typeof window !== 'undefined' ? window.innerWidth >= 1024 : false));
  const [lightningStrike, setLightningStrike] = useState(false);
  const [spiderDrop, setSpiderDrop] = useState(false);
  const headerMinimized = false;
  const phaseRefs  = useRef({});
  const sortRef    = useRef(null);
  const phaseRef   = useRef(null);
  const obsRef     = useRef(null);  const isScrolling= useRef(false);
  const mainRef    = useRef(null);
  const settingsRef= useRef(null);
  const sidebarRef = useRef(null);
  const heroIntervalRef = useRef(null);
  const restoredUiStateRef = useRef(false);
  const metadataBuildRef = useRef({ paused: false, running: false });

  useEffect(() => {
    const onResize = () => setIsDesktopViewport(window.innerWidth >= 1024);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const hasOverlay = sidebarOpen || settingsOpen || detailItem || analyticsOpen;
    if (!hasOverlay) return;
    window.history.pushState({ mcuOverlay: true }, '');
    const onBack = () => {
      if (detailItem) setDetailItem(null);
      else if (analyticsOpen) setAnalyticsOpen(false);
      else if (settingsOpen) setSettingsOpen(false);
      else if (sidebarOpen) setSidebarOpen(false);
    };
    window.addEventListener('popstate', onBack);
    return () => window.removeEventListener('popstate', onBack);
  }, [sidebarOpen, settingsOpen, detailItem, analyticsOpen]);

  useEffect(() => {
    const s = localStorage.getItem('mcu-v7');
    if (s) {
      try {
        const saved = JSON.parse(s);
        setItems(prev => prev.map(i => ({
          ...i,
          status: saved[i.id]?.status || 'unwatched',
          watchedDate: saved[i.id]?.watchedDate || null,
          statusChangedAt: saved[i.id]?.statusChangedAt || saved[i.id]?.watchedDate || null
        })));
      } catch {}
    }
  }, []);

  const persist = (next) => {
    const data = {};
    next.forEach(i => {
      if (i.status !== 'unwatched' || i.watchedDate) {
        data[i.id] = { status: i.status, watchedDate: i.watchedDate, statusChangedAt: i.statusChangedAt || i.watchedDate || null };
      }
    });
    localStorage.setItem('mcu-v7', JSON.stringify(data));
  };

  const setStatusDirect = (id, newStatus) => {
    setItems(prev => {
      const n = prev.map(i => {
        if (i.id !== id) return i;
        const updated = { ...i, status: newStatus, statusChangedAt: new Date().toISOString() };
        if (newStatus === 'watched' && !i.watchedDate) {
          updated.watchedDate = new Date().toISOString().slice(0, 16);
        } else if (newStatus !== 'watched') {
          updated.watchedDate = null;
        }
        return updated;
      });
      const item = n.find(i => i.id === id);
      if (newStatus === 'watched' && item) {
        if (item.title.toLowerCase().includes('infinity war')) {
          const watchedCount = n.filter(entry => entry.status === 'watched').length;
          const threshold = Math.ceil(n.length / 2);
          if (watchedCount >= threshold) {
            setSnapMode(true);
            setTimeout(() => setSnapMode(false), 1800);
          }
        }
        const phaseItems = n.filter(i => i.phase === item.phase && (listMode === 'core' ? coreIds.has(i.id) : true));
        const allDone = phaseItems.every(i => i.status === 'watched');
        if (allDone) {
          setCelebPhase(item.phase);
          setTimeout(() => setCelebPhase(null), 2400);
        }
      }
      if (AUTO_HIDDEN_STATUSES.has(newStatus)) setAutoHideStatuses(true);
      if (newStatus === 'unwatched') setRewatchCount(prevCount => ({ ...prevCount, [id]: 0 }));
      persist(n);
      return n;
    });
    if (watchedOnly && newStatus === 'watched') {
      setWatchedOnly(false);
      setStatusFilter(null);
    }
  };

  useEffect(() => {
    const normalized = search.trim().toLowerCase();
    if (normalized === 'groot') {
      setGrootMode(v => !v);
    }
    if (normalized === 'multiverse') {
      setMultiverseShuffle(v => !v);
    }
    if (normalized === 'snap') {
      setSnapMode(true);
      setTimeout(() => setSnapMode(false), 1800);
    }
    if (normalized === 'spider man' || normalized === 'spiderman') {
      setSpiderSense(true);
      setSpiderDrop(true);
      setTimeout(() => setSpiderDrop(false), 2600);
    } else {
      setSpiderSense(normalized.includes('spider'));
    }
  }, [search]);

  useEffect(() => {
    const el = mainRef.current;
    let scrollSaveTimer;
    const getCurrentScrollTop = () => {
      const canScrollMain = el && el.scrollHeight > el.clientHeight + 1;
      return canScrollMain ? el.scrollTop : window.scrollY;
    };
    const onScroll = () => {
      isScrolling.current = true;
      clearTimeout(isScrolling._t);
      clearTimeout(scrollSaveTimer);
      isScrolling._t = setTimeout(() => { isScrolling.current = false; }, 150);
      scrollSaveTimer = setTimeout(() => setScrollCheckpoint(getCurrentScrollTop()), 220);
    };
    el?.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      clearTimeout(scrollSaveTimer);
      el?.removeEventListener('scroll', onScroll);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    // Phase selection is a filter, so do not rewrite it from scroll position.
    // Rewriting the active phase while the user scrolls can temporarily filter
    // every other phase out of the DOM, which looks like the list disappears.
    return () => obsRef.current?.disconnect();
  }, []);

  useEffect(() => {
    const fn = e => { if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);
  useEffect(() => {
    const fn = e => { if (phaseRef.current && !phaseRef.current.contains(e.target)) setPhaseOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);
  useEffect(() => {
    const fn = e => { if (settingsRef.current && !settingsRef.current.contains(e.target)) setSettingsOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const scrollTo = id => {
    const el = phaseRefs.current[id];
    const container = mainRef.current;
    if (!el) return;
    const canScrollMain = container && container.scrollHeight > container.clientHeight + 1;
    if (canScrollMain) {
      const containerTop = container.getBoundingClientRect().top;
      const elTop = el.getBoundingClientRect().top;
      const offset = elTop - containerTop + container.scrollTop - 16;
      container.scrollTo({ top: offset, behavior: 'smooth' });
      return;
    }
    const top = el.getBoundingClientRect().top + window.scrollY - 82;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  const exportProgress = async () => {
    const payload = items.map(({ id, status, watchedDate, statusChangedAt }) => ({ id, status, watchedDate, statusChangedAt }));
    const content = JSON.stringify(payload, null, 2);
    if (Capacitor.isNativePlatform()) {
      const fileName = `mcu-progress-${Date.now()}.json`;
      const res = await Filesystem.writeFile({ path: fileName, data: content, directory: Directory.Documents, recursive: true });
      await Share.share({ title: 'MCU Progress Export', text: 'MCU progress backup JSON', url: res.uri });
      return;
    }
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mcu-progress.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareProgressCard = async () => {
    try {
      const recent = recentActivity.slice(0, 3);
      const currentPhase = activePhase === 0 ? stickyPhaseProgress.label : (PHASES.find(p => p.id === activePhase)?.name || stickyPhaseProgress.label);
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1350;
      const ctx = canvas.getContext('2d');
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#120e2f');
      gradient.addColorStop(1, '#2e143a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ff5ea8';
      ctx.font = '700 60px sans-serif';
      ctx.fillText('MCU VIEWING PROGRESS', 72, 110);
      ctx.fillStyle = theme.text;
      ctx.font = '700 180px sans-serif';
      ctx.fillText(`${pct}%`, 72, 300);
      ctx.font = '500 44px sans-serif';
      ctx.fillText(`Current Phase: ${currentPhase}`, 72, 380);
      ctx.fillText(`Completed: ${totalWatched}/${activeItems.length}`, 72, 445);
      ctx.fillText(`Recent Completion`, 72, 530);

      const drawPoster = async (item, idx) => {
        const x = 72 + idx * 310;
        const y = 570;
        const w = 270;
        const h = 405;
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = posterSrc(item);
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });
        ctx.drawImage(img, x, y, w, h);
        ctx.fillStyle = 'rgba(0,0,0,0.52)';
        ctx.fillRect(x, y + h - 80, w, 80);
        ctx.fillStyle = '#fff';
        ctx.font = '600 22px sans-serif';
        ctx.fillText(item.title.slice(0, 20), x + 10, y + h - 28);
      };

      await Promise.all(recent.map((item, idx) => drawPoster(item, idx).catch(() => null)));
      ctx.fillStyle = '#dacfff';
      ctx.font = '500 30px sans-serif';
      ctx.fillText('Shared from MCU Viewing Order', 72, 1260);

      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png', 0.95));
      if (!blob) return;
      const file = new File([blob], `mcu-progress-card-${Date.now()}.png`, { type: 'image/png' });
      if (Capacitor.isNativePlatform()) {
        const base64 = await new Promise(resolve => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(String(reader.result || '').split(',')[1] || '');
          reader.readAsDataURL(file);
        });
        const res = await Filesystem.writeFile({ path: file.name, data: base64, directory: Directory.Cache });
        await Share.share({ title: 'My MCU Progress', text: `${pct}% complete · ${currentPhase}`, url: res.uri });
        return;
      }
      const url = URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to share progress card', e);
    }
  };

  const importProgress = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = JSON.parse(String(reader.result));
        setItems(prev => {
          const map = new Map(imported.map(x => [x.id, x]));
          const next = prev.map(i => map.has(i.id) ? { ...i, status: map.get(i.id).status || 'unwatched', watchedDate: map.get(i.id).watchedDate || null, statusChangedAt: map.get(i.id).statusChangedAt || map.get(i.id).watchedDate || null } : i);
          persist(next);
          return next;
        });
      } catch {}
    };
    reader.readAsText(file);
  };

  const exportFetchedPosters = async (mode = 'all') => {
    const failedIds = new Set(Object.keys(posterExportFailures).map(Number));
    const sourceItems = mode === 'failed' ? activeItems.filter(item => failedIds.has(item.id)) : activeItems;
    const exportable = sourceItems.filter(item => {
      const src = localPosterSrc(item) || posterCache[item.id];
      return src && !src.includes('placehold.co');
    });
    if (!exportable.length) {
      setPosterExportState({ active: false, done: 0, total: 0, message: mode === 'failed' ? 'No failed poster exports to retry.' : 'No fetched or local posters to export yet.' });
      return;
    }

    setPosterExportState({ active: true, done: 0, total: exportable.length, message: mode === 'failed' ? 'Retrying failed poster exports…' : 'Preparing poster image downloads…' });
    const manifest = [];
    const nextFailures = { ...posterExportFailures };

    for (const [index, item] of exportable.entries()) {
      const src = localPosterSrc(item) || posterCache[item.id];
      const ext = getPosterExtension(src);
      const filename = posterExportName(item, ext);
      try {
        const response = await fetch(src);
        if (!response.ok) throw new Error('Poster unavailable');
        const blob = await response.blob();
        manifest.push({ id: item.id, title: item.title, file: filename, source: src });

        if (Capacitor.isNativePlatform()) {
          const base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
          await Filesystem.writeFile({ path: `mcu-posters/${filename}`, data: base64, directory: Directory.Documents, recursive: true });
        } else {
          triggerDownload(blob, filename);
        }
        delete nextFailures[item.id];
      } catch {
        nextFailures[item.id] = { id: item.id, title: item.title, source: src, failedAt: new Date().toISOString() };
        manifest.push({ id: item.id, title: item.title, file: filename, source: src, error: 'Could not export this poster image.' });
      }
      setPosterExportFailures({ ...nextFailures });
      safeLocalStorageSetItem(CACHE_KEYS.posterExportFailures, JSON.stringify(nextFailures));
      setPosterExportState({ active: true, done: index + 1, total: exportable.length, message: `${mode === 'failed' ? 'Retried' : 'Exported'} ${index + 1}/${exportable.length} poster images…` });
      await new Promise(resolve => setTimeout(resolve, 80));
    }

    const manifestBlob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), mode, posters: manifest }, null, 2)], { type: 'application/json' });
    if (Capacitor.isNativePlatform()) {
      const data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
        reader.onerror = reject;
        reader.readAsDataURL(manifestBlob);
      });
      const result = await Filesystem.writeFile({ path: mode === 'failed' ? 'mcu-posters/failed-manifest.json' : 'mcu-posters/manifest.json', data, directory: Directory.Documents, recursive: true });
      await Share.share({ title: 'MCU Poster Images', text: 'Exported poster images and manifest', url: result.uri });
    } else {
      triggerDownload(manifestBlob, mode === 'failed' ? 'mcu-posters-failed-manifest.json' : 'mcu-posters-manifest.json');
    }
    const failedCount = Object.keys(nextFailures).length;
    setPosterExportState({ active: false, done: exportable.length, total: exportable.length, message: `${mode === 'failed' ? 'Retried' : 'Exported'} ${exportable.length} poster images.${failedCount ? ` ${failedCount} failed export${failedCount === 1 ? '' : 's'} saved for retry.` : ''}` });
  };

  const STATUS_SORT_ORDER = { watching: 0, 'plan-to-watch': 1, unwatched: 2, watched: 3, 'on-hold': 4, dropped: 5 };
  const coreIds = useMemo(() => new Set(ESSENTIAL_LIST.map(i => i.id)), []);
  const openDetail = useCallback((item) => setDetailItem(item), []);
  const toggleBookmark = useCallback((id) => setBookmarks(p => ({ ...p, [id]: p[id] ? 0 : 1 })), []);
  const toggleSelected = useCallback((id, checked) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);
  const clearBulkSelection = useCallback(() => setSelectedIds(new Set()), []);

  const applyBulkStatus = (newStatus) => {
    if (!selectedIds.size) return;
    setItems(prev => {
      const now = new Date().toISOString();
      const n = prev.map(i => {
        if (!selectedIds.has(i.id)) return i;
        const updated = { ...i, status: newStatus, statusChangedAt: now };
        if (newStatus === 'watched' && !i.watchedDate) updated.watchedDate = now.slice(0, 16);
        else if (newStatus !== 'watched') updated.watchedDate = null;
        return updated;
      });
      if (AUTO_HIDDEN_STATUSES.has(newStatus)) setAutoHideStatuses(true);
      persist(n);
      return n;
    });
    clearBulkSelection();
    setBulkSelectMode(false);
  };

  const markPhaseWatched = (phaseId, newStatus) => {
    setItems(prev => {
      const n = prev.map(i => {
        if (i.phase !== phaseId) return i;
        if (listMode === 'core' && !coreIds.has(i.id)) return i;
        const updated = { ...i, status: newStatus, statusChangedAt: new Date().toISOString() };
        if (newStatus === 'watched' && !i.watchedDate) {
          updated.watchedDate = new Date().toISOString().slice(0, 16);
        } else if (newStatus !== 'watched') {
          updated.watchedDate = null;
        }
        return updated;
      });
      if (AUTO_HIDDEN_STATUSES.has(newStatus)) setAutoHideStatuses(true);
      persist(n);
      return n;
    });
  };

  const { filtered, grouped, phaseKeys } = useMemo(() => {
    const f = items.filter(i => {
      if (listMode === 'core' && !coreIds.has(i.id)) return false;
      if (showAllFiltersOverride) return true;
      if (listMode === 'core' && essentialOnly && !i.essential) return false;
      const statusFilterIsAutoHidden = statusFilter && HIDDEN_FILTER_STATUSES.has(statusFilter);
      if (autoHideStatuses && !watchedOnly && !statusFilterIsAutoHidden && AUTO_HIDDEN_STATUSES.has(i.status)) return false;
      if (watchedOnly && i.status !== 'watched') return false;
      if (statusFilter && i.status !== statusFilter) return false;
      if (typeFilter && i.type !== typeFilter) return false;
      if (activePhase && i.phase !== activePhase) return false;
      if (timelineMode === 'studio' && i.order % 2 === 0) return true;
      if (timelineMode === 'whatif' && i.type !== 'short') return true;
      if (genreFilter !== 'all' && i.type !== genreFilter) return false;
      const searchTerm = search.toLowerCase();
      return i.title.toLowerCase().includes(searchTerm) || i.prereq.toLowerCase().includes(searchTerm);
    }).sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'year') return a.year - b.year;
      if (sortBy === 'runtime') return (a.episodes || (a.type === 'film' ? 2.3 : 6)) - (b.episodes || (b.type === 'film' ? 2.3 : 6));
      if (sortBy === 'watched') return (b.watchedDate || '').localeCompare(a.watchedDate || '');
      if (sortBy === 'status') return (STATUS_SORT_ORDER[a.status] ?? 99) - (STATUS_SORT_ORDER[b.status] ?? 99);
      return a.order - b.order;
    });
    const g = {};
    f.forEach(i => (g[i.phase] = g[i.phase] || []).push(i));
    const pk = Object.keys(g).map(Number).sort((a, b) => a - b);
    return { filtered: f, grouped: g, phaseKeys: pk };
  }, [items, listMode, essentialOnly, watchedOnly, statusFilter, autoHideStatuses, typeFilter, activePhase, timelineMode, genreFilter, search, sortBy, coreIds, showAllFiltersOverride, localPosterMap]);

  const activeItems = useMemo(
    () => listMode === 'core' ? items.filter(i => coreIds.has(i.id)) : items,
    [items, listMode, coreIds]
  );


  useEffect(() => {
    const timer = setTimeout(() => {
      const container = mainRef.current;
      if (container) container.scrollTop = 0;
      window.scrollTo({ top: 0, behavior: 'auto' });
      restoredUiStateRef.current = true;
    }, 180);
    return () => clearTimeout(timer);
  }, []);

  useDebouncedEffect(() => {
    if (!restoredUiStateRef.current) return;
    const container = mainRef.current;
    const canScrollMain = container && container.scrollHeight > container.clientHeight + 1;
    const scrollTop = canScrollMain ? container.scrollTop : window.scrollY;
    safeLocalStorageSetItem(CACHE_KEYS.uiState, JSON.stringify({
      listMode,
      search,
      sortBy,
      essentialOnly,
      watchedOnly,
      statusFilter,
      typeFilter,
      activePhase,
      filtersOpen,
      viewMode,
      densityMode,
      timelineMode,
      autoHideStatuses,
      scrollTop,
    }));
  }, [listMode, search, sortBy, essentialOnly, watchedOnly, statusFilter, typeFilter, activePhase, filtersOpen, viewMode, densityMode, timelineMode, autoHideStatuses, scrollCheckpoint], 300);
  const totalWatched = useMemo(() => activeItems.filter(i => i.status === 'watched').length, [activeItems]);
  const essTotal     = useMemo(() => activeItems.filter(i => i.essential).length, [activeItems]);
  const essWatched   = useMemo(() => activeItems.filter(i => i.essential && i.status === 'watched').length, [activeItems]);
  const pct = activeItems.length ? Math.round((totalWatched / activeItems.length) * 100) : 0;

  const stickyPhaseProgress = useMemo(() => {
    if (activePhase === 0) return { label: 'All Phases', done: totalWatched, total: activeItems.length, pct };
    const phaseItems = activeItems.filter(i => i.phase === activePhase);
    const done = phaseItems.filter(i => i.status === 'watched').length;
    const total = phaseItems.length;
    return { label: `Phase ${activePhase}`, done, total, pct: total ? Math.round((done / total) * 100) : 0 };
  }, [activePhase, activeItems, totalWatched, pct]);

  const CAST_MAP = {
    'Iron Man': ['Robert Downey Jr.', 'Gwyneth Paltrow', 'Jeff Bridges'],
    'The Avengers': ['Robert Downey Jr.', 'Chris Evans', 'Scarlett Johansson'],
    'Captain America: The First Avenger': ['Chris Evans', 'Hayley Atwell', 'Sebastian Stan'],
    'Thor': ['Chris Hemsworth', 'Tom Hiddleston', 'Natalie Portman'],
  };
  const saveImageToDevice = useCallback(async (blob, filename) => {
    const base64 = await blobToBase64(blob);
    const isNative = Capacitor.isNativePlatform();
    if (isNative && Capacitor.getPlatform() === 'android') {
      const dataUri = `data:image/png;base64,${base64}`;
      try {
        try { await Media.createAlbum({ name: 'MCUViewingOrder' }); } catch {}
        const albums = await Media.getAlbums();
        const album = (albums?.albums || []).find(a => a.name === 'MCUViewingOrder');
        if (album?.identifier) {
          await Media.savePhoto({ path: dataUri, albumIdentifier: album.identifier, fileName: filename.replace(/\.png$/i, '') });
          return { method: 'mediastore' };
        }
      } catch {}
      await Filesystem.writeFile({
        path: `Pictures/MCUViewingOrder/${filename}`,
        data: base64,
        directory: Directory.ExternalStorage,
        recursive: true,
      });
      return { method: 'filesystem' };
    }
    triggerDownload(blob, filename);
    return { method: 'download' };
  }, []);

  const localPosterSrc = (item) => {
    const mapped = POSTER_OVERRIDES[item.id] || localPosterMap[item.id] || localPosterMap[String(item.id)] || localPosterMap[slugifyPosterName(item.title)];
    if (!mapped) return '';
    return mapped.startsWith('/') ? mapped : `/posters/${mapped}`;
  };
  const posterSrc = (item) => localPosterSrc(item) || posterCache[item.id] || `https://placehold.co/220x330/1a1f33/f7c4de?text=${encodeURIComponent(item.title+'\n'+item.year)}`;
  const heroPosters = useMemo(() => {
    const posters = filtered
      .map(item => localPosterSrc(item))
      .filter(Boolean);
    return posters
      .map(src => ({ src, order: Math.random() }))
      .sort((a, b) => a.order - b.order)
      .map(({ src }) => src);
  }, [filtered, localPosterMap]);
  const visibleHeroPosters = useMemo(() => {
    if (!heroPosters.length) return [];
    return Array.from({ length: Math.min(10, heroPosters.length) }, (_, offset) => heroPosters[(heroIndex + offset) % heroPosters.length]);
  }, [heroPosters, heroIndex]);
  const activeHeroSrc = heroPosters.length ? (heroPosters[heroIndex % heroPosters.length] || heroPosters[0] || '') : '';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.sessionStorage.setItem('mcu-hero-index-v1', String(heroIndex));
  }, [heroIndex]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!currentHeroSrc) return;
    window.sessionStorage.setItem('mcu-hero-src-v1', currentHeroSrc);
  }, [currentHeroSrc]);

  useEffect(() => {
    if (!activeHeroSrc) {
      setCurrentHeroSrc('');
      return;
    }

    const normalizedIndex = heroIndex % heroPosters.length;
    setCurrentHeroSrc(activeHeroSrc);

    const nextSrcCandidate = heroPosters[(normalizedIndex + 10) % heroPosters.length];
    if (nextSrcCandidate) {
      const img = new Image();
      img.src = nextSrcCandidate;
    }
  }, [heroPosters, heroIndex, activeHeroSrc]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return undefined;
    if (heroPosters.length <= 1) return undefined;

    const HERO_INTERVAL_MS = 5000;
    const startHeroCycle = () => {
      if (heroIntervalRef.current) return;
      heroIntervalRef.current = window.setInterval(() => {
        setHeroIndex(i => (i + 1) % heroPosters.length);
      }, HERO_INTERVAL_MS);
    };
    const stopHeroCycle = () => {
      if (!heroIntervalRef.current) return;
      window.clearInterval(heroIntervalRef.current);
      heroIntervalRef.current = null;
    };
    const onVisibility = () => {
      if (document.visibilityState === 'visible') startHeroCycle();
      else stopHeroCycle();
    };

    onVisibility();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      stopHeroCycle();
    };
  }, [heroPosters.length]);

  const spoilerSafe = useMemo(() => spoilerSafeMode, [spoilerSafeMode]);

  const memoryScore = useMemo(() => Math.max(0, Math.min(100, Math.round((totalWatched / Math.max(1, activeItems.length)) * 100) - (spoilerSafe ? 10 : 0))), [totalWatched, activeItems.length, spoilerSafe]);
  const TMDB_DIRECT_KEY = import.meta.env.VITE_TMDB_API_KEY || '65eda48cf5803f22304fd21f4f06a35e';

  const fetchTmdbPoster = async (item, { force = false } = {}) => {
    const local = localPosterSrc(item);
    if (local) return local;
    if (item.type === 'short' && !TMDB_LOOKUP_OVERRIDES[item.id]) return '';
    if (!force && posterCache[item.id]) return posterCache[item.id];
    const stableLookup = TMDB_LOOKUP_OVERRIDES[item.id];
    const q = encodeURIComponent(cleanLookupTitle(item.title));
    const y = encodeURIComponent(String(item.year || ''));
    const stableParams = stableLookup ? `&tmdbId=${encodeURIComponent(stableLookup.tmdbId)}&mediaType=${encodeURIComponent(stableLookup.mediaType)}` : '';
    try {
      const proxyRes = await fetchWithTimeout(`/api/tmdb/poster?title=${q}&year=${y}${stableParams}`, {}, 7000);
      if (proxyRes.ok) {
        const payload = await proxyRes.json();
        if (payload?.poster) return payload.poster;
      }
    } catch {}

    if (!TMDB_DIRECT_KEY) return '';
    try {
      if (stableLookup) {
        const detailRes = await fetchWithTimeout(`https://api.themoviedb.org/3/${stableLookup.mediaType}/${stableLookup.tmdbId}?api_key=${TMDB_DIRECT_KEY}&language=en-US`, {}, 7000);
        const detail = await detailRes.json();
        return detail?.poster_path ? `https://image.tmdb.org/t/p/w500${detail.poster_path}` : '';
      }
      const params = new URLSearchParams({ query: cleanLookupTitle(item.title), include_adult: 'false', language: 'en-US', page: '1', year: String(item.year || '') });
      const res = await fetchWithTimeout(`https://api.themoviedb.org/3/search/multi?api_key=${TMDB_DIRECT_KEY}&${params.toString()}`, {}, 7000);
      const data = await res.json();
      const best = (data?.results || []).find(r => r?.poster_path && (r.media_type === 'movie' || r.media_type === 'tv'));
      return best?.poster_path ? `https://image.tmdb.org/t/p/w500${best.poster_path}` : '';
    } catch {
      return '';
    }
  };
  const fetchWithTimeout = async (url, options = {}, timeoutMs = 9000) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await fetch(url, { ...options, signal: controller.signal });
    } finally {
      clearTimeout(timer);
    }
  };

  const fetchTmdbDetail = async (item) => {
    if (item.type === 'short' && !TMDB_LOOKUP_OVERRIDES[item.id]) return null;
    const stableLookup = TMDB_LOOKUP_OVERRIDES[item.id];
    const q = encodeURIComponent(cleanLookupTitle(item.title));
    const y = encodeURIComponent(String(item.year || ''));
    const stableParams = stableLookup ? `&tmdbId=${encodeURIComponent(stableLookup.tmdbId)}&mediaType=${encodeURIComponent(stableLookup.mediaType)}` : '';
    try {
      const r = await fetchWithTimeout(`/api/tmdb/poster?title=${q}&year=${y}&details=1${stableParams}`, {}, 7000);
      if (!r.ok) return null;
      const payload = await r.json();
      return payload?.details || null;
    } catch {
      return null;
    }
  };
  const normalizeDetailData = ({ item, tmdb = null, omdb = null, fallback = {} }) => {
    const expectedYear = Number(item.year);
    const tmdbYear = Number(tmdb?.Year);
    const omdbYear = Number(String(omdb?.year || '').slice(0, 4));
    const trustTmdbYear = Number.isFinite(tmdbYear) && Math.abs(tmdbYear - expectedYear) <= 1;
    const trustOmdbYear = Number.isFinite(omdbYear) && Math.abs(omdbYear - expectedYear) <= 1;
    return {
      Poster: (trustTmdbYear ? tmdb?.Poster : '') || fallback.Poster || posterCache[item.id] || '',
      Year: (trustTmdbYear ? tmdb?.Year : '') || (trustOmdbYear ? omdb?.year : '') || fallback.Year || String(item.year),
      Plot: (trustOmdbYear ? omdb?.plot : '') || (trustTmdbYear ? tmdb?.Plot : '') || fallback.Plot || item.desc,
      Released: (trustTmdbYear ? tmdb?.Released : '') || (trustOmdbYear ? omdb?.released : '') || fallback.Released || metaCache[item.id]?.released || '',
      Actors: (trustTmdbYear ? tmdb?.Actors : '') || fallback.Actors || metaCache[item.id]?.cast || '',
      imdbRating: (trustOmdbYear ? omdb?.rating : '') || (trustTmdbYear ? tmdb?.imdbRating : '') || fallback.imdbRating || metaCache[item.id]?.rating || 'N/A',
    };
  };

  const fetchOmdbInfo = async (item) => {
    const q = encodeURIComponent(cleanLookupTitle(item.title));
    const y = encodeURIComponent(String(item.year || ''));
    try {
      const proxied = await fetchWithTimeout(`/api/omdb/rating?title=${q}&year=${y}`, {}, 7000);
      if (proxied.ok) {
        const payload = await proxied.json();
        return {
          rating: payload?.rating || '',
          released: payload?.released || '',
          plot: payload?.plot || '',
          year: payload?.year || '',
        };
      }
    } catch {}
    try {
      const direct = await fetchWithTimeout(`https://www.omdbapi.com/?apikey=${OMDB_RATINGS_KEY}&t=${q}&y=${y}&plot=short`, {}, 7000);
      const data = await direct.json();
      return {
        rating: data?.imdbRating && data.imdbRating !== 'N/A' ? data.imdbRating : '',
        released: data?.Released && data.Released !== 'N/A' ? data.Released : '',
        plot: data?.Plot && data.Plot !== 'N/A' ? data.Plot : '',
        year: data?.Year && data.Year !== 'N/A' ? data.Year : '',
      };
    } catch {}
    return { rating: '', released: '', plot: '', year: '' };
  };
  const cleanLookupTitle = (title) => title.replace(/\sS\d.*$/i, '').replace(/\sEps?.*$/i, '').trim();

  const isRealReleaseDate = (dateStr) => /^\d{4}-\d{2}-\d{2}$/.test(String(dateStr || ''));

  const parseRealReleaseDate = (dateStr) => {
    if (!isRealReleaseDate(dateStr)) return null;
    const parsed = new Date(`${dateStr}T00:00:00`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  const releaseInfoFor = (item) => {
    const stored = RELEASE_INFO[item.title] || {};
    return {
      date: item.releaseDate || stored.date || metaCache[item.id]?.released || '',
      label: item.releaseLabel || stored.label || '',
      status: item.releaseStatus || stored.status || '',
    };
  };

  const releaseStatusFor = (item, now = new Date()) => {
    const info = releaseInfoFor(item);
    const parsed = parseRealReleaseDate(info.date);
    if (parsed) return parsed > now ? 'upcoming' : 'released';
    if (info.status === 'released') return 'released';
    if (info.status === 'upcoming') return 'upcoming';
    if (Number(item.year) && Number(item.year) < now.getFullYear()) return 'released';
    return 'TBA';
  };

  const releaseStatusLabel = (status) => status === 'TBA' ? 'TBA' : status.charAt(0).toUpperCase() + status.slice(1);

  const releaseStatusStyle = (status) => ({
    released: { color: '#3ec47a', background: 'rgba(62,196,122,0.1)', border: 'rgba(62,196,122,0.35)' },
    upcoming: { color: 'var(--theme-accent-alt)', background: 'rgba(232,184,75,0.12)', border: 'rgba(232,184,75,0.38)' },
    TBA: { color: '#a7b1c2', background: 'rgba(167,177,194,0.1)', border: 'rgba(167,177,194,0.28)' },
  }[status] || { color: T.textMuted, background: T.expandBg, border: T.expandBorder });

  const formatReleaseDate = (dateStr, fallbackYear, label = '', status = '') => {
    const d = parseRealReleaseDate(dateStr);
    if (d) return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    if (label) return label;
    if (status === 'TBA') return Number(fallbackYear) ? `${fallbackYear} · TBA` : 'TBA';
    return Number(fallbackYear) ? String(fallbackYear) : 'TBA';
  };

  const inferGenre = (item) => {
    const t = item.title.toLowerCase();
    if (t.includes('guardians') || t.includes('captain marvel') || t.includes('marvels') || t.includes('secret invasion')) return 'Sci-Fi';
    if (t.includes('doctor strange') || t.includes('wanda') || t.includes('agatha')) return 'Fantasy';
    if (t.includes('what if') || t.includes('i am groot') || t.includes('friendly neighborhood')) return 'Animation';
    if (t.includes('moon knight') || t.includes('punisher') || t.includes('daredevil')) return 'Crime';
    if (item.type === 'series') return 'Drama';
    return 'Action';
  };

  const inferGenres = (item) => {
    const g = new Set([inferGenre(item)]);
    const t = item.title.toLowerCase();
    if (t.includes('winter soldier') || t.includes('secret invasion')) g.add('Thriller');
    if (t.includes('guardians') || t.includes('groot') || t.includes('she-hulk')) g.add('Comedy');
    if (t.includes('moon knight') || t.includes('agatha') || t.includes('multiverse')) g.add('Mystery');
    if (item.type === 'series') g.add('Serial');
    return [...g].slice(0, 3);
  };

  const nextUnwatched = useMemo(() => filtered.find(i => i.status !== 'watched') || null, [filtered]);
  const allWatched = useMemo(() => activeItems.length > 0 && activeItems.every(i => i.status === 'watched'), [activeItems]);
  const recentActivity = useMemo(() => [...activeItems].filter(i => i.watchedDate).sort((a,b) => (b.watchedDate||'').localeCompare(a.watchedDate||'')).slice(0,5), [activeItems]);
  const recentlyWatchedItems = useMemo(() => [...activeItems]
    .filter(i => i.status === 'watched' && i.watchedDate)
    .sort((a, b) => (b.watchedDate || b.statusChangedAt || '').localeCompare(a.watchedDate || a.statusChangedAt || ''))
    .slice(0, 4), [activeItems]);
  const totalEntries = activeItems.length;
  const seriesCount = activeItems.filter(i => i.type === 'series').length;
  const filmCount = activeItems.filter(i => i.type === 'film').length;
  const estRuntimeHours = Math.round(((filmCount * 2.3) + (seriesCount * 6.0)) * 10) / 10;
  const remainingHours = Math.max(0, Math.round((estRuntimeHours * (1 - pct / 100)) * 10) / 10);

  const calendarItems = useMemo(() => {
    const now = new Date();
    const withDates = activeItems.map(item => {
      const info = releaseInfoFor(item);
      const parsed = parseRealReleaseDate(info.date);
      const releaseStatus = releaseStatusFor(item, now);
      const yearSort = Number(item.year) || 9999;
      return {
        item,
        rawDate: info.date,
        label: info.label,
        parsed,
        releaseStatus,
        hasRealDate: Boolean(parsed),
        sortTime: parsed ? parsed.getTime() : Date.UTC(yearSort, 11, 31),
      };
    }).sort((a, b) => a.sortTime - b.sortTime || a.item.order - b.item.order);
    return {
      upcoming: withDates.filter(x => x.releaseStatus === 'upcoming' && x.hasRealDate),
      released: withDates.filter(x => x.releaseStatus === 'released'),
      tba: withDates.filter(x => x.releaseStatus === 'TBA' || (x.releaseStatus === 'upcoming' && !x.hasRealDate)),
    };
  }, [activeItems, metaCache]);

  const estimateRuntimeHours = useCallback((item) => {
    if (!item) return 0;
    if (item.type === 'film') return 2.3;
    if (item.type === 'short') return 0.2;
    return Math.max(0.5, (Number(item.episodes) || 6) * 0.75);
  }, []);

  const totalWatchedHours = useMemo(() => activeItems
    .filter(i => i.status === 'watched')
    .reduce((sum, item) => sum + estimateRuntimeHours(item) * (1 + (rewatchCount[item.id] || 0)), 0), [activeItems, estimateRuntimeHours, rewatchCount]);

  const historyItems = useMemo(() => [...activeItems]
    .filter(i => i.watchedDate || rewatchCount[i.id] || myRating[i.id] || reviews[i.id])
    .sort((a, b) => (b.watchedDate || b.statusChangedAt || '').localeCompare(a.watchedDate || a.statusChangedAt || '')), [activeItems, myRating, reviews, rewatchCount]);

  const setReviewRating = (id, rating) => setMyRating(prev => ({ ...prev, [id]: rating }));

  const drawWrappedText = (ctx, text, x, y, maxWidth, lineHeight, maxLines = 3) => {
    const words = String(text || '').split(/\s+/).filter(Boolean);
    let line = '';
    let lineCount = 0;
    for (let i = 0; i < words.length; i += 1) {
      const testLine = line ? `${line} ${words[i]}` : words[i];
      if (ctx.measureText(testLine).width > maxWidth && line) {
        ctx.fillText(line, x, y + (lineCount * lineHeight));
        line = words[i];
        lineCount += 1;
        if (lineCount >= maxLines - 1) break;
      } else {
        line = testLine;
      }
    }
    const remaining = words.slice(words.findIndex(w => line.includes(w))).join(' ');
    const finalLine = lineCount >= maxLines - 1 && ctx.measureText(line).width > maxWidth * 0.96 ? `${line.slice(0, Math.max(0, line.length - 1))}…` : line;
    ctx.fillText(finalLine || remaining || '', x, y + (lineCount * lineHeight));
  };

  const shareReviewCard = async (item) => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1600; canvas.height = 2200;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const themes = {
        midnight: { page: '#0b1020', card: '#0e162e', text: '#ffffff', subtext: '#a7b1c2' },
        stark: { page: '#111111', card: '#1f1f1f', text: '#f5f5f5', subtext: '#c9c9c9' },
        vibranium: { page: '#051a24', card: '#0a2d3a', text: '#ecfbff', subtext: '#9fd3de' },
      };
      const theme = themes[reviewCardTheme] || themes.midnight;
      const padding = 88;
      const cardX = padding;
      const cardY = 130;
      const cardW = canvas.width - (padding * 2);
      const posterW = 460;
      const posterH = 690;
      const posterX = cardX + 52;
      const posterY = cardY + 120;
      ctx.fillStyle = theme.page;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = posterSrc(item);
      await new Promise((res) => { img.onload = res; img.onerror = res; });
      const rating = myRating[item.id] || 0;
      const reviewText = (reviews[item.id] || '').trim();
      const compact = reviewText.length < 90;
      const topPanelH = compact ? 720 : 790;
      const cutoutR = compact ? 62 : 74;
      const cardBottom = cardY + topPanelH + (compact ? 290 : 380);
      const panelTop = posterY - 36;
      const panelBottom = panelTop + topPanelH;

      ctx.fillStyle = 'rgba(124,255,218,0.18)';
      ctx.beginPath();
      ctx.roundRect(posterX + posterW + 26, panelTop, cardW - posterW - 98, topPanelH, 30);
      ctx.fill();

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardBottom - cardY, 38);
      ctx.clip();

      ctx.fillStyle = theme.card;
      ctx.fillRect(cardX, cardY, cardW, cardBottom - cardY);
      try { ctx.drawImage(img, posterX, posterY, posterW, posterH); } catch {}

      ctx.fillStyle = '#ffffff';
      ctx.font = '700 56px Space Grotesk, sans-serif';
      drawWrappedText(ctx, item.title, posterX + posterW + 54, posterY + 84, cardW - posterW - 150, 62, 3);

      const ratingRatio = Math.max(0, Math.min(10, rating)) / 10;
      const trackX = posterX + posterW + 54;
      const trackY = posterY + 190;
      const trackW = cardW - posterW - 170;
      const trackH = compact ? 18 : 22;
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.beginPath();
      ctx.roundRect(trackX, trackY, trackW, trackH, 30);
      ctx.fill();
      ctx.fillStyle = '#7cffda';
      ctx.beginPath();
      ctx.roundRect(trackX, trackY, trackW * ratingRatio, trackH, 30);
      ctx.fill();

      ctx.fillStyle = '#7cffda';
      for (let i = 0; i < 5; i += 1) {
        const x = trackX + (i * 48);
        ctx.fillStyle = i < Math.round(rating / 2) ? '#7cffda' : 'rgba(124,255,218,0.28)';
        ctx.font = '700 32px Inter, sans-serif';
        ctx.fillText('★', x, trackY + 62);
      }

      ctx.fillStyle = '#ffffff';
      ctx.font = '700 36px Manrope, sans-serif';
      ctx.fillText(`${profile.name || 'Reviewer'} · ${rating}/10`, trackX, posterY + 294);
      ctx.fillStyle = theme.subtext;
      ctx.font = '500 44px Inter, sans-serif';
      drawWrappedText(ctx, reviewText || 'No review yet.', posterX, posterY + posterH + (compact ? 88 : 110), cardW - 110, 58, compact ? 5 : 7);
      ctx.font = '600 28px Space Grotesk, sans-serif';
      ctx.fillText('Review Card', cardX + 52, cardBottom - 34);
      ctx.globalCompositeOperation = 'destination-out';
      const notchR = Math.max(22, Math.round(cutoutR * 0.46));
      [
        [cardX + 10, cardY + 10],
        [cardX + cardW - 10, cardY + 10],
        [cardX + 10, cardBottom - 10],
        [cardX + cardW - 10, cardBottom - 10],
      ].forEach(([cx, cy]) => {
        ctx.beginPath();
        ctx.arc(cx, cy, notchR, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalCompositeOperation = 'source-over';
      ctx.restore();
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png', 1));
      if (!blob) return;
      const result = await saveImageToDevice(blob, `${slugifyPosterName(item.title)}-review-card.png`);
      const methodLabel = result?.method === 'mediastore' ? 'Gallery saved' : result?.method === 'filesystem' ? 'Saved to Pictures folder' : 'Downloaded';
      setReviewShareStatus({ type: 'success', message: `Review card ready: ${methodLabel}.` });
      window.setTimeout(() => setReviewShareStatus({ type: '', message: '' }), 2800);
    } catch (e) {
      console.error('Failed review card', e);
      setReviewShareStatus({ type: 'error', message: 'Review card save failed. Please retry.' });
      window.setTimeout(() => setReviewShareStatus({ type: '', message: '' }), 3200);
    }
  };

  const shareAnalysisCard = async () => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1350;
      const ctx = canvas.getContext('2d');
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#07111f');
      gradient.addColorStop(0.55, '#17254a');
      gradient.addColorStop(1, '#3a1333');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 58px Inter, sans-serif';
      ctx.fillText('MCU WATCH ANALYSIS', 72, 120);
      ctx.fillStyle = '#7cffda';
      ctx.font = '800 132px Inter, sans-serif';
      ctx.fillText(`${Math.round(totalWatchedHours)}h`, 72, 285);
      ctx.fillStyle = '#ffffff';
      ctx.font = '600 42px Inter, sans-serif';
      ctx.fillText(`${totalWatched}/${totalEntries} watched • ${Object.values(rewatchCount).reduce((a, b) => a + (Number(b) || 0), 0)} re-watches`, 72, 355);
      ctx.fillStyle = 'rgba(255,255,255,0.72)';
      ctx.font = '500 34px Inter, sans-serif';
      ctx.fillText('Recent history', 72, 465);
      historyItems.slice(0, 5).forEach((item, idx) => {
        const y = 540 + idx * 112;
        ctx.fillStyle = 'rgba(255,255,255,0.92)';
        ctx.font = '700 34px Inter, sans-serif';
        ctx.fillText(item.title.slice(0, 36), 96, y);
        ctx.fillStyle = 'rgba(255,255,255,0.58)';
        ctx.font = '500 26px Inter, sans-serif';
        ctx.fillText(`${item.watchedDate || 'No date'} • ${myRating[item.id] ? `${myRating[item.id]}★` : 'unrated'} • re-watch ${rewatchCount[item.id] || 0}`, 96, y + 38);
      });
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      if (!blob) return;
      const file = new File([blob], 'mcu-analysis-card.png', { type: 'image/png' });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title: 'MCU Analysis Card', files: [file] });
      } else {
        triggerDownload(blob, 'mcu-analysis-card.png');
      }
    } catch (e) {
      console.error('Failed to share analysis card', e);
    }
  };


  // ─── Smoother phase gradient (multi-stop per phase for richer look) ──────
  const phaseGradient = useMemo(() => {
    let cursor = 0;
    const stops = [];
    PHASES.forEach((ph, phIdx) => {
      const phaseItems = activeItems.filter(i => i.phase === ph.id);
      const watched = phaseItems.filter(i => i.status === 'watched').length;
      const w = activeItems.length ? (watched / activeItems.length) * 100 : 0;
      if (w <= 0) return;
      const start = cursor;
      const end = Math.min(100, cursor + w);
      const mid = start + (end - start) * 0.5;
      // Richer multi-stop: fade in, bright midpoint, fade out toward next phase
      stops.push(`${ph.color}bb ${start.toFixed(2)}%`);
      stops.push(`${ph.color}ff ${mid.toFixed(2)}%`);
      stops.push(`${ph.color}cc ${end.toFixed(2)}%`);
      cursor = end;
    });
    if (!stops.length) return 'linear-gradient(90deg, var(--theme-accent), var(--theme-accent-alt))';
    return `linear-gradient(90deg, ${stops.join(', ')})`;
  }, [activeItems]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(CACHE_KEYS.poster) || '{}');
      setPosterCache(extractCacheValues(createManagedCache(saved, { maxItems: 220, maxSerializedSize: 450_000, eviction: 'lru' })));
      const metaSaved = JSON.parse(localStorage.getItem(CACHE_KEYS.meta) || '{}');
      setMetaCache(extractCacheValues(createManagedCache(metaSaved, { maxItems: 260, maxSerializedSize: 500_000, eviction: 'timestamp' })));
      setPosterExportFailures(JSON.parse(localStorage.getItem(CACHE_KEYS.posterExportFailures) || '{}'));
    } catch {}
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch('/posters/posters.json', { cache: 'no-store' })
      .then(res => res.ok ? res.json() : {})
      .then(data => {
        if (cancelled) return;
        const byId = data?.byId || {};
        const byTitle = Object.entries(data?.byTitle || {}).reduce((acc, [title, src]) => {
          acc[slugifyPosterName(title)] = src;
          return acc;
        }, {});
        const inferred = Object.entries(byId).reduce((acc, [id, src]) => {
          const fileName = String(src).split('/').pop() || '';
          const inferredTitle = fileName
            .replace(/\.[a-z0-9]+$/i, '')
            .replace(/^\d+[-_. ]+/, '')
            .replace(/[-_.]+/g, ' ')
            .trim();
          if (inferredTitle) acc[slugifyPosterName(inferredTitle)] = src;
          acc[String(Number(id))] = src;
          return acc;
        }, {});
        setLocalPosterMap({ ...inferred, ...byTitle, ...byId });
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  useDebouncedEffect(() => {
    const managed = createManagedCache(wrapCacheEntries(posterCache), { maxItems: 220, maxSerializedSize: 450_000, eviction: 'lru' });
    scheduleStorageWrite(CACHE_KEYS.poster, JSON.stringify(managed));
  }, [posterCache], 350);

  useDebouncedEffect(() => {
    const managed = createManagedCache(wrapCacheEntries(metaCache), { maxItems: 260, maxSerializedSize: 500_000, eviction: 'timestamp' });
    scheduleStorageWrite(CACHE_KEYS.meta, JSON.stringify(managed));
  }, [metaCache], 350);

  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem('mcu-profile-v1') || '{}');
      if (p?.pfp || p?.name) setProfile(prev => ({ ...prev, ...p }));
      const avatars = JSON.parse(localStorage.getItem('mcu-uploaded-avatars-v1') || '[]');
      if (Array.isArray(avatars)) setUploadedAvatars(avatars);
      const t = localStorage.getItem('mcu-theme-mode-v1');
      if (t) setThemeMode(t);
    } catch {}
  }, []);

  useEffect(() => { scheduleStorageWrite('mcu-profile-v1', JSON.stringify(profile)); }, [profile]);
  useEffect(() => { scheduleStorageWrite('mcu-uploaded-avatars-v1', JSON.stringify(uploadedAvatars)); }, [uploadedAvatars]);
  useEffect(() => { scheduleStorageWrite('mcu-theme-mode-v1', themeMode); }, [themeMode]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(CACHE_KEYS.userActions) || '{}');
      const likesSaved = JSON.parse(localStorage.getItem(CACHE_KEYS.userActionsLikes) || 'null');
      const ratingsSaved = JSON.parse(localStorage.getItem(CACHE_KEYS.userActionsRatings) || 'null');
      const rewatchSaved = JSON.parse(localStorage.getItem(CACHE_KEYS.userActionsRewatch) || 'null');
      const bookmarksSaved = JSON.parse(localStorage.getItem(CACHE_KEYS.userActionsBookmarks) || 'null');
      const reviewsSaved = JSON.parse(localStorage.getItem(CACHE_KEYS.userActionsReviews) || 'null');
      setMyLikes(likesSaved || saved.likes || {});
      setMyRating(ratingsSaved || saved.ratings || {});
      setRewatchCount(rewatchSaved || saved.rewatch || {});
      setBookmarks(bookmarksSaved || saved.bookmarks || {});
      setReviews(reviewsSaved || saved.reviews || {});
    } catch {}
  }, []);

  useDebouncedEffect(() => {
    const payload = { likes: myLikes, ratings: myRating, rewatch: rewatchCount, bookmarks, reviews };
    const serialized = JSON.stringify(payload);
    const ok = safeLocalStorageSetItem(CACHE_KEYS.userActions, serialized);
    if (!ok || serialized.length > 200_000) {
      safeLocalStorageSetItem(CACHE_KEYS.userActionsLikes, JSON.stringify(myLikes));
      safeLocalStorageSetItem(CACHE_KEYS.userActionsRatings, JSON.stringify(myRating));
      safeLocalStorageSetItem(CACHE_KEYS.userActionsRewatch, JSON.stringify(rewatchCount));
      safeLocalStorageSetItem(CACHE_KEYS.userActionsBookmarks, JSON.stringify(bookmarks));
      safeLocalStorageSetItem(CACHE_KEYS.userActionsReviews, JSON.stringify(reviews));
    }
  }, [myLikes, myRating, rewatchCount, bookmarks, reviews], 400);
  useEffect(() => {
    const sequence = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    let index = 0;
    const onKeyDown = (event) => {
      if (event.key === sequence[index]) {
        index += 1;
        if (index === sequence.length) {
          setThemeMode('mystic');
          index = 0;
        }
      } else {
        index = event.key === sequence[0] ? 1 : 0;
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);


  const hasCompleteMetadata = (item, posterValues = posterCache, metaValues = metaCache) => {
    const meta = metaValues[item.id] || {};
    const hasPoster = Boolean(localPosterSrc(item) || posterValues[item.id]);
    return hasPoster && Boolean(meta.released || RELEASE_INFO[item.title]?.date) && Boolean(meta.rating || RELEASE_INFO[item.title]?.rating) && Boolean(meta.plot) && Boolean(meta.cast);
  };

  const fetchAndCacheMetadataItem = async (item, { forcePoster = false, forceAll = false } = {}) => {
    let posterValue = localPosterSrc(item) || posterCache[item.id] || '';
    let metaValue = { ...(metaCache[item.id] || {}) };

    if (forcePoster && !localPosterSrc(item)) posterValue = '';

    const needsPoster = !posterValue;
    const needsTmdbDetails = forceAll || !metaValue.plot || !metaValue.cast || !metaValue.released;
    const needsOmdbInfo = forceAll || !metaValue.rating || !metaValue.released || !metaValue.plot;

    const tmdbDetails = needsTmdbDetails ? await fetchTmdbDetail(item) : null;
    if (needsPoster && !localPosterSrc(item)) {
      posterValue = await fetchTmdbPoster(item, { force: forcePoster });
    }

    const omdbInfo = needsOmdbInfo ? await fetchOmdbInfo(item) : null;
    metaValue = {
      ...metaValue,
      released: omdbInfo?.released || tmdbDetails?.Released || metaValue.released || '',
      rating: omdbInfo?.rating || tmdbDetails?.imdbRating || metaValue.rating || '',
      plot: omdbInfo?.plot || tmdbDetails?.Plot || metaValue.plot || '',
      cast: tmdbDetails?.Actors || metaValue.cast || '',
    };

    if (posterValue && !localPosterSrc(item)) {
      setPosterCache(prev => {
        const next = { ...prev, [item.id]: posterValue };
        const managed = createManagedCache(wrapCacheEntries(next), { maxItems: 220, maxSerializedSize: 450_000, eviction: 'lru' });
        scheduleStorageWrite(CACHE_KEYS.poster, JSON.stringify(managed));
        return next;
      });
    }
    setMetaCache(prev => {
      const next = { ...prev, [item.id]: { ...prev[item.id], ...metaValue } };
      const managed = createManagedCache(wrapCacheEntries(next), { maxItems: 260, maxSerializedSize: 500_000, eviction: 'timestamp' });
      scheduleStorageWrite(CACHE_KEYS.meta, JSON.stringify(managed));
      return next;
    });
    return { poster: posterValue, meta: metaValue };
  };

  // ─── Manual build: one title at a time; skips cached metadata ────────────
  const refreshPostersAndMetadata = async () => {
    if (posterFetchState.active) return;
    const targets = filtered.filter(item => !hasCompleteMetadata(item));
    if (!targets.length) {
      setPosterFetchState({ active: false, done: 0, total: 0, message: 'Metadata cache is already complete for this view.' });
      return;
    }

    setPosterFetchState({ active: true, done: 0, total: targets.length, message: `Building metadata for ${targets.length} missing entries…` });
    const batchSize = 3;
    let done = 0;
    for (let i = 0; i < targets.length; i += batchSize) {
      await new Promise(resolve => runWhenIdle(async () => {
        const batch = targets.slice(i, i + batchSize);
        for (const item of batch) {
          try {
            await fetchAndCacheMetadataItem(item);
          } catch {}
          done += 1;
          setPosterFetchState({ active: true, done, total: targets.length, message: `Cached ${done}/${targets.length}: ${item.title}` });
        }
        resolve();
      }));
      await wait(24);
    }
    setPosterFetchState({ active: false, done: targets.length, total: targets.length, message: `Built metadata for ${targets.length} entries.` });
  };

  const refreshPosterForItem = async (item) => {
    if (localPosterSrc(item)) {
      setPosterFetchState({ active: false, done: 0, total: 0, message: `${item.title} uses a local poster override.` });
      return;
    }
    setPosterFetchState({ active: true, done: 0, total: 1, message: `Refreshing poster for ${item.title}…` });
    setPosterCache(prev => {
      const next = { ...prev };
      delete next[item.id];
      return next;
    });
    try {
      const poster = await fetchTmdbPoster(item, { force: true });
      if (poster) {
        setPosterCache(prev => ({ ...prev, [item.id]: poster }));
        setDetailPosterFailed(false);
        setPosterFetchState({ active: false, done: 1, total: 1, message: `Poster refreshed for ${item.title}.` });
      } else {
        setPosterFetchState({ active: false, done: 1, total: 1, message: `No TMDB poster found for ${item.title}.` });
      }
    } catch {
      setPosterFetchState({ active: false, done: 1, total: 1, message: `Could not refresh poster for ${item.title}.` });
    }
  };

  const exportPosterForItem = async (item) => {
    const src = localPosterSrc(item) || posterCache[item.id];
    const filename = posterExportName(item, 'png').replace(/\.\w+$/, '-details-card.png');
    try {
      const info = releaseInfoFor(item);
      const status = releaseStatusFor(item);
      const description = detailPlotState.active === 'secondary'
        ? (detailPlotState.secondary || detailData?.Plot || item.desc)
        : (detailPlotState.primary || detailData?.Plot || item.desc);
      const canvas = document.createElement('canvas');
      canvas.width = 1400;
      canvas.height = 2000;
      const ctx = canvas.getContext('2d');
      const grd = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grd.addColorStop(0, '#090f20');
      grd.addColorStop(1, '#111a31');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (src) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = src;
        await new Promise((resolve, reject) => { img.onload = resolve; img.onerror = reject; });
        ctx.drawImage(img, 70, 90, 320, 470);
      }
      ctx.fillStyle = '#fff';
      ctx.font = '700 58px system-ui';
      ctx.fillText(item.title, 430, 145, 900);
      ctx.font = '500 32px system-ui';
      ctx.fillStyle = '#9dc6ff';
      ctx.fillText(`${item.year} • Phase ${item.phase} • ${TYPE_META[item.type]?.label || item.type}`, 430, 195, 900);
      ctx.fillText(`★ ${detailData?.imdbRating && detailData.imdbRating !== 'N/A' ? detailData.imdbRating : (metaCache[item.id]?.rating || '—')}`, 430, 238, 900);
      ctx.fillStyle = '#d3ddf6';
      ctx.font = '600 30px system-ui';
      ctx.fillText('Description', 70, 620);
      drawWrappedText(ctx, description, 70, 665, 1260, 42, 8);
      ctx.fillText(`Release: ${formatReleaseDate(info.date, item.year, info.label, status)}`, 70, 1080);
      ctx.fillText(`Prerequisite: ${item.prereq}`, 70, 1130, 1260);
      const cast = detailData?.Actors && detailData.Actors !== 'N/A' ? detailData.Actors : (CAST_MAP[item.title] || ['Cast data coming soon']).join(', ');
      ctx.fillText('Cast', 70, 1215);
      drawWrappedText(ctx, cast, 70, 1260, 1260, 38, 6);
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png', 1));
      if (Capacitor.isNativePlatform()) {
        const base64 = await blobToBase64(blob);
        await Filesystem.writeFile({ path: `mcu-posters/${filename}`, data: base64, directory: Directory.Documents, recursive: true });
      } else {
        triggerDownload(blob, filename);
      }
      setPosterExportState({ active: false, done: 1, total: 1, message: `Exported details card for ${item.title}.` });
    } catch {
      setPosterExportState({ active: false, done: 1, total: 1, message: `Could not export details card for ${item.title}.` });
    }
  };

  // ─── Build metadata: one title at a time, never automatically on load ───
  const getMetadataTargets = ({ retryOnly = false, refreshAll = false } = {}) => {
    if (retryOnly && metadataBuild.failedIds.length) {
      const failed = new Set(metadataBuild.failedIds);
      return activeItems.filter(item => failed.has(item.id));
    }
    return activeItems.filter(item => {
      if (refreshAll) return true;
      const hasPoster = Boolean(posterCache[item.id]);
      const meta = metaCache[item.id] || {};
      const hasMetadata = Boolean(meta.rating || meta.released);
      return !hasPoster || !hasMetadata;
    });
  };

  const runMetadataBuild = async (options = {}) => {
    if (metadataBuildRef.current.running) return;
    const targets = getMetadataTargets(options);
    metadataBuildRef.current = { paused: false, running: true };
    setMetadataBuild({ status: targets.length ? 'running' : 'complete', currentTitle: '', done: 0, total: targets.length, failedIds: [] });

    if (!targets.length) {
      metadataBuildRef.current.running = false;
      return;
    }

    const failedIds = [];
    let done = 0;
    for (const item of targets) {
      if (metadataBuildRef.current.paused) break;
      setMetadataBuild(prev => ({ ...prev, status: 'running', currentTitle: item.title, done, failedIds: [...failedIds] }));
      try {
        const tmdbPoster = await fetchTmdbPoster(item);
        if (tmdbPoster) {
          setPosterCache(prev => ({ ...prev, [item.id]: tmdbPoster }));
        }

        const ratingData = await fetchOmdbInfo(item);
        setMetaCache(prev => ({
          ...prev,
          [item.id]: {
            ...prev[item.id],
            rating: ratingData?.rating || prev[item.id]?.rating || '',
            released: ratingData?.released || prev[item.id]?.released || '',
          },
        }));
      } catch {
        failedIds.push(item.id);
      }
      done += 1;
      setMetadataBuild(prev => ({ ...prev, done, currentTitle: item.title, failedIds: [...failedIds] }));
      await wait(250);
    }

    const paused = metadataBuildRef.current.paused;
    metadataBuildRef.current = { paused: false, running: false };
    setMetadataBuild(prev => ({
      ...prev,
      status: paused ? 'paused' : (failedIds.length ? 'error' : 'complete'),
      currentTitle: paused ? prev.currentTitle : '',
      done,
      total: targets.length,
      failedIds,
    }));
  };

  const pauseMetadataBuild = () => {
    if (!metadataBuildRef.current.running) return;
    metadataBuildRef.current.paused = true;
    setMetadataBuild(prev => ({ ...prev, status: 'paused' }));
  };

  const handleMetadataBuildClick = () => {
    if (metadataBuild.status === 'running') {
      pauseMetadataBuild();
      return;
    }
    runMetadataBuild({ retryOnly: metadataBuild.status === 'error' });
  };

  const metadataButtonLabel = metadataBuild.status === 'running'
    ? 'Pause build'
    : metadataBuild.status === 'paused'
      ? 'Resume build'
      : metadataBuild.status === 'error'
        ? 'Retry failed'
        : metadataBuild.status === 'complete'
          ? 'Build missing metadata'
          : 'Build metadata';

  const metadataStatusText = metadataBuild.status === 'running'
    ? `Building ${metadataBuild.done}/${metadataBuild.total}${metadataBuild.currentTitle ? ` · ${metadataBuild.currentTitle}` : ''}`
    : metadataBuild.status === 'paused'
      ? `Paused ${metadataBuild.done}/${metadataBuild.total}`
      : metadataBuild.status === 'error'
        ? `${metadataBuild.failedIds.length} failed · retry available`
        : metadataBuild.status === 'complete'
          ? `Done · ${metadataBuild.total} checked`
          : 'Fetches one title at a time';

  // ─── Detail panel fetch: TMDB for everything, OMDB only for rating ──────
  useEffect(() => {
    const fetchDetail = async () => {
      if (!detailItem) return;
      setDetailLoading(true);
      setDetailData(null);
      setDetailPlotState({ active: 'primary', primary: detailItem.desc, secondary: '', loadingSecondary: false, secondaryProvider: 'OMDb' });
      const fallback = { Plot: metaCache[detailItem.id]?.plot || detailItem.desc, Year: String(detailItem.year), Released: metaCache[detailItem.id]?.released || '', Actors: metaCache[detailItem.id]?.cast || '', imdbRating: metaCache[detailItem.id]?.rating || 'N/A' };

      try {
        const [tmdbPoster, tmdbDetails] = await Promise.all([
          fetchTmdbPoster(detailItem),
          fetchTmdbDetail(detailItem),
        ]);

        if (tmdbPoster) {
          setPosterCache(prev => ({ ...prev, [detailItem.id]: tmdbPoster }));
        }

        const merged = normalizeDetailData({ item: detailItem, tmdb: tmdbDetails, omdb: null, fallback });
        setDetailData(merged);
        setDetailPlotState(prev => ({ ...prev, primary: tmdbDetails?.Plot || merged.Plot || detailItem.desc }));

        setMetaCache(prev => ({
          ...prev,
          [detailItem.id]: {
            ...prev[detailItem.id],
            rating: tmdbDetails?.imdbRating || prev[detailItem.id]?.rating || '',
            released: tmdbDetails?.Released || prev[detailItem.id]?.released || '',
            plot: tmdbDetails?.Plot || prev[detailItem.id]?.plot || '',
            cast: tmdbDetails?.Actors || prev[detailItem.id]?.cast || '',
          }
        }));
      } catch {
        setDetailData(normalizeDetailData({ item: detailItem, fallback }));
      } finally {
        setDetailLoading(false);
      }
    };
    fetchDetail();
  }, [detailItem]);

  const fetchSecondaryPlotForDetail = async () => {
    if (!detailItem || detailPlotState.secondary || detailPlotState.loadingSecondary) return;
    setDetailPlotState(prev => ({ ...prev, loadingSecondary: true }));
    try {
      const omdbInfo = await fetchOmdbInfo(detailItem);
      const secondary = omdbInfo?.plot || detailItem.desc;
      setDetailPlotState(prev => ({ ...prev, secondary, loadingSecondary: false }));
    } catch {
      setDetailPlotState(prev => ({ ...prev, secondary: detailItem.desc, loadingSecondary: false }));
    }
  };

  useEffect(() => {
    setDetailPosterFailed(false);
  }, [detailItem]);

  const openStatusDropdown = (e, itemId) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const dropW = 240, dropH = 280;
    let x = rect.left - dropW + rect.width;
    let y = rect.top - dropH - 8;
    if (x < 8) x = 8;
    if (x + dropW > window.innerWidth - 8) x = window.innerWidth - dropW - 8;
    if (y < 8) y = rect.bottom + 8;
    setDropdownPos({ x, y });
    setStatusDropdown(itemId);
  };

  // ─── Theme tokens ──────────────────────────────────────────────────────────
  const T = darkMode ? {
    appBg: '#06060f', headerBg: 'linear-gradient(180deg,#0d0d1e 0%,#06060f 100%)',
    headerBorder: '#13132a', navBg: '#08081a', navBorder: '#13132a',
    filterBg: 'transparent', filterBorder: '#10101f',
    surfaceBg: 'transparent', surfaceBorder: '#12122a',
    rowHoverBg: 'rgba(255,255,255,0.04)', rowWatchedBg: 'rgba(62,196,122,0.22)',
    rowBorder: '#0e0e1e', expandBg: '#090916', expandBorder: '#14142a',
    pillBg: '#0d0d1e', pillBorder: '#1a1a2e', pillText: '#6a7a90',
    pillHoverBorder: '#252540', pillHoverText: '#c5d0e8',
    inputBg: '#0b0b1d', inputBorder: '#171730', inputColor: '#c5d0e8',
    dropdownBg: '#0d0d1e', dropdownBorder: '#1e1e36', dropdownShadow: '0 24px 64px rgba(0,0,0,0.95)',
    text: '#cfd9ea', textMuted: '#8fa1b8', textFaint: '#5a6880',
    sortHoverBg: '#0f0f22', statBg: '#0b0b1c', statBorder: '#131328',
    numFaint: '#4a5566', footerText: '#1e2a38',
    scrollTrack: '#07070f', scrollThumb: '#16162a', scrollThumbH: '#222238',
    hexDot: 'rgba(255,255,255,0.01)', switcherBg: '#080818', switcherBorder: '#13132a',
    phaseSummaryBg: 'color-mix(in srgb, #ffffff 5%, transparent)', phaseSummaryBorder: '#13132a',
  } : {
    appBg: '#f2f0eb', headerBg: 'linear-gradient(180deg,#ffffff 0%,#f2f0eb 100%)',
    headerBorder: '#ddd8d0', navBg: '#ffffff', navBorder: '#e8e2d8',
    filterBg: 'transparent', filterBorder: 'rgba(214,205,194,0.58)',
    surfaceBg: 'transparent', surfaceBorder: '#e0dbd2',
    rowHoverBg: 'rgba(0,0,0,0.025)', rowWatchedBg: 'rgba(62,196,122,0.15)',
    rowBorder: '#ede8e0', expandBg: '#faf7f2', expandBorder: '#e4ddd4',
    pillBg: '#f0ece4', pillBorder: '#ddd8cf', pillText: '#6a7080',
    pillHoverBorder: '#c8c2b8', pillHoverText: '#1a2030',
    inputBg: '#ffffff', inputBorder: '#ddd8cf', inputColor: '#1a2030',
    dropdownBg: '#ffffff', dropdownBorder: '#ddd8cf', dropdownShadow: '0 24px 64px rgba(0,0,0,0.16)',
    text: '#111827', textMuted: '#4b5563', textFaint: '#6b7280',
    sortHoverBg: '#f5f2ec', statBg: '#ffffff', statBorder: '#e4ddd4',
    numFaint: '#a0a8b0', footerText: '#a0a8b0',
    scrollTrack: '#ece8e0', scrollThumb: '#ccc8c0', scrollThumbH: '#b8b4ac',
    hexDot: 'rgba(0,0,0,0.025)', switcherBg: '#f8f5f0', switcherBorder: '#e4ddd4',
    phaseSummaryBg: 'color-mix(in srgb, #ffffff 5%, transparent)', phaseSummaryBorder: 'rgba(214,205,194,0.5)',
  };

  const THEME_CHOICES = [
    { id: 'classic',        label: 'Iron Man',       swatch: '#d4372f' },
    { id: 'cosmic',         label: 'Capt. Marvel',   swatch: '#4d7bff' },
    { id: 'vibranium',      label: 'Black Panther',  swatch: '#7e5dff' },
    { id: 'quantum',        label: 'Ant-Man',        swatch: '#ff5da8' },
    { id: 'mystic',         label: 'Dr. Strange',    swatch: '#9f66ff' },
    { id: 'web-slinger',    label: 'Spider-Man',     swatch: '#df3f4c' },
    { id: 'god-of-thunder', label: 'Thor',           swatch: '#3ca6ff' },
    { id: 'scarlet-witch',  label: 'Scarlet Witch',  swatch: '#c61b59' },
    { id: 'winter-soldier', label: 'Winter Soldier', swatch: '#8fa0b8' },
  ];

  // ─── Per-theme accent + distinctive surface tints ─────────────────────────
  const themeVarsByMode = {
    classic: {
      '--theme-accent': '#d4372f',
      '--theme-accent-alt': '#f5c04a',
      '--theme-accent-glow': darkMode ? 'rgba(212,55,47,0.42)' : 'rgba(212,55,47,0.26)',
      '--theme-surface': darkMode ? 'rgba(28,10,9,0.90)' : 'rgba(255,246,244,0.96)',
      '--theme-surface-hover': darkMode ? 'rgba(44,14,12,0.94)' : 'rgba(255,236,232,0.97)',
      '--comp-card-bg': darkMode ? 'rgba(26,9,8,0.88)' : 'rgba(255,248,246,0.95)',
    },
    cosmic: {
      '--theme-accent': '#4d7bff',
      '--theme-accent-alt': '#ffb94a',
      '--theme-accent-glow': darkMode ? 'rgba(77,123,255,0.45)' : 'rgba(77,123,255,0.24)',
      '--theme-surface': darkMode ? 'rgba(7,12,32,0.90)' : 'rgba(243,247,255,0.96)',
      '--theme-surface-hover': darkMode ? 'rgba(10,16,44,0.94)' : 'rgba(232,240,255,0.97)',
      '--comp-card-bg': darkMode ? 'rgba(6,11,30,0.88)' : 'rgba(245,249,255,0.95)',
    },
    vibranium: {
      '--theme-accent': '#7e5dff',
      '--theme-accent-alt': '#31c0f4',
      '--theme-accent-glow': darkMode ? 'rgba(126,93,255,0.42)' : 'rgba(126,93,255,0.25)',
      '--theme-surface': darkMode ? 'rgba(13,7,28,0.90)' : 'rgba(248,244,255,0.96)',
      '--theme-surface-hover': darkMode ? 'rgba(20,10,42,0.94)' : 'rgba(238,230,255,0.97)',
      '--comp-card-bg': darkMode ? 'rgba(12,6,26,0.88)' : 'rgba(250,246,255,0.95)',
    },
    quantum: {
      '--theme-accent': '#ff5da8',
      '--theme-accent-alt': '#67f2ff',
      '--theme-accent-glow': darkMode ? 'rgba(255,93,168,0.44)' : 'rgba(255,93,168,0.25)',
      '--theme-surface': darkMode ? 'rgba(26,7,18,0.90)' : 'rgba(255,243,251,0.96)',
      '--theme-surface-hover': darkMode ? 'rgba(38,9,26,0.94)' : 'rgba(255,230,246,0.97)',
      '--comp-card-bg': darkMode ? 'rgba(24,6,17,0.88)' : 'rgba(255,246,253,0.95)',
    },
    mystic: {
      '--theme-accent': '#9f66ff',
      '--theme-accent-alt': '#ff7b39',
      '--theme-accent-glow': darkMode ? 'rgba(159,102,255,0.42)' : 'rgba(159,102,255,0.24)',
      '--theme-surface': darkMode ? 'rgba(15,7,28,0.90)' : 'rgba(250,244,255,0.96)',
      '--theme-surface-hover': darkMode ? 'rgba(22,10,40,0.94)' : 'rgba(240,230,255,0.97)',
      '--comp-card-bg': darkMode ? 'rgba(14,6,26,0.88)' : 'rgba(252,247,255,0.95)',
    },
    'web-slinger': {
      '--theme-accent': '#df3f4c',
      '--theme-accent-alt': '#2b7bdf',
      '--theme-accent-glow': darkMode ? 'rgba(223,63,76,0.42)' : 'rgba(223,63,76,0.24)',
      '--theme-surface': darkMode ? 'rgba(24,7,9,0.90)' : 'rgba(255,244,245,0.96)',
      '--theme-surface-hover': darkMode ? 'rgba(36,9,12,0.94)' : 'rgba(255,232,234,0.97)',
      '--comp-card-bg': darkMode ? 'rgba(22,6,8,0.88)' : 'rgba(255,247,248,0.95)',
    },
    'god-of-thunder': {
      '--theme-accent': '#3ca6ff',
      '--theme-accent-alt': '#f0f6ff',
      '--theme-accent-glow': darkMode ? 'rgba(60,166,255,0.46)' : 'rgba(60,166,255,0.26)',
      '--theme-surface': darkMode ? 'rgba(5,12,26,0.90)' : 'rgba(243,250,255,0.96)',
      '--theme-surface-hover': darkMode ? 'rgba(7,17,36,0.94)' : 'rgba(226,244,255,0.97)',
      '--comp-card-bg': darkMode ? 'rgba(4,10,24,0.88)' : 'rgba(245,252,255,0.95)',
    },
    'scarlet-witch': {
      '--theme-accent': '#c61b59',
      '--theme-accent-alt': '#ff7cb5',
      '--theme-accent-glow': darkMode ? 'rgba(198,27,89,0.45)' : 'rgba(198,27,89,0.25)',
      '--theme-surface': darkMode ? 'rgba(24,5,12,0.90)' : 'rgba(255,242,247,0.96)',
      '--theme-surface-hover': darkMode ? 'rgba(36,6,18,0.94)' : 'rgba(255,228,238,0.97)',
      '--comp-card-bg': darkMode ? 'rgba(22,4,11,0.88)' : 'rgba(255,245,250,0.95)',
    },
    'winter-soldier': {
      '--theme-accent': '#8fa0b8',
      '--theme-accent-alt': '#4b596f',
      '--theme-accent-glow': darkMode ? 'rgba(143,160,184,0.40)' : 'rgba(143,160,184,0.24)',
      '--theme-surface': darkMode ? 'rgba(7,10,16,0.90)' : 'rgba(244,247,252,0.96)',
      '--theme-surface-hover': darkMode ? 'rgba(10,14,22,0.94)' : 'rgba(230,237,248,0.97)',
      '--comp-card-bg': darkMode ? 'rgba(6,9,15,0.88)' : 'rgba(246,249,254,0.95)',
    },
  };

  const activeThemeVars = themeVarsByMode[themeMode] || themeVarsByMode.classic;

  const cssThemeVars = {
    '--theme-bg': darkMode ? '#06060f' : '#f2f0eb',
    '--theme-border': darkMode ? '#1b1b33' : '#ddd8cf',
    '--theme-text': darkMode ? '#d8e3f5' : '#1a2030',
    '--theme-text-muted': darkMode ? '#8fa1b8' : '#667182',
    '--theme-success': '#3ec47a',
    '--theme-success-soft': darkMode ? 'rgba(62,196,122,0.16)' : 'rgba(62,196,122,0.12)',
    '--theme-warning': 'var(--theme-accent-alt)',
    '--theme-warning-soft': darkMode ? 'rgba(232,184,75,0.16)' : 'rgba(232,184,75,0.12)',
    '--theme-danger': '#d16a6a',
    '--theme-danger-soft': darkMode ? 'rgba(209,106,106,0.16)' : 'rgba(209,106,106,0.12)',
    '--theme-app-bg': darkMode
      ? `radial-gradient(ellipse at 15% 10%, color-mix(in srgb, ${activeThemeVars['--theme-accent']} 22%, transparent), transparent 40%), radial-gradient(ellipse at 85% 18%, color-mix(in srgb, ${activeThemeVars['--theme-accent-alt']} 18%, transparent), transparent 44%), linear-gradient(155deg, #05050e 0%, #090d1e 42%, #07101c 100%)`
      : `radial-gradient(ellipse at 15% 10%, color-mix(in srgb, ${activeThemeVars['--theme-accent']} 16%, #ffffff), transparent 38%), radial-gradient(ellipse at 85% 18%, color-mix(in srgb, ${activeThemeVars['--theme-accent-alt']} 12%, #ffffff), transparent 42%), linear-gradient(155deg, #fbfaf7 0%, #f5f2eb 45%, #f0ece5 100%)`,
    '--comp-overlay-bg': darkMode ? 'rgba(12,16,34,0.88)' : 'rgba(255,255,255,0.95)',
    '--comp-dropdown-bg': darkMode ? 'rgba(13,18,34,0.72)' : 'rgba(255,255,255,0.75)',
    '--theme-header-bg': darkMode
      ? `linear-gradient(180deg, color-mix(in srgb, ${activeThemeVars['--theme-accent']} 18%, #0c1022), #06060f)`
      : `linear-gradient(180deg, color-mix(in srgb, ${activeThemeVars['--theme-accent']} 10%, #ffffff), #f6f2ea)`,
    '--theme-watched-bg': darkMode
      ? `linear-gradient(100deg, color-mix(in srgb, ${activeThemeVars['--theme-accent']} 18%, rgba(12,18,34,0.62)), color-mix(in srgb, ${activeThemeVars['--theme-accent-alt']} 10%, rgba(10,20,32,0.54)))`
      : `linear-gradient(100deg, color-mix(in srgb, ${activeThemeVars['--theme-accent']} 12%, rgba(255,255,255,0.34)), color-mix(in srgb, ${activeThemeVars['--theme-accent-alt']} 7%, rgba(247,245,239,0.28)))`,
    ...activeThemeVars,
  };

  // Count active filters for the collapsed bar badge
  const activeFilterCount = [typeFilter, statusFilter, watchedOnly, autoHideStatuses, essentialOnly && listMode === 'core', sortBy !== 'order'].filter(Boolean).length;

  const renderPhaseSelector = () => (
    <div ref={phaseRef} style={{ position: 'relative', flex: '0 0 auto' }}>
      <button className="fpill" onClick={() => setPhaseOpen(o => !o)}
        style={{ border: `1px solid ${T.filterBorder}`, borderRadius: 999, padding: '5px 10px', color: activePhase === 0 ? T.textMuted : (PHASES.find(ph => ph.id === activePhase)?.color || T.text), background: 'transparent', fontFamily: 'var(--font-marvel-ui)', fontSize: 12, letterSpacing: 1.4, whiteSpace: 'nowrap' }}>
        {activePhase === 0 ? 'Phase All' : (PHASES.find(ph => ph.id === activePhase)?.name || 'Phase All')}
        <ChevDown size={12} style={{ opacity: 0.6, transform: phaseOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>
      {phaseOpen && (
        <div className="fade-in dropdown-pop" style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, background: 'color-mix(in srgb, var(--theme-surface) 65%, transparent)', border: `1px solid ${T.dropdownBorder}`, borderRadius: 9, overflow: 'hidden', zIndex: 520, boxShadow: 'none', minWidth: 200 }}>
          <div className={`sopt ${activePhase === 0 ? 'picked' : ''}`} onClick={() => { setActivePhase(0); setPhaseOpen(false); }}>Phase All</div>
          {PHASES.map((ph) => (
            <div key={ph.id} className={`sopt ${activePhase === ph.id ? 'picked' : ''}`} style={activePhase === ph.id ? { color: ph.color, fontWeight: 700 } : {}} onClick={() => { setActivePhase(ph.id); scrollTo(ph.id); setPhaseOpen(false); }}>{ph.name}</div>
          ))}
        </div>
      )}
    </div>
  );

  const appThemeBg = 'var(--theme-app-bg)';
  return (
    <div data-theme={themeMode} style={{ ...cssThemeVars, '--row-gap': densityMode === 'compact' ? '8px' : '12px', '--row-pad': densityMode === 'compact' ? '11px 10px 11px 8px' : '16px 16px 16px 12px', '--row-min-h': densityMode === 'compact' ? '72px' : '86px', '--text-scale': desktopTextScale, width: '100%', minHeight: '100dvh', background: appThemeBg, color: 'var(--theme-text)', fontFamily: 'var(--font-marvel-body)', fontSize: 'calc(16px * var(--text-scale))', display: 'flex', flexDirection: 'column', overflow: 'visible', touchAction: 'pan-y', WebkitOverflowScrolling: 'touch', transition: 'none' }} className="theme-switch performance-mode">
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body{scroll-behavior:auto}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:${T.scrollTrack}}
        ::-webkit-scrollbar-thumb{background:${T.scrollThumb};border-radius:4px}
        ::-webkit-scrollbar-thumb:hover{background:${T.scrollThumbH}}
        input,button,select{font-family:inherit;border-radius:12px}
        *,*::before,*::after{-webkit-tap-highlight-color:transparent}
        *::selection{background:transparent;color:inherit}
        input:focus{outline:none}
        button:focus,button:focus-visible,a:focus,a:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible,[tabindex]:focus-visible{outline:none !important;box-shadow:none !important}

        @keyframes sweep{0%{transform:translateX(-120%)}100%{transform:translateX(220%)}}
        @keyframes scrollRail{0%{transform:translateX(0)}100%{transform:translateX(-22%)}}
        @keyframes heroSlideIn{from{opacity:0;transform:translateX(34px) scale(0.97)}to{opacity:1;transform:translateX(0) scale(1)}}
        @keyframes heroBgSlide{from{opacity:0;transform:translateX(22px) scale(1.03)}to{opacity:0.34;transform:translateX(0) scale(1)}}
        .sweep::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent);animation:sweep 3.2s ease-in-out infinite}
        .hero-bg-slide{animation:heroBgSlide 720ms cubic-bezier(0.22,1,0.36,1) both;will-change:transform,opacity}
        .hero-poster-card{animation:heroSlideIn 460ms cubic-bezier(0.22,1,0.36,1) both;animation-delay:var(--poster-delay,0ms)}

        @keyframes phaseFlash{0%{opacity:0}20%{opacity:0.22}80%{opacity:0.18}100%{opacity:0}}
        .phase-flash{animation:phaseFlash 2.4s ease both}

        @keyframes rowIn{from{opacity:1;transform:none}to{opacity:1;transform:none}}
        .row-in{animation:rowIn 320ms var(--ease-out) both}

        @keyframes sectionUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .section-up{animation:sectionUp 360ms var(--ease-out) both}

        @keyframes fadeIn{from{opacity:0;transform:scale(0.97) translateY(-4px)}to{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes dropdownPop{0%{opacity:0;transform:translateY(-8px) scale(0.96);filter:blur(3px)}65%{opacity:1;transform:translateY(2px) scale(1.01);filter:blur(0)}100%{opacity:1;transform:translateY(0) scale(1);filter:blur(0)}}
        @keyframes itemCascade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes collapseReveal{from{opacity:0;max-height:0;transform:translateY(-8px)}to{opacity:1;max-height:180px;transform:translateY(0)}}
        @keyframes sidebarBackdropIn{from{opacity:0}to{opacity:1}}
        @keyframes sidebarContentIn{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:translateX(0)}}
        @keyframes detailOpen{from{opacity:0;transform:translateY(18px) scale(0.97)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes descriptionReveal{from{opacity:0;max-height:0;transform:translateY(-6px)}to{opacity:1;max-height:142px;transform:translateY(0)}}
        .fade-in{animation:fadeIn 240ms var(--ease-out) both}
        .dropdown-pop{transform-origin:top center;animation:dropdownPop 260ms cubic-bezier(0.22,1,0.36,1) both}
        .dropdown-pop .sopt{animation:itemCascade 220ms var(--ease-out) both}
        .dropdown-pop .sopt:nth-child(2){animation-delay:25ms}.dropdown-pop .sopt:nth-child(3){animation-delay:50ms}.dropdown-pop .sopt:nth-child(4){animation-delay:75ms}.dropdown-pop .sopt:nth-child(5){animation-delay:100ms}.dropdown-pop .sopt:nth-child(6){animation-delay:125ms}
        .sidebar-backdrop{animation:sidebarBackdropIn 220ms var(--ease-out) both}
        .sidebar-panel.sidebar-open > *{animation:sidebarContentIn 300ms var(--ease-out) both}
        .sidebar-panel.sidebar-open > *:nth-child(2){animation-delay:35ms}.sidebar-panel.sidebar-open > *:nth-child(3){animation-delay:70ms}.sidebar-panel.sidebar-open > *:nth-child(4){animation-delay:105ms}.sidebar-panel.sidebar-open > *:nth-child(n+5){animation-delay:140ms}
        .detail-open{animation:detailOpen 260ms cubic-bezier(0.22,1,0.36,1) both}
        .detail-description{animation:descriptionReveal 260ms var(--ease-out) both;scrollbar-width:thin}

        @keyframes expandDown{from{opacity:0;max-height:0;padding-top:0;padding-bottom:0;transform:translateY(-8px)}to{opacity:1;max-height:600px;padding-top:10px;padding-bottom:10px;transform:translateY(0)}}
        .expand-row{animation:expandDown 0.28s cubic-bezier(0.34,1.56,0.64,1) both;overflow:hidden}
        .collapse-panel{animation:collapseReveal 260ms cubic-bezier(0.22,1,0.36,1) both;overflow:hidden}

        @keyframes filtersSlide{from{opacity:0;max-height:0;transform:translateY(-8px)}to{opacity:1;max-height:260px;transform:translateY(0)}}
        .filters-open{animation:filtersSlide 240ms var(--ease-out) both;overflow:visible}
        .filters-open .fpill{animation:itemCascade 220ms var(--ease-out) both}
        .filters-open .fpill:nth-child(2){animation-delay:20ms}.filters-open .fpill:nth-child(3){animation-delay:40ms}.filters-open .fpill:nth-child(4){animation-delay:60ms}.filters-open .fpill:nth-child(5){animation-delay:80ms}.filters-open .fpill:nth-child(n+6){animation-delay:100ms}

        @keyframes themeFadeSwitch{from{opacity:0.7}to{opacity:1}}
        .theme-switch{animation:themeFadeSwitch 260ms var(--ease-out) both}

        @keyframes listModeSlide{from{opacity:0.8;transform:translateX(-8px)}to{opacity:1;transform:translateX(0)}}
        .list-mode-switch{animation:listModeSlide 220ms var(--ease-out) both}

        @keyframes buttonPulse{0%{box-shadow:0 0 0 0 color-mix(in srgb, var(--theme-accent) 45%, transparent)}70%{box-shadow:0 0 0 6px transparent}100%{box-shadow:0 0 0 0 transparent}}
        @keyframes spiderPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.02)}}
        @keyframes snapFade{0%{filter:grayscale(0)}40%{filter:grayscale(1) brightness(1.2)}100%{filter:grayscale(0)}}
        @keyframes fadeInOut{0%{opacity:0}30%{opacity:1}100%{opacity:0}}
        @keyframes spiderDrop{0%{transform:translate(-50%,-120px)}35%{transform:translate(-50%,18vh)}70%{transform:translate(-50%,35vh)}100%{transform:translate(-50%,45vh);opacity:0}}
        .snap-blip{animation:snapFade 1.6s ease}
        .button-click{animation:buttonPulse 420ms ease-out}

        .wbtn{position:relative;width:30px;height:30px;border-radius:50%;border:1.5px solid transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;transition:background 0.14s ease,border-color 0.14s ease,color 0.14s ease;flex-shrink:0;box-shadow:none}
        .wbtn:hover{border-color:rgba(255,255,255,0.28)!important;background:rgba(255,255,255,0.1)!important}
        .wbtn:active{opacity:0.82}
        .status-pill{text-transform:uppercase;font-weight:800;line-height:1;border-radius:999px}
        .status-toggle::after{content:'';position:absolute;inset:-2px;border-radius:inherit;background:currentColor;opacity:0;transition:opacity 0.12s ease;z-index:-1}
        .status-toggle:hover::after{opacity:0.16}

        .ntab{position:relative;font-family:var(--font-marvel-ui);font-size:clamp(16px,2.4vw,22px);letter-spacing:3px;padding:14px 20px;border:none;background:transparent;cursor:pointer;transition:color 0.2s cubic-bezier(0.34,1.56,0.64,1);white-space:nowrap;flex-shrink:0;display:flex;flex-direction:column;align-items:center}
        .ntab::after{content:'';position:absolute;bottom:0;left:12px;right:12px;height:2px;border-radius:2px 2px 0 0;background:currentColor;transform:scaleX(0);transform-origin:center;transition:transform 0.22s cubic-bezier(0.34,1.56,0.64,1)}
        .ntab.on::after{transform:scaleX(1)}

        .fpill{display:flex;align-items:center;gap:6px;padding:7px 26px;border-radius:12px;border:1px solid var(--theme-border);background:var(--theme-surface);cursor:pointer;font-size:clamp(14px,2.2vw,16px);font-weight:600;letter-spacing:0.03em;color:var(--theme-text);transition:background-color 0.14s ease,color 0.14s ease,opacity 0.14s ease,border-color 0.14s ease;white-space:nowrap;box-shadow:none;overflow:visible}
        .fpill:hover{border-color:var(--theme-accent);color:var(--theme-accent);background:var(--theme-surface-hover);opacity:0.96}
        .fpill:active{opacity:0.82}
        .fpill:focus-visible,.theme-btn:focus-visible,.lmode-btn:focus-visible{outline:none;box-shadow:none}

        .sopt{padding:13px 20px;font-family:var(--font-marvel-ui);font-size:clamp(15px,2.2vw,18px);letter-spacing:2.5px;cursor:pointer;color:${T.pillText};transition:background-color 0.14s ease,color 0.14s ease}
        .sopt:hover{background:${T.sortHoverBg};color:${T.text}}
        .sopt.picked,.dropdown-item.active{background:var(--theme-surface-hover);border-radius:12px;color:var(--theme-accent);font-weight:700}
        .curvy-indicator{height:4px;border-radius:99px;background:var(--theme-accent);border:none}
        .curvy-panel{position:relative;overflow:hidden;border-radius:14px}
        .curvy-panel::before{display:none}

        .section-up{content-visibility:visible;contain-intrinsic-size:auto}
        .hero-rail::-webkit-scrollbar{height:0;width:0;display:none}
        .phase-rows-full{display:block;position:relative}
        .rrow{position:relative;contain:layout style;content-visibility:visible;transition:background-color 220ms var(--ease-out),border-color 220ms var(--ease-out),transform 220ms var(--ease-out),box-shadow 260ms var(--ease-out);display:grid;align-items:center;grid-template-columns:32px 52px minmax(0,1fr) minmax(96px,auto);gap:var(--row-gap,12px);padding:var(--row-pad,16px 16px 16px 12px);border-left:2px solid transparent;border-bottom:1px solid transparent;min-height:var(--row-min-h,86px);border-radius:12px;overflow:hidden;background:transparent;backdrop-filter:none}
        .rrow:last-child{border-bottom:none}
        .rrow > *{position:relative;z-index:1}
        .rrow:hover{border-left-color:color-mix(in srgb,var(--theme-accent) 65%, var(--phase-color,#c0392b));transform:translateY(-1px)}
        .rrow.curvy-selected{border-left-color:var(--theme-accent);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--theme-accent) 40%, transparent)}
        .rrow.type-film:hover{background:linear-gradient(90deg, rgba(224,82,82,0.18), ${T.rowHoverBg}) !important}
        .rrow.type-series:hover{background:linear-gradient(90deg, rgba(74,158,222,0.18), ${T.rowHoverBg}) !important}
        .rrow.type-short:hover{background:linear-gradient(90deg, rgba(160,108,213,0.18), ${T.rowHoverBg}) !important}

        .title-btn{background:none;border:none;cursor:pointer;text-align:left;padding:6px 0;color:var(--theme-text);font-family:inherit;display:block;width:100%;min-height:44px;text-shadow:0 1px 4px rgba(0,0,0,0.35)}
        .title-btn:focus-visible{outline:none;box-shadow:none}

        .hexbg{background-image:radial-gradient(circle,${T.hexDot} 1px,transparent 1px);background-size:28px 28px}

        .lmode-btn{display:flex;flex-direction:column;padding:14px 24px 12px;border:none;background:transparent;cursor:pointer;text-align:left;transition:all 0.2s;border-bottom:2px solid transparent}
        .lmode-btn.active{border-bottom-color:var(--mc)}
        .lmode-btn:hover:not(.active){background:${T.rowHoverBg}}

        .theme-btn{width:32px;height:32px;border-radius:50%;border:1px solid ${T.pillBorder};background:${T.pillBg};color:${T.pillText};cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s;flex-shrink:0}
        .theme-btn:hover{border-color:${T.pillHoverBorder};color:${T.pillHoverText}}

        .poster-shell{width:52px;height:76px;border-radius:9px;overflow:hidden;background:linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.025));position:relative;flex-shrink:0;box-shadow:0 8px 18px rgba(0,0,0,0.3),0 0 0 1px color-mix(in srgb,var(--theme-accent) 14%, transparent)}.poster-shell::before{content:"";position:absolute;inset:0;background:linear-gradient(120deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02));opacity:1;transition:opacity .12s;pointer-events:none}.poster-shell.is-loaded::before{opacity:0}.poster-shell picture,.poster-shell img{display:block;width:100%;height:100%}.poster{width:52px;height:76px;object-fit:cover;border-radius:9px;border:1px solid ${T.surfaceBorder};box-shadow:0 10px 24px rgba(0,0,0,0.35);opacity:1;transform:none;transition:opacity .24s ease-out,transform .24s ease-out,filter .24s ease-out}.poster-shell:not(.is-loaded) .poster{opacity:0.82;transform:translateY(4px)}.poster.is-loaded{opacity:1;transform:none}
        .progress-gradient{background:${phaseGradient};background-size:200% 100%;animation:none}
        @keyframes gradientPulse{0%{filter:brightness(0.92)}100%{filter:brightness(1.08)}}
        .detail-backdrop{position:fixed;inset:0;background:rgba(4,6,12,0.62);backdrop-filter:blur(12px);z-index:240;display:grid;place-items:center;padding:20px}
        .detail-card{width:min(1080px,94vw);max-height:92vh;overflow:auto;background:linear-gradient(145deg, rgba(17,22,44,0.62), rgba(12,16,34,0.5));backdrop-filter:blur(18px) saturate(130%);-webkit-backdrop-filter:blur(18px) saturate(130%);border:1px solid rgba(255,255,255,0.14);border-radius:14px;padding:18px;box-shadow:${darkMode ? '0 22px 60px rgba(0,0,0,0.56)' : '0 18px 44px rgba(0,0,0,0.14)'}}

        .detail-layout{grid-template-columns:minmax(220px,34%) minmax(0,1fr)}
        .detail-pill{background:rgba(255,255,255,0.08) !important;border-color:rgba(255,255,255,0.18) !important;transform:none !important;box-shadow:none !important}
        .detail-btn{padding:8px 11px !important;font-size:12px !important;line-height:1.2;justify-content:center;border-radius:10px !important;background:rgba(255,255,255,0.06) !important;border-color:rgba(255,255,255,0.14) !important}
        .detail-btn:hover{background:rgba(255,255,255,0.11) !important;border-color:rgba(255,255,255,0.25) !important;color:var(--theme-text) !important}
        .detail-btn.is-active{background:color-mix(in srgb, var(--theme-danger) 20%, rgba(255,255,255,0.08)) !important;border-color:color-mix(in srgb, var(--theme-danger) 55%, rgba(255,255,255,0.2)) !important;color:var(--theme-danger) !important}
        .detail-btn-group{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-bottom:10px;align-items:center}
        .detail-fallback-poster{position:relative;display:grid;place-items:center;padding:24px;background:radial-gradient(circle at 20% 20%, rgba(232,184,75,0.22), transparent 48%),radial-gradient(circle at 80% 30%, rgba(74,158,222,0.24), transparent 44%),linear-gradient(145deg, rgba(14,20,44,0.9), rgba(9,14,34,0.95));overflow:hidden}
        .detail-fallback-poster::before{content:'';position:absolute;inset:0;background:rgba(255,255,255,0.03)}
        .detail-fallback-poster span{position:relative;z-index:1;text-align:center;font-size:clamp(24px,5vw,40px);line-height:1.2;font-weight:700;color:rgba(242,247,255,0.95);text-shadow:0 2px 14px rgba(0,0,0,0.35)}
        .glass-panel{background-color:rgba(30,30,46,0.42);border:1px solid rgba(255,255,255,0.04);border-radius:16px}
        .glass-grad{background:linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))}
        .meta-muted{color:var(--theme-text-muted) !important}
        *{scroll-behavior:smooth}.sweep::after,.phase-flash{animation:none !important}

        /* Mobile */
        @media (max-width: 767px) {
          .header-inner { padding: 10px 10px 8px !important; }
          .header-title-mcu { font-size: clamp(34px, 7.2vw, 48px) !important; letter-spacing: clamp(1px, 0.5vw, 3px) !important; }
          .header-title-sub { font-size: clamp(18px, 4.2vw, 28px) !important; letter-spacing: clamp(1px, 0.7vw, 4px) !important; }
          .header-tagline { font-size: 11px !important; letter-spacing: 1px !important; margin-top: 0 !important; }
          .fpill{padding:10px 16px !important;font-size:15px !important;min-height:44px}
          .rrow{grid-template-columns:24px 44px minmax(0,1fr) !important;gap:8px;padding:14px 10px 14px 8px;min-height:96px}
          .rrow .row-actions{grid-column:2 / -1;flex-direction:row !important;align-items:center !important;justify-content:space-between !important;min-width:0 !important;width:100%;gap:8px}
          .calendar-row{grid-template-columns:minmax(74px,84px) 44px minmax(0,1fr) !important}
          .bottom-action-dock{left:12px !important;right:12px !important;bottom:max(12px, env(safe-area-inset-bottom)) !important}
          .dock-btn{font-size:11px !important;padding:9px 10px !important;min-height:40px}
          .bottom-action-bar{min-height:40px;padding:9px 10px !important}
          main > div{padding-bottom:130px !important}
          .poster{width:44px;height:64px}
          .detail-layout{grid-template-columns:minmax(0,1fr) !important;gap:14px !important}
          .detail-layout img,.detail-fallback-poster{max-width:280px;margin:0 auto;max-height:360px}
          .detail-layout > div:last-child{width:100%}
          .filter-row-actions{margin-left:0 !important;flex-wrap:wrap;justify-content:flex-end;gap:6px !important}
          .filter-row-actions .fpill{padding:8px 10px !important;font-size:13px !important}
          .filters-open{padding:0 12px 12px !important}
          .settings-menu{position:fixed !important;top:88px !important;right:10px !important;left:10px !important;width:auto !important;min-width:0 !important;max-height:calc(100dvh - 112px) !important;padding:12px !important}
          .settings-menu .fpill{padding:9px 10px !important;font-size:13px !important;white-space:normal !important}
        }
        @media (min-width: 1024px) {
          .header-inner{max-width:1400px;margin:0 auto}
          .header-title-sub{margin-top:2px !important}
          .lmode-btn{padding:12px 20px 10px}
          .rrow{grid-template-columns:34px 56px minmax(0,1fr) minmax(120px,auto);padding:14px 14px 14px 10px;min-height:84px}
        }
        @media (min-width: 1600px) {
          main{--content-max:1200px !important}
          .rrow{font-size:17px}
          .header-inner{max-width:1240px;margin:0 auto}
        }
        .header-title-mcu { font-size: clamp(42px, 7vw, 82px) !important; letter-spacing: clamp(1.5px, 0.7vw, 5px) !important; margin: 0 !important; }
        .header-title-sub { font-size: clamp(24px, 3.6vw, 46px) !important; letter-spacing: clamp(2px, 0.9vw, 7px) !important; margin-top: 0px !important; }
        .header-tagline { font-size: clamp(11px, 1.9vw, 13px) !important; margin-top: 1px !important; }
        .stat-card-num { font-size: clamp(28px, 4.5vw, 48px) !important; }
        .stat-card-label { font-size: clamp(11px, 1.8vw, 14px) !important; }
        .progress-labels { font-size: clamp(11px, 1.8vw, 14px) !important; color:var(--theme-text-muted) !important }

        .settings-menu{width:min(360px,calc(100vw - 28px));max-height:min(80vh,calc(100dvh - 92px));overscroll-behavior:contain}.settings-menu .fpill{min-width:0}.bottom-action-dock{position:fixed;right:16px;bottom:16px;z-index:120;display:flex;gap:8px;align-items:center}
        .dock-btn{border-radius:999px;border:1px solid ${T.surfaceBorder};background:${darkMode ? 'rgba(20,25,46,0.9)' : 'rgba(255,255,255,0.92)'};color:${T.text};padding:10px 12px;font-family:var(--font-marvel-ui);letter-spacing:1.1px;font-size:12px;cursor:pointer;white-space:nowrap}
        .bottom-action-bar{border-radius:999px;padding:10px 14px;white-space:nowrap}
        main,.rrow,.title-btn,.fpill,.wbtn,.sopt,.meta-muted,input,textarea,select,button,.header-tagline{font-size:calc(1em * var(--text-scale))}
        main::-webkit-scrollbar{width:4px}
        main::-webkit-scrollbar-track{background:transparent}
        main::-webkit-scrollbar-thumb{background:${T.scrollThumb};border-radius:4px}
        main::-webkit-scrollbar-thumb:hover{background:${T.scrollThumbH}}
      `}</style>

      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '100vh', minHeight: '100vh', maxHeight: '100vh', zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div key={currentHeroSrc || activeHeroSrc || 'hero-bg'} className="hero-bg-slide" style={{ position: 'absolute', inset: 0, backgroundImage: (currentHeroSrc || activeHeroSrc) ? `url(${currentHeroSrc || activeHeroSrc})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center 20%', opacity: 0.34, transition: 'opacity 0.9s ease-in-out', willChange: 'opacity' }} />
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 18% 12%, color-mix(in srgb, var(--theme-accent) 32%, transparent), transparent 42%), radial-gradient(circle at 82% 18%, color-mix(in srgb, var(--theme-accent-alt) 30%, transparent), transparent 40%), linear-gradient(165deg, color-mix(in srgb, var(--theme-accent) ${darkMode ? '24%' : '14%'}, #04050f), color-mix(in srgb, var(--theme-accent-alt) ${darkMode ? '18%' : '10%'}, #0a1734) 42%, ${darkMode ? '#090d1e' : '#edf2fa'} 100%)`, opacity: darkMode ? 0.74 : 0.64, transition: 'opacity 0.95s ease-in-out', animation: 'cinematicIn 0.8s ease both' }} />
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${darkMode ? 'rgba(4,5,15,0.03)' : 'rgba(255,255,255,0.06)'} 0%, ${darkMode ? 'rgba(4,5,15,0.12)' : 'rgba(231,238,248,0.18)'} 45%, ${darkMode ? 'rgba(4,5,15,0.46)' : 'rgba(231,238,248,0.5)'} 70%, ${darkMode ? 'rgba(4,5,15,0.92)' : 'rgba(231,238,248,0.92)'} 100%)` }} />
      </div>
      {lightningStrike && <div style={{ position:'fixed', inset:0, pointerEvents:'none', background:'linear-gradient(180deg, rgba(180,220,255,0.95), rgba(255,255,255,0))', mixBlendMode:'screen', zIndex:9999, animation:'fadeInOut 0.7s ease' }} />}
      {spiderDrop && <div style={{ position:'fixed', top:0, left:'50%', transform:'translateX(-50%)', fontSize:40, zIndex:9999, animation:'spiderDrop 2.4s ease forwards', pointerEvents:'none' }}>🕷️</div>}

      {/* ━━ SETTINGS PANEL ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <button className="theme-btn" onClick={() => setSidebarOpen(v => !v)} aria-label="Toggle sidebar menu" style={{ position: 'fixed', top: 'calc(env(safe-area-inset-top, 0px) + 10px)', left: 12, zIndex: 280, width: 44, height: 44, background: darkMode ? 'rgba(10,14,28,0.94)' : '#ffffff', borderColor: darkMode ? 'rgba(255,255,255,0.24)' : T.pillBorder, boxShadow: darkMode ? '0 8px 24px rgba(0,0,0,0.35)' : '0 6px 16px rgba(0,0,0,0.12)' }}><Menu size={17} /></button>
      {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 255 }} />}
      <aside ref={sidebarRef} className={sidebarOpen ? 'sidebar-panel sidebar-open' : 'sidebar-panel'} style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: 'min(320px,84vw)', padding: '86px 14px 20px', background: darkMode ? 'rgba(7,9,20,0.58)' : 'rgba(255,255,255,0.58)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', borderRight: `1px solid ${T.surfaceBorder}`, transform: sidebarOpen ? 'translateX(0)' : 'translateX(-105%)', transition: 'transform 0.34s cubic-bezier(.22,.9,.24,1)', zIndex: 260, overflowY: 'auto', boxShadow: darkMode ? '0 22px 55px rgba(0,0,0,0.45)' : '0 18px 44px rgba(0,0,0,0.18)', borderRadius: 16 }}>
        <div style={{ marginBottom: 8, fontSize: 11, letterSpacing: 1.8, color: T.textMuted, fontFamily: 'var(--font-marvel-ui)', textTransform: 'uppercase' }}>Navigation Panel</div>
        <div style={{ marginBottom: 10, display: 'grid', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {profile.pfp ? <img src={profile.pfp} alt="profile" style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' }} /> : <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(145deg,var(--theme-accent),var(--theme-accent-alt))', color: '#fff', display: 'grid', placeItems: 'center' }}><UserCircle size={18} /></div>}
            <div style={{ fontSize: 12, color: T.textMuted }}>{profile.name || 'Marvel Fan'}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 6 }}>
            <button className="fpill" onClick={() => setDarkMode(true)} style={{ justifyContent: 'center', borderColor: darkMode ? 'var(--theme-accent)' : 'var(--theme-border)', color: darkMode ? 'var(--theme-accent)' : 'var(--theme-text)' }}><Moon size={12} />Dark</button>
            <button className="fpill" onClick={() => setDarkMode(false)} style={{ justifyContent: 'center', borderColor: !darkMode ? 'var(--theme-accent)' : 'var(--theme-border)', color: !darkMode ? 'var(--theme-accent)' : 'var(--theme-text)' }}><Sun size={12} />Light</button>
          </div>
          <button className="fpill" onClick={() => { setSettingsOpen(true); setSidebarOpen(false); }} style={{ width: '100%', justifyContent: 'center' }}><Settings size={13}/>Settings & Profile</button>
        </div>
                <button className="fpill" onClick={() => { setSidebarOpen(false); setViewMode(viewMode === 'list' ? 'calendar' : 'list'); }} style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>{viewMode === 'list' ? 'Calendar View' : 'List View'}</button>
        <div style={{ marginTop: 14, fontSize: 12, color: T.textMuted, letterSpacing: 1.5, fontFamily: 'var(--font-marvel-ui)' }}>Quick Phases</div>
        <button className="fpill" onClick={() => { setSidebarOpen(false); setAnalyticsOpen(true); }} style={{ width: '100%', justifyContent: 'center', marginTop: 10 }}>Analytics</button>
        <div style={{ marginTop: 14, fontSize: 12, color: T.textMuted, letterSpacing: 1.5, fontFamily: 'var(--font-marvel-ui)' }}>Viewing List</div>
        <div style={{ display: 'grid', gap: 6, marginTop: 8 }}>
          {LIST_MODES.map(mode => {
            const isActive = listMode === mode.id;
            return (
              <button
                key={`side-${mode.id}`}
                className="fpill"
                onClick={() => { setListMode(mode.id); setExpandedItem(null); setExpandedPhase(null); setSidebarOpen(false); }}
                style={{
                  justifyContent: 'space-between',
                  borderColor: isActive ? mode.color : 'var(--theme-border)',
                  background: isActive ? `${mode.color}18` : 'var(--theme-surface)',
                  color: isActive ? mode.color : 'var(--theme-text)',
                }}
              >
                <span>{mode.label}</span>
                {isActive && <Check size={12} />}
              </button>
            );
          })}
        </div>
        <div style={{ marginTop: 10, border: `1px solid ${T.surfaceBorder}`, borderRadius: 10, padding: 10, display: 'grid', gap: 6, background: T.surfaceBg }}>
          <div style={{ fontSize: 11, letterSpacing: 1.6, color: T.textMuted }}>WATCHED</div>
          <div style={{ fontSize: 22, fontFamily: 'var(--font-marvel-ui)', color: 'var(--theme-accent)' }}>{totalWatched}/{activeItems.length}</div>
          <div style={{ fontSize: 12, color: T.textMuted }}>~{Math.round(totalWatchedHours * 10) / 10}h watched · ~{remainingHours}h left</div>
          <div style={{ fontSize: 12, color: T.textMuted }}>Films: {filmCount} · Series: {seriesCount}</div>
        </div>
        <div style={{ marginTop: 10, border: `1px solid ${T.surfaceBorder}`, borderRadius: 10, padding: 10, display: 'grid', gap: 6, background: T.surfaceBg }}>
          <div style={{ fontSize: 11, letterSpacing: 1.6, color: T.textMuted }}>CONTINUE WATCHING</div>
          <div style={{ fontSize: 14, color: 'var(--theme-text)' }}>{nextUnwatched ? nextUnwatched.title : 'You are all caught up.'}</div>
          {nextUnwatched && <div style={{ fontSize: 12, color: T.textMuted }}>Phase {nextUnwatched.phase} · {TYPE_META[nextUnwatched.type]?.label} · {nextUnwatched.year}</div>}
        </div>
        <div style={{ display: 'grid', gap: 6, marginTop: 8 }}>
          {PHASES.map(ph => <button key={ph.id} className="fpill" onClick={() => { setSidebarOpen(false); setActivePhase(ph.id); scrollTo(ph.id); }} style={{ justifyContent: 'space-between' }}><span>{ph.name}</span><ChevRight size={13} /></button>)}
        </div>
        <div style={{ marginTop: 14, fontSize: 12, color: T.textMuted, letterSpacing: 1.5, fontFamily: 'var(--font-marvel-ui)' }}>Theme</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 6, marginTop: 8 }}>
          {THEME_CHOICES.map(({ id: t, label, swatch }) => (
            <button key={t} className="fpill"
              style={{ justifyContent: 'center', gap: 6, fontSize: 11, borderColor: themeMode === t ? swatch : 'var(--theme-border)', boxShadow: themeMode === t ? `0 0 0 1px ${swatch}, 0 0 10px ${swatch}44` : 'none', background: themeMode === t ? `${swatch}18` : 'var(--theme-surface)', color: themeMode === t ? swatch : 'var(--theme-text)' }}
              onClick={() => setThemeMode(t)}
            >
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: swatch, flexShrink: 0, display: 'inline-block' }} />
              {label}
            </button>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 16, fontFamily: 'var(--font-marvel-ui)', fontSize: 9, color: T.footerText, letterSpacing: 2.5 }}>
          Made with ♥ by Marvel Fan
        </div>
      </aside>

      <div ref={settingsRef} style={{ position: 'fixed', top: 'calc(env(safe-area-inset-top, 0px) + 16px)', right: 14, zIndex: 260 }}>
        {settingsOpen && (
          <div className="fade-in dropdown-pop settings-menu" style={{ position: 'absolute', top: '100%', right: 0, zIndex: 50, marginTop: 8, minWidth: 320, borderRadius: 12, border: '1px solid color-mix(in srgb, var(--theme-accent) 35%, transparent)', background: darkMode ? 'rgba(13,19,35,0.66)' : 'rgba(255,255,255,0.62)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', boxShadow: 'none', padding: 10, display: 'grid', gap: 8, maxHeight: '80vh', overflow: 'auto', color: 'var(--theme-text)' }}>
            <div style={{ fontSize: 11, letterSpacing: 2, color: T.textMuted, textTransform: 'uppercase' }}>Profile</div>
            <input value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} placeholder="User name" style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: `1px solid ${T.inputBorder}`, background: T.inputBg, color: T.inputColor }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0,1fr))', gap: 6 }}>
              {uploadedAvatars.map((src, idx) => (
                <button key={idx} onClick={() => setProfile(p => ({ ...p, pfp: src }))} title={`Avatar ${idx + 1}`} style={{ border: `1px solid ${T.inputBorder}`, borderRadius: '999px', padding: 2, background: profile.pfp === src ? 'var(--theme-surface-hover)' : 'transparent', cursor: 'pointer' }}>
                  <img src={src} alt={`Avatar ${idx + 1}`} style={{ width: '100%', aspectRatio: '1 / 1', borderRadius: '50%', objectFit: 'cover' }} />
                </button>
              ))}
              <label title="Upload custom avatar" style={{ border: `1px dashed ${T.inputBorder}`, borderRadius: '999px', padding: 2, display: 'grid', placeItems: 'center', cursor: 'pointer',
                    willChange: 'transform', minHeight: 44, color: T.textMuted }}>
                <div style={{ display: 'grid', placeItems: 'center', fontSize: 11, gap: 2 }}>
                  <Upload size={13} />
                  <span>Custom +</span>
                </div>
                <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (!f) return; const r = new FileReader(); r.onload = () => { const img = String(r.result || ''); setAvatarCropSrc(img); }; r.readAsDataURL(f); }} style={{ display: 'none' }} />
              </label>
            </div>
            <button className="fpill" onClick={() => setProfile(p => ({ ...p, pfp: '' }))} disabled={!profile.pfp} style={{ justifyContent: 'center', opacity: profile.pfp ? 1 : 0.55 }}><Trash2 size={14}/>Remove Profile Picture</button>
            <hr style={{ border: 0, borderTop: `1px solid ${T.surfaceBorder}`, opacity: 0.6 }} />
            <div style={{ fontSize: 11, letterSpacing: 2, color: T.textMuted, textTransform: 'uppercase' }}>Preferences</div>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '8px 2px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: T.text }}><Moon size={14} /> Dark Theme</span>
              <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(d => !d)} style={{ width: 36, height: 20 }} />
            </label>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '8px 2px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: T.text }}><EyeOff size={14} /> Spoiler Safe</span>
              <input type='checkbox' checked={spoilerSafeMode} onChange={() => setSpoilerSafeMode(v => !v)} style={{ width: 36, height: 20 }} />
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 6 }}>
              <button className='fpill' onClick={() => setDensityMode('comfortable')} style={{ borderColor: densityMode === 'comfortable' ? 'var(--theme-accent)' : 'var(--theme-border)', justifyContent: 'center' }}>Comfortable</button>
              <button className='fpill' onClick={() => setDensityMode('compact')} style={{ borderColor: densityMode === 'compact' ? 'var(--theme-accent)' : 'var(--theme-border)', justifyContent: 'center' }}>Compact</button>
            </div>
            <div style={{ fontSize: 11, letterSpacing: 2, color: T.textMuted, textTransform: 'uppercase', marginTop: 2 }}>Desktop Text Size</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 6 }}>
              {DESKTOP_TEXT_SCALES.map(scale => <button key={scale} className='fpill' onClick={() => setDesktopTextScale(scale)} style={{ justifyContent: 'center', borderColor: desktopTextScale === scale ? 'var(--theme-accent)' : 'var(--theme-border)' }}>{Math.round(scale * 100)}%</button>)}
            </div>
            <hr style={{ border: 0, borderTop: `1px solid ${T.surfaceBorder}`, opacity: 0.6 }} />
            <div style={{ fontSize: 11, letterSpacing: 2, color: T.textMuted, textTransform: 'uppercase' }}>Data</div>
            <button className="fpill" onClick={exportProgress}><Download size={14}/>Export Progress</button>
            <button className="fpill" onClick={shareProgressCard}><Upload size={14}/>Share Progress Card</button>
            <button className="fpill" onClick={() => exportFetchedPosters('all')} disabled={posterExportState.active} style={{ opacity: posterExportState.active ? 0.75 : 1 }}><Download size={14}/>{posterExportState.active ? `Exporting ${posterExportState.done}/${posterExportState.total}` : 'Export All Posters'}</button>
            <button className="fpill" onClick={() => exportFetchedPosters('failed')} disabled={posterExportState.active || !Object.keys(posterExportFailures).length} style={{ opacity: posterExportState.active || !Object.keys(posterExportFailures).length ? 0.55 : 1 }}><Download size={14}/>Export Failed Posters ({Object.keys(posterExportFailures).length})</button>
            {posterExportState.message && <div style={{ fontSize: 11, color: T.textMuted }}>{posterExportState.message}</div>}
            <label className="fpill" style={{ cursor: 'pointer' }}><Upload size={14}/>Import Progress
              <input type="file" accept="application/json" onChange={(e) => importProgress(e.target.files?.[0])} style={{ display: 'none' }} />
            </label>
            <div style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.35, padding: '0 2px' }}>{metadataStatusText}</div>
            <hr style={{ border: 0, borderTop: `1px solid ${T.surfaceBorder}`, opacity: 0.6 }} />
            <div style={{ fontSize: 11, letterSpacing: 2, color: 'var(--theme-danger)', textTransform: 'uppercase' }}>Danger Zone</div>
            {posterFetchState.message && <div style={{ fontSize: 11, color: T.textMuted }}>{posterFetchState.message}</div>}
            <button className="fpill" style={{ color: 'var(--theme-danger)', background: 'var(--theme-danger-soft)' }} onClick={() => { setSearch(''); setEssOnly(false); setTypeFilter(null); setStatusFilter(null); setWatchedOnly(false); setShowCompleted(false); setActivePhase(0); }}><Trash2 size={14}/>Reset Filters</button>
          </div>
        )}
      </div>

      {/* ━━ HEADER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <header className="hexbg" style={{ position: 'relative', zIndex: 120, background: 'transparent', borderBottom: 'none', flexShrink: 0 }}>
        <div className="header-inner" style={{ width: '100%', padding: headerMinimized ? 'calc(env(safe-area-inset-top, 0px) + 14px) 24px 10px' : 'calc(env(safe-area-inset-top, 0px) + 24px) 30px 12px', transition: 'padding 0.2s ease' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 6 }}>
            <div style={{ fontFamily: 'var(--font-marvel-display)', lineHeight: 0.9, marginBottom: 0, fontWeight: 900 }}>
              <div className="header-title-mcu" style={{ fontSize: 'clamp(44px, 9vw, 64px)', letterSpacing: 'clamp(2px, 0.8vw, 7px)', color: '#fff', display: 'inline-block', padding: '0 12px', margin: '10px 0 12px', background: 'rgba(212,55,47,0.5)', borderRadius: 6 }}>MCU</div>
              <div className="header-title-sub" style={{ fontSize: 'clamp(26px, 4.2vw, 35px)', letterSpacing: 'clamp(3px, 1.1vw, 9px)', color: 'color-mix(in srgb, var(--theme-accent) 40%, var(--theme-accent-alt))', marginTop: 0 }}>VIEWING ORDER</div>
            </div>
          </div>
        </div>
      </header>

      {/* ━━ POSTER CAROUSEL ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div style={{ position: 'relative', height: isDesktopViewport ? 520 : 390, background: 'transparent', flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 210 }}>
        {heroPosters.length > 0 && (
          <div className="hero-rail"
            onWheel={(e) => {
              const rail = e.currentTarget;
              const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
              rail.scrollLeft += delta;
              e.preventDefault();
            }}
            style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', gap: 16, padding: '0 14px', overflowX: 'auto', overflowY: 'hidden', scrollSnapType: isDesktopViewport ? 'x proximity' : 'x mandatory', scrollPaddingInline: isDesktopViewport ? '14vw' : '8vw', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', overscrollBehaviorX: 'contain', overscrollBehaviorY: 'contain', touchAction: isDesktopViewport ? 'pan-x' : 'pan-x pan-y' }}>
            {visibleHeroPosters.map((src, idx) => {
              const isActive = idx === 0;
              const heroItem = filtered.find(i => posterSrc(i) === src);
              return (
                <div key={`hero-rail-${src}`} className="hero-poster-card" style={{ '--poster-delay': `${idx * 34}ms`, position: 'relative', display:'flex', flexDirection:'column', alignItems:'center', scrollSnapAlign:'center', flexShrink: 0 }}>
                <img
                  src={src}
                  alt="Featured poster"
                  title={heroItem?.title || 'Featured MCU poster'}
                  onClick={() => { if (heroItem) setDetailItem(heroItem); }}
                  onMouseMove={(e) => {
                    const card = e.currentTarget;
                    const rect = card.getBoundingClientRect();
                    const px = (e.clientX - rect.left) / rect.width;
                    const py = (e.clientY - rect.top) / rect.height;
                    card.style.setProperty('--rx', `${(0.5 - py) * 4}deg`);
                    card.style.setProperty('--ry', `${(px - 0.5) * 5}deg`);
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.setProperty('--rx', '0deg');
                    e.currentTarget.style.setProperty('--ry', '0deg');
                  }}
                  style={{
                    height: isDesktopViewport ? 440 : 320,
                    width: isDesktopViewport ? 292 : 218,
                    objectFit: 'cover',
                    borderRadius: 16,
                    border: '0',
                    boxShadow: 'none',
                    opacity: isActive ? 1 : 0.76,
                    transform: `perspective(1100px) translateZ(${isActive ? '20px' : '0'}) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) ${isActive ? 'scale(1.06) translateY(-6px)' : 'scale(0.96)'}`,
                    transition: 'transform 360ms cubic-bezier(0.22,1,0.36,1), opacity 220ms ease, filter 220ms ease',
                    cursor: 'pointer',
                  }}
                />
                <div style={{ position: 'absolute', left: 9, right: 9, bottom: 9, padding: '5px 7px', borderRadius: 8, background: 'linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.62))', color: '#fff', fontSize: 9, fontWeight: 700, lineHeight: 1.15, textShadow: '0 1px 4px rgba(0,0,0,0.9)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)', maxWidth: isDesktopViewport ? 274 : 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'center', pointerEvents: 'none' }}>{heroItem?.title || 'Featured MCU poster'}</div>
                </div>
              );
            })}
          </div>
        )}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: 16, background: 'linear-gradient(90deg, rgba(4,6,12,0.78) 0%, transparent 12%, transparent 88%, rgba(4,6,12,0.78) 100%)' }} />
       
      </div>
      {/* ━━ FILTER BAR (collapsible) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div style={{ background: 'transparent', borderBottom: 'none', flexShrink: 0, position: 'relative', zIndex: 220, marginTop: 0 }}>
        {/* Toggle row — always visible */}
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', flexWrap: 'wrap' }}>
            <button
              onClick={() => setFiltersOpen(v => !v)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 10, border: `1px solid ${filtersOpen ? 'color-mix(in srgb, var(--theme-accent) 50%, var(--theme-border))' : T.filterBorder}`, background: 'transparent', color: filtersOpen ? 'var(--theme-accent)' : T.textMuted, cursor: 'pointer', fontFamily: 'var(--font-marvel-ui)', fontSize: 13, letterSpacing: 2, transition: 'all 0.18s' }}
            >
              <SlidersH size={13} />
              Filters
              {activeFilterCount > 0 && (
                <span style={{ background: 'var(--theme-accent)', color: '#fff', borderRadius: 999, fontSize: 10, fontFamily: 'var(--font-marvel-display)', fontWeight: 700, padding: '1px 6px', lineHeight: 1.4 }}>{activeFilterCount}</span>
              )}
              <ChevDown size={11} style={{ opacity: 0.7, transform: filtersOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>
            {renderPhaseSelector()}
            <button className="glass-grad" onClick={() => nextUnwatched && setDetailItem(nextUnwatched)} style={{ border: `1px solid ${T.filterBorder}`, borderRadius: 999, padding: '5px 10px', display: 'flex', alignItems: 'center', gap: 8, maxWidth: 360, background: 'transparent', cursor: nextUnwatched ? 'pointer' : 'default' }}>
              <span style={{ fontSize: 10, letterSpacing: 1.6, color: T.textMuted, textTransform: 'uppercase' }}>Continue</span>
              <span style={{ fontSize: 12, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{nextUnwatched ? nextUnwatched.title : 'All caught up'}</span>
            </button>
            {/* Search always visible */}
            <div style={{ position: 'relative', flex: '1 1 220px', minWidth: 170, maxWidth: isDesktopViewport ? 320 : '100%' }}>
              <Search size={12} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: T.textMuted }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder=""
                aria-label="Search titles"
                style={{ width: '100%', background: 'transparent', border: `1px solid ${T.inputBorder}`, borderRadius: 999, padding: '7px 12px 7px 30px', color: T.inputColor, fontSize: 14, letterSpacing: 0.3, boxShadow: spiderSense ? '0 0 0 2px rgba(220,20,60,0.45), 0 0 16px rgba(220,20,60,0.35)' : 'none', animation: spiderSense ? 'spiderPulse 0.85s ease-in-out infinite' : 'none' }} />
            </div>
            <div className='filter-row-actions' style={{ marginLeft: 0, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-start', minWidth: 0 }} />
          </div>
        </div>

        {/* Collapsible filter controls */}
        {filtersOpen && (
          <div className="filters-open" style={{ padding: '0 48px 12px', maxWidth: 1400, margin: '0 auto' }}>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', overflow: 'visible' }}>
              {/* Sort */}
              <div ref={sortRef} style={{ position: 'relative' }}>
                <button className="fpill" onClick={() => setSortOpen(o => !o)}
                  style={{ color: 'var(--theme-accent)', borderColor: 'color-mix(in srgb, var(--theme-accent) 22%, var(--theme-border))', background: 'color-mix(in srgb, var(--theme-accent) 9%, var(--theme-surface))', fontFamily: 'var(--font-marvel-ui)', fontSize: 'clamp(14px, 2.2vw, 16px)', letterSpacing: 2 }}>
                  {SORT_LABELS[sortBy]}
                  <ChevDown size={12} style={{ opacity: 0.6, transform: sortOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>
                {sortOpen && (
                  <div className="fade-in dropdown-pop" style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, background: 'color-mix(in srgb, var(--theme-surface) 65%, transparent)', border: `1px solid ${T.dropdownBorder}`, borderRadius: 9, overflow: 'hidden', zIndex: 520, boxShadow: 'none', minWidth: 200 }}>
                    {Object.entries(SORT_LABELS).map(([k, v]) => (
                      <div key={k} className={`sopt ${sortBy === k ? 'picked' : ''}`} onClick={() => { setSortBy(k); setSortOpen(false); }}>{v}</div>
                    ))}
                  </div>
                )}
              </div>
              {/* Type pills */}
              {['film', 'series', 'short'].map(t => {
                const m = TYPE_META[t];
                const on = typeFilter === t;
                return (
                  <button key={t} className="fpill"
                    style={on ? { borderColor: m.color + '88', background: m.color + '14', color: m.color } : {}}
                    onClick={() => setTypeFilter(on ? null : t)}>
                    <m.Icon size={10} />{m.label}
                  </button>
                );
              })}
              {(listMode === 'core' || listMode === 'extended') && (
                <button className="fpill"
                  style={essentialOnly ? { borderColor: 'color-mix(in srgb, var(--theme-warning) 50%, transparent)', background: 'var(--theme-warning-soft)', color: 'var(--theme-warning)' } : {}}
                  onClick={() => setEssOnly(o => !o)}>
                  <Star size={10} />Must-Watch
                </button>
              )}
              <button className="fpill"
                style={showAllFiltersOverride ? { borderColor: 'var(--theme-accent)', background: 'color-mix(in srgb, var(--theme-accent) 14%, var(--theme-surface))', color: 'var(--theme-accent)' } : {}}
                onClick={() => setShowAllFiltersOverride(v => !v)}>
                <Eye size={10} />Show All
              </button>
              {/* Status filter */}
              <div style={{ position: 'relative' }}>
                <button className="fpill"
                  style={watchedOnly || statusFilter ? { borderColor: 'color-mix(in srgb, var(--theme-success) 50%, transparent)', background: 'var(--theme-success-soft)', color: 'var(--theme-success)' } : {}}
                  onClick={() => setFilterStatusOpen(v => !v)}
                  >
                  <Check size={10} />Status
                </button>
                {filterStatusOpen && (
                  <div className="fade-in dropdown-pop" style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, background: 'color-mix(in srgb, var(--theme-surface) 65%, transparent)', border: `1px solid ${T.dropdownBorder}`, borderRadius: 9, overflow: 'hidden', zIndex: 520, boxShadow: 'none', minWidth: 180 }}
                    >
                    <div className={`sopt ${!statusFilter && !watchedOnly ? 'picked' : ''}`} onClick={() => { setStatusFilter(null); setWatchedOnly(false); setFilterStatusOpen(false); }}>Show all status</div>
                    <div className={`sopt ${watchedOnly ? 'picked' : ''}`} onClick={() => { setWatchedOnly(true); setStatusFilter(null); setFilterStatusOpen(false); }}>Watched only</div>
                    <div className={`sopt ${statusFilter === 'watching' ? 'picked' : ''}`} onClick={() => { setStatusFilter('watching'); setWatchedOnly(false); setFilterStatusOpen(false); }}>Watching</div>
                    <div className={`sopt ${statusFilter === 'plan-to-watch' ? 'picked' : ''}`} onClick={() => { setStatusFilter('plan-to-watch'); setWatchedOnly(false); setFilterStatusOpen(false); }}>Plan to Watch</div>
                    <div className={`sopt ${statusFilter === 'dropped' ? 'picked' : ''}`} onClick={() => { setStatusFilter('dropped'); setWatchedOnly(false); setAutoHideStatuses(false); setFilterStatusOpen(false); }}>Dropped</div>
                    
                  </div>
                )}
              </div>
              {/* Bulk actions */}
              <button className="fpill"
                style={bulkSelectMode ? { borderColor: 'var(--theme-accent)', background: 'color-mix(in srgb, var(--theme-accent) 12%, var(--theme-surface))', color: 'var(--theme-accent)' } : {}}
                onClick={() => { setBulkSelectMode(v => !v); clearBulkSelection(); }}>
                <Check size={10} />{bulkSelectMode ? `Selecting ${selectedIds.size}` : 'Select'}
              </button>
              {bulkSelectMode && (
                <>
                  <button className="fpill" onClick={() => setSelectedIds(new Set(filtered.map(i => i.id)))} style={{ padding: '7px 12px' }}>Select visible</button>
                  <button className="fpill" disabled={!selectedIds.size} onClick={() => applyBulkStatus('watched')} style={{ padding: '7px 12px', opacity: selectedIds.size ? 1 : 0.5 }}><Check size={10}/>Watched</button>
                  <button className="fpill" disabled={!selectedIds.size} onClick={() => applyBulkStatus('plan-to-watch')} style={{ padding: '7px 12px', opacity: selectedIds.size ? 1 : 0.5 }}><Clock size={10}/>Plan</button>
                  <button className="fpill" disabled={!selectedIds.size} onClick={() => applyBulkStatus('unwatched')} style={{ padding: '7px 12px', opacity: selectedIds.size ? 1 : 0.5 }}><EyeOff size={10}/>Unwatched</button>
                </>
              )}
              {/* Reset */}
              {activeFilterCount > 0 && (
                <button className="fpill" style={{ color: 'var(--theme-danger)', borderColor: 'var(--theme-danger-soft)', background: 'var(--theme-danger-soft)', padding: '7px 12px' }}
                  onClick={() => { setSearch(''); setEssOnly(false); setTypeFilter(null); setStatusFilter(null); setWatchedOnly(false); setAutoHideStatuses(false); setSortBy('order'); }}>
                  <Trash2 size={10} /> Clear
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <div style={{ position: 'fixed', right: 16, bottom: isDesktopViewport ? 76 : 88, zIndex: 230 }}>
        <div style={{ display: 'flex', borderRadius: 999, overflow: 'hidden', border: `1px solid ${T.surfaceBorder}`, background: darkMode ? 'rgba(10,14,28,0.93)' : 'rgba(255,255,255,0.95)', boxShadow: 'none' }}>
          {LIST_MODES.map(mode => {
            const active = listMode === mode.id;
            return (
              <button key={`float-${mode.id}`} onClick={() => { setListMode(mode.id); setExpandedItem(null); setExpandedPhase(null); }}
                style={{ border: 0, padding: '8px 12px', fontFamily: 'var(--font-marvel-ui)', letterSpacing: 1.4, fontSize: 12, cursor: 'pointer', background: active ? `${mode.color}22` : 'transparent', color: active ? mode.color : T.textMuted }}>
                {mode.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ━━ JUMP NEXT BUTTON ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="bottom-action-dock">
        <button type="button" onClick={handleMetadataBuildClick} className="dock-btn"
          style={{ borderColor: metadataBuild.status === 'running' ? 'var(--theme-warning)' : T.surfaceBorder }}>
          {metadataBuild.status === 'running' ? `Fetch ${metadataBuild.done}/${metadataBuild.total}` : 'Fetch'}
        </button>
        <button type="button" className="dock-btn"
          onClick={() => setViewMode(viewMode === 'list' ? 'calendar' : 'list')}
          style={{ background: viewMode === 'calendar' ? 'color-mix(in srgb, var(--theme-accent) 16%, rgba(20,25,46,0.82))' : undefined }}>
          {viewMode === 'calendar' ? 'List' : 'Calendar'}
        </button>
        <div className="dock-status-menu" style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setDockStatusOpen(v => !v)}
            aria-label="Open quick status filters"
            className="bottom-action-bar"
            style={{ border: `1px solid ${T.surfaceBorder}`, background: darkMode ? 'rgba(20,25,46,0.84)' : 'rgba(255,255,255,0.86)', color: 'var(--theme-text)', boxShadow: 'none', fontFamily: 'var(--font-marvel-ui)', letterSpacing: 1.2, fontSize: 12, fontWeight: 700 }}
          >
            Status Menu <ChevDown size={12} style={{ transform: dockStatusOpen ? 'rotate(180deg)' : 'none' }} />
          </button>
          {dockStatusOpen && (
            <div className="fade-in dropdown-pop" style={{ position: 'absolute', bottom: 'calc(100% + 8px)', right: 0, minWidth: 172, background: darkMode ? 'rgba(17,21,39,0.92)' : 'rgba(255,255,255,0.92)', border: `1px solid ${T.dropdownBorder}`, borderRadius: 10, overflow: 'hidden', boxShadow: 'none', color: 'var(--theme-text)' }}>
              <div className="sopt" onClick={() => { setStatusFilter(null); setWatchedOnly(false); setAutoHideStatuses(false); setDockStatusOpen(false); }}>All statuses</div>
              <div className="sopt" onClick={() => { setWatchedOnly(true); setStatusFilter(null); setAutoHideStatuses(false); setDockStatusOpen(false); }}>Watched</div>
              <div className="sopt" onClick={() => { setStatusFilter('watching'); setWatchedOnly(false); setDockStatusOpen(false); }}>Watching</div>
              <div className="sopt" onClick={() => { setStatusFilter('on-hold'); setWatchedOnly(false); setDockStatusOpen(false); }}>On Hold</div>
              <div className="sopt" onClick={() => { setStatusFilter('dropped'); setWatchedOnly(false); setDockStatusOpen(false); }}>Dropped</div>
              <div className="sopt" onClick={() => { setStatusFilter('plan-to-watch'); setWatchedOnly(false); setDockStatusOpen(false); }}>Plan to Watch</div>
            </div>
          )}
        </div>
      </div>

      {/* ━━ CONTENT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <main ref={mainRef} className={snapMode ? 'snap-blip' : ''} style={{ overflow: 'visible', flex: '0 0 auto', '--content-max': '95vw', '--content-pad': '20px', '--sticky-offset': headerCompact ? '44px' : '72px' }}>
        <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto', padding: '24px 16px 80px 16px', width: '100%', display: 'flex', flexDirection: 'column', minHeight: 'calc(100% - 400px)' }} className="list-mode-switch">
          {phaseKeys.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 0', fontFamily: 'var(--font-marvel-ui)', fontSize: 19, color: T.textMuted, letterSpacing: 4 }}>
              NO RESULTS — ADJUST YOUR FILTERS
            </div>
          )}

          {viewMode === 'calendar' ? (
            <section className='curvy-panel' style={{ border: `1px solid ${T.surfaceBorder}`, background: 'var(--theme-surface)', borderRadius: 14, padding: 16 }}>
              <h3 style={{ margin: '4px 0 14px', letterSpacing: 2, fontFamily: 'var(--font-marvel-ui)' }}>Release Calendar</h3>
              <div style={{ marginBottom: 12, color: T.textMuted }}>Upcoming with real dates</div>
              {calendarItems.upcoming.length === 0 ? <div style={{ marginBottom: 12, color: T.textMuted }}>No dated upcoming entries in current filter.</div> : calendarItems.upcoming.map(({ item, rawDate, label, releaseStatus }) => (
                <div key={'up-'+item.id} className='rrow calendar-row' style={{ gridTemplateColumns: '108px 52px minmax(0,1fr)', background: 'transparent' }}>
                  <div style={{ fontSize: 11, color: 'var(--theme-warning)' }}>{formatReleaseDate(rawDate, item.year, label, releaseStatus)}</div>
                  <LazyPoster className="poster" src={posterSrc(item)} alt={item.title} />
                  <button className='title-btn' onClick={() => setDetailItem(item)} style={{ textAlign: 'left' }}>{item.title}<div style={{ fontSize: 11, color: T.textMuted }}>Phase {item.phase} · {TYPE_META[item.type]?.label}</div></button>
                </div>
              ))}
              <div style={{ margin: '16px 0 12px', color: T.textMuted }}>TBA / release window only</div>
              {calendarItems.tba.length === 0 ? <div style={{ marginBottom: 12, color: T.textMuted }}>No TBA entries in current filter.</div> : calendarItems.tba.map(({ item, rawDate, label, releaseStatus }) => (
                <div key={'tba-'+item.id} className='rrow calendar-row' style={{ gridTemplateColumns: '108px 52px minmax(0,1fr)', background: 'transparent' }}>
                  <div style={{ fontSize: 11, color: T.textMuted }}>{formatReleaseDate(rawDate, item.year, label, releaseStatus)}</div>
                  <LazyPoster className="poster" src={posterSrc(item)} alt={item.title} />
                  <button className='title-btn' onClick={() => setDetailItem(item)} style={{ textAlign: 'left' }}>{item.title}<div style={{ fontSize: 11, color: T.textMuted }}>Phase {item.phase} · {TYPE_META[item.type]?.label}</div></button>
                </div>
              ))}
              <div style={{ margin: '16px 0 12px', color: T.textMuted }}>Already Released</div>
              {calendarItems.released.map(({ item, rawDate, label, releaseStatus }) => (
                <div key={'old-'+item.id} className='rrow calendar-row' style={{ gridTemplateColumns: '108px 52px minmax(0,1fr)', background: 'transparent' }}>
                  <div style={{ fontSize: 11, color: T.textMuted }}>{formatReleaseDate(rawDate, item.year, label, releaseStatus)}</div>
                  <LazyPoster className="poster" src={posterSrc(item)} alt={item.title} />
                  <button className='title-btn' onClick={() => setDetailItem(item)} style={{ textAlign: 'left' }}>{item.title}<div style={{ fontSize: 11, color: T.textMuted }}>Phase {item.phase} · {TYPE_META[item.type]?.label}</div></button>
                </div>
              ))}
            </section>
          ) : phaseKeys.map(pid => {
            const ph = PHASES.find(p => p.id === pid);
            const rows = grouped[pid];
            const done = rows.filter(r => r.status === 'watched').length;
            const phasePct = rows.length ? Math.round((done / rows.length) * 100) : 0;
            const isCelebrating = celebPhase === pid;
            const summaryOpen = expandedPhase === pid;

            return (
              <section key={pid} className="section-up" data-phase={pid}
                ref={el => { phaseRefs.current[pid] = el; }}
                style={{ marginBottom: 36, scrollMarginTop: 'var(--sticky-offset)', position: 'relative' }}>
                {isCelebrating && (
                  <div className="phase-flash" style={{ position: 'absolute', inset: 0, background: `linear-gradient(90deg, ${ph.color}40, ${ph.color}22)`, boxShadow: `0 0 10px ${ph.glow}`, borderRadius: 12, pointerEvents: 'none', zIndex: 5 }} />
                )}

                {/* Phase divider */}
                <div className="curvy-panel" style={{ '--phase-color': ph.color, display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap', padding: '10px 10px 10px 12px', border: `1px solid ${T.surfaceBorder}`, background: 'transparent' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--font-marvel-display)', fontSize: 'clamp(23px, 3vw, 28px)', letterSpacing: 2.2, color: ph.color, lineHeight: 1, fontWeight: 700, textShadow: darkMode ? `0 0 18px ${ph.glow}` : 'none' }}>
                      {ph.name}
                    </div>
                    <div style={{ fontSize: 'clamp(12px, 1.4vw, 14px)', color: T.textMuted, letterSpacing: 1.4, fontFamily: 'var(--font-marvel-ui)', marginTop: 1, textTransform: 'uppercase', maxWidth: 360, lineHeight: 1.15 }}>
                      {ph.tagline === 'Assembling the Avengers' ? <>ASSEMBLING<br />THE AVENGERS</> : ph.tagline}
                    </div>
                  </div>
                  <span style={{ fontFamily: 'var(--font-marvel-ui)', fontSize: 11, letterSpacing: 1, color: phasePct === 100 ? ph.color : T.textMuted, flexShrink: 0, minWidth: 38, textAlign: 'right' }}>
                    {done}/{rows.length}
                  </span>
                  <button onClick={() => setExpandedPhase(summaryOpen ? null : pid)}
                    aria-label={summaryOpen ? 'Hide phase summary' : 'Show phase summary'}
                    style={{ background: 'none', border: `1px solid ${summaryOpen ? ph.color + '66' : T.surfaceBorder}`, color: summaryOpen ? ph.color : T.textMuted, borderRadius: 6, padding: '3px 8px', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontFamily: 'var(--font-marvel-ui)', letterSpacing: 2.2, textTransform: 'uppercase', transition: 'all 0.18s' }}>
                    <Info size={11} />INFO
                  </button>
                  {done < rows.length ? (
                    <button onClick={() => markPhaseWatched(pid, 'watched')}
                      style={{ fontFamily: 'var(--font-marvel-ui)', fontSize: 10, letterSpacing: 1.5, color: ph.color, background: 'transparent', border: `1px solid ${ph.color}44`, borderRadius: 6, padding: '4px 9px', cursor: 'pointer', flexShrink: 0, transition: 'all 0.16s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = ph.color + '16'; e.currentTarget.style.borderColor = ph.color + '88'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = ph.color + '44'; }}>
                      MARK ALL
                    </button>
                  ) : (
                    <button onClick={() => markPhaseWatched(pid, 'unwatched')}
                      style={{ fontFamily: 'var(--font-marvel-ui)', fontSize: 10, letterSpacing: 1.5, color: T.textMuted, background: 'transparent', border: `1px solid ${T.surfaceBorder}`, borderRadius: 6, padding: '4px 9px', cursor: 'pointer', flexShrink: 0, transition: 'all 0.16s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = T.rowHoverBg; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                      CLEAR
                    </button>
                  )}
                </div>

                {summaryOpen && (
                  <div className="fade-in collapse-panel curvy-panel" style={{ '--phase-color': ph.color, background: T.phaseSummaryBg, border: `1px solid ${T.phaseSummaryBorder}`, borderRadius: 12, padding: '12px 14px 12px 18px', marginBottom: 10, fontSize: 14, color: T.textMuted, lineHeight: 1.6, fontFamily: 'var(--font-marvel-display)', letterSpacing: 0.2 }}>
                    {ph.summary}
                  </div>
                )}

                {/* Row table */}
                <div style={{ background: T.surfaceBg, border: `1px solid ${T.surfaceBorder}`, borderRadius: 14, overflow: 'hidden', boxShadow: 'none' }}>
                  <PhaseRows rows={rows} renderRow={(item, idx) => {
                    const itemReleaseStatus = releaseStatusFor(item);
                    const itemReleaseInfo = releaseInfoFor(item);
                    return (
                      <MemoizedTitleRow
                        key={item.id}
                        item={item}
                        idx={idx}
                        ph={ph}
                        T={T}
                        typeMeta={TYPE_META[item.type]}
                        statusMeta={STATUS_META[item.status]}
                        releaseStatus={itemReleaseStatus}
                        releaseStatusText={releaseStatusLabel(itemReleaseStatus)}
                        releaseStatusStyleObj={releaseStatusStyle(itemReleaseStatus)}
                        releaseLabel={formatReleaseDate(itemReleaseInfo.date, item.year, itemReleaseInfo.label, itemReleaseStatus)}
                        poster={posterSrc(item)}
                        genres={inferGenres(item)}
                        isExpanded={expandedItem === item.id}
                        isWatched={item.status === 'watched'}
                        isBookmarked={Boolean(bookmarks[item.id])}
                        statusDropdown={statusDropdown}
                        rating={metaCache[item.id]?.rating || RELEASE_INFO[item.title]?.rating}
                        onOpenDetail={openDetail}
                        onSetStatus={setStatusDirect}
                        onToggleBookmark={toggleBookmark}
                        onOpenStatus={openStatusDropdown}
                        bulkSelectMode={bulkSelectMode}
                        isSelected={selectedIds.has(item.id)}
                        onToggleSelected={toggleSelected}
                        statusLabelOverride={grootMode ? 'I am Groot' : null}
                        isWorthy={Boolean(worthyIds[item.id])}
                        multiverseShuffle={multiverseShuffle}
                        onThorLongPress={(pressedItem) => { setWorthyIds(prev => ({ ...prev, [pressedItem.id]: !prev[pressedItem.id] })); setLightningStrike(true); setTimeout(() => setLightningStrike(false), 700); }}
                      />
                    );
                  }}/>

                </div>
              </section>
            );
          })}

          <div style={{ textAlign: 'center', marginTop: 44, fontFamily: 'var(--font-marvel-ui)', fontSize: 9, color: T.footerText, letterSpacing: 3.5 }}>
            Made with ♥️ by Marvel Fan
          </div>
        </div>
      </main>

      {/* ━━ DETAIL MODAL ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {detailItem && (
        <div className="detail-backdrop" onClick={() => setDetailItem(null)} role="dialog" aria-label="Movie details">
          <div className="detail-card glass-panel detail-open" onClick={(e) => e.stopPropagation()} style={{ background: 'color-mix(in srgb, var(--theme-surface) 68%, transparent)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', border: '1px solid color-mix(in srgb, var(--theme-accent) 24%, var(--theme-border))' }}>
            <div className="detail-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(220px,34%) minmax(0,1fr)', gap: 18, alignItems: 'start', width: '100%' }}>
              {detailPosterFailed ? (
                <div className="detail-fallback-poster" style={{ width: '100%', minHeight: 340, borderRadius: 10, border: `1px solid ${T.surfaceBorder}` }}>
                  <span>{detailItem.title}</span>
                </div>
              ) : (
                <img src={detailData?.Poster && detailData.Poster !== 'N/A' ? detailData.Poster : posterSrc(detailItem)} onError={() => setDetailPosterFailed(true)} alt={`${detailItem.title} poster`} style={{ width: '100%', borderRadius: 10, border: `1px solid ${T.surfaceBorder}`, maxHeight: 520, objectFit: 'cover' }} />
              )}
              <div>
                <h2 style={{ fontSize: 32, marginBottom: 8 }}>{detailItem.title}</h2>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                  <span className="fpill detail-pill" style={{ padding: '3px 8px', fontSize: 11, pointerEvents: 'none' }}>{detailData?.Year || detailItem.year}</span>
                  <span className="fpill detail-pill" style={{ padding: '3px 8px', fontSize: 11, pointerEvents: 'none' }}>{TYPE_META[detailItem.type]?.label}</span>
                  <span className="fpill detail-pill" style={{ padding: '3px 8px', fontSize: 11, pointerEvents: 'none' }}>Phase {detailItem.phase}</span>
                  {(detailData?.imdbRating && detailData.imdbRating !== 'N/A') && <span className="fpill detail-pill" style={{ padding: '3px 8px', fontSize: 11, pointerEvents: 'none' }}>★ {detailData.imdbRating}</span>}
                </div>
                {detailLoading && <div style={{ fontSize: 13, color: T.textMuted, marginBottom: 8 }}>Loading metadata…</div>}
                {!detailLoading && !detailData && <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 8 }}>Showing local data.</div>}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, color: T.textMuted }}>Description</span>
                  <button
                    className="fpill glass-panel detail-btn"
                    style={{ padding: '4px 10px', fontSize: 10, borderRadius: 999 }}
                    onClick={async () => {
                      if (detailPlotState.active === 'primary') {
                        if (!detailPlotState.secondary) await fetchSecondaryPlotForDetail();
                        setDetailPlotState(prev => ({ ...prev, active: 'secondary' }));
                      } else {
                        setDetailPlotState(prev => ({ ...prev, active: 'primary' }));
                      }
                    }}
                  >
                    <SwitchIcon size={11} /> {detailPlotState.active === 'primary' ? 'TMDB' : (detailPlotState.loadingSecondary ? 'Loading…' : 'OMDb')}
                  </button>
                </div>
                <p key={detailPlotState.active} className="detail-description" style={{ fontSize: 14, lineHeight: 1.55, marginBottom: 12, maxHeight: isDesktopViewport ? 142 : 118, overflowY: 'auto', padding: '8px 10px', border: `1px solid ${T.surfaceBorder}`, borderRadius: 10, background: 'color-mix(in srgb, var(--theme-surface) 36%, transparent)', filter: spoilerSafe ? 'blur(5px)' : 'none', transition: 'filter 0.18s ease' }}>
                  {detailPlotState.active === 'secondary'
                    ? (detailPlotState.secondary || detailItem.desc)
                    : (detailPlotState.primary || detailData?.Plot || detailItem.desc)}
                </p>
                <div style={{ fontSize: 14, marginBottom: 8 }}><strong>Prerequisite:</strong> {detailItem.prereq}</div>
                <div style={{ fontSize: 14, marginBottom: 8 }}><strong>Release:</strong> {formatReleaseDate(releaseInfoFor(detailItem).date, detailItem.year, releaseInfoFor(detailItem).label, releaseStatusFor(detailItem))}</div>
                <div style={{ fontSize: 14, marginBottom: 8 }}><strong>Status:</strong> {STATUS_META[detailItem.status]?.label}</div>
                <div style={{ fontSize: 14, marginBottom: 8 }}><strong>Director:</strong> {detailData?.Director && detailData.Director !== 'N/A' ? detailData.Director : 'Director data coming soon'}</div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 11, color: T.textMuted, letterSpacing: 1.1, fontFamily: 'var(--font-marvel-ui)' }}>SPOILER SAFE</span>
                  <button className="fpill glass-panel" onClick={() => setSpoilerSafeMode(v => !v)}
                    style={{ padding: '6px 10px', fontSize: 11, background: spoilerSafe ? 'rgba(232,184,75,0.18)' : 'rgba(255,255,255,0.06)', borderColor: spoilerSafe ? 'rgba(232,184,75,0.45)' : 'rgba(255,255,255,0.16)' }}>
                    {spoilerSafe ? 'On · Tap to reveal' : 'Off · Tap to hide'}
                  </button>
                </div>

                <div className="detail-btn-group">
                  <button
                    className={`fpill glass-panel detail-btn ${myLikes[detailItem.id] ? 'is-active' : ''}`}
                    onClick={() => setMyLikes(prev => ({ ...prev, [detailItem.id]: !prev[detailItem.id] }))}
                  >
                    <Heart size={12}/> {myLikes[detailItem.id] ? 'Liked' : 'Like'}
                  </button>
                  <button className="fpill glass-panel detail-btn" style={{ fontSize: 14, fontWeight: 700 }} onClick={() => exportPosterForItem(detailItem)}><Download size={14}/> Export Details Card</button>
                </div>
                <div style={{ fontSize: 14 }}><strong>Cast:</strong> {detailData?.Actors && detailData.Actors !== 'N/A' ? detailData.Actors : (CAST_MAP[detailItem.title] || ['Cast data coming soon']).join(', ')}</div>
              </div>
            </div>
            <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end' }}>
              <button className="fpill" onClick={() => setDetailItem(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {analyticsOpen && (
        <div className="detail-backdrop" onClick={() => setAnalyticsOpen(false)} role="dialog" aria-label="Analysis history">
          <div className="detail-card glass-panel detail-open" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 1080, border: '1px solid color-mix(in srgb, var(--theme-accent) 24%, var(--theme-border))', boxShadow: '0 28px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', marginBottom: 14 }}>
              <div>
                <h2 style={{ fontSize: 30, marginBottom: 4 }}>Analysis</h2>
                <div style={{ color: T.textMuted, fontSize: 13 }}>Full history, dates, re-watch counts, modern 10-point ratings, and reviews.</div>
              </div>
              <button className="fpill" onClick={() => setAnalyticsOpen(false)}>Close</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 10, marginBottom: 14 }}>
              <div className="glass-panel" style={{ padding: 12, borderRadius: 12 }}><div style={{ color: T.textMuted, fontSize: 11 }}>TOTAL WATCHED</div><div style={{ fontSize: 24, fontWeight: 800 }}>{Math.round(totalWatchedHours * 10) / 10}h</div></div>
              <div className="glass-panel" style={{ padding: 12, borderRadius: 12 }}><div style={{ color: T.textMuted, fontSize: 11 }}>HISTORY ITEMS</div><div style={{ fontSize: 24, fontWeight: 800 }}>{historyItems.length}</div></div>
              <div className="glass-panel" style={{ padding: 12, borderRadius: 12 }}><div style={{ color: T.textMuted, fontSize: 11 }}>RE-WATCHES</div><div style={{ fontSize: 24, fontWeight: 800 }}>{Object.values(rewatchCount).reduce((a, b) => a + (Number(b) || 0), 0)}</div></div>
            </div>
            <button className="fpill" onClick={shareAnalysisCard} style={{ marginBottom: 12 }}><Upload size={14}/>Share Analysis Card</button>
            <div className="glass-panel" style={{ marginBottom: 10, padding: 10, borderRadius: 10, display: 'grid', gap: 8 }}>
              <div style={{ fontSize: 11, letterSpacing: 1.4, color: T.textMuted, textTransform: 'uppercase' }}>Review Card Theme</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 6 }}>
                {[{id:'midnight',label:'Midnight'},{id:'stark',label:'Stark'},{id:'vibranium',label:'Vibranium'}].map(opt => (
                  <button key={opt.id} className="fpill" onClick={() => setReviewCardTheme(opt.id)} style={{ justifyContent:'center', padding:'6px 8px', fontSize:11, borderColor: reviewCardTheme === opt.id ? 'var(--theme-accent)' : 'var(--theme-border)' }}>{opt.label}</button>
                ))}
              </div>
              {reviewShareStatus.message && <div style={{ fontSize: 12, color: reviewShareStatus.type === 'error' ? 'var(--theme-danger)' : 'var(--theme-success)' }}>{reviewShareStatus.message}</div>}
            </div>
            <div style={{ display: 'grid', gap: 12, maxHeight: '58vh', overflow: 'auto', paddingRight: 4 }}>
              {historyItems.length === 0 && <div style={{ color: T.textMuted, padding: 16 }}>No watched history yet. Mark an item watched to start your analysis log.</div>}
              {historyItems.map(item => (
                <div key={item.id} className="glass-panel" style={{ borderRadius: 16, padding: 14, display: 'grid', gap: 10, border: '1px solid color-mix(in srgb, var(--theme-accent) 35%, var(--theme-border))', background: 'linear-gradient(145deg, color-mix(in srgb, var(--theme-surface) 76%, #102445), color-mix(in srgb, var(--theme-surface) 95%, #04050a))', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'baseline', flexWrap: 'wrap' }}>
                    <strong style={{ fontSize: 16 }}>{item.title}</strong>
                    <span style={{ color: T.textMuted, fontSize: 12 }}>{item.watchedDate || 'No watch date'} · ~{Math.round(estimateRuntimeHours(item) * 10) / 10}h</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: 12, alignItems: 'start' }}>
                    <img src={posterSrc(item)} alt={item.title} style={{ width: 100, height: 145, borderRadius: 10, objectFit: 'cover', border: `1px solid ${T.surfaceBorder}` }} />
                    <div style={{ display: 'grid', gap: 8 }}>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                    <button className="fpill" style={{ padding: '6px 9px', fontSize: 11 }} onClick={() => setRewatchCount(p => ({ ...p, [item.id]: (p[item.id] || 0) + 1 }))}><Clock size={12}/>Re-watch {rewatchCount[item.id] || 0}</button>
                    <button className="fpill" style={{ padding: '6px 9px', fontSize: 11 }} onClick={() => setRewatchCount(p => ({ ...p, [item.id]: Math.max(0, (p[item.id] || 0) - 1) }))}>−</button>
                    <span style={{ color: T.textMuted, fontSize: 12, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700 }}>Star Rating</span>
                    {[1,2,3,4,5].map(n => (
                      <button key={n} aria-label={`${n} stars for ${item.title}`} onClick={() => setReviewRating(item.id, n * 2)} style={{ border: 0, width: 26, height: 26, borderRadius: 8, background: (myRating[item.id] || 0) >= (n * 2) ? 'rgba(124,255,218,0.2)' : 'transparent', color: (myRating[item.id] || 0) >= (n * 2) ? '#ffd35c' : T.textFaint, display: 'grid', placeItems: 'center', cursor: 'pointer', fontSize: 16, fontWeight: 700 }}><span>★</span></button>
                    ))}
                    <span style={{ fontSize: 12, fontWeight: 800, fontFamily: 'Manrope, sans-serif', color: '#7cffda' }}>{myRating[item.id] || 0}/10</span>
                  </div>
                  <textarea
                    value={reviews[item.id] || ''}
                    onChange={(e) => setReviews(prev => ({ ...prev, [item.id]: e.target.value }))}
                    placeholder="Add a review or note…"
                    rows={2}
                    style={{ width: '100%', resize: 'vertical', borderRadius: 10, border: `1px solid ${T.inputBorder}`, background: T.inputBg, color: T.inputColor, padding: 10, lineHeight: 1.4 }}
                  />
                  <button className="fpill" style={{ padding: '6px 10px', fontSize: 11, width: 'fit-content' }} onClick={() => shareReviewCard(item)}><Upload size={12}/>Share Review Card</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {avatarCropSrc && (
        <CropModal
          src={avatarCropSrc}
          cropTarget="avatar"
          theme={{ cardBg: T.surfaceBg, cardShadow: T.dropdownShadow, cardBorder: T.surfaceBorder, textPrimary: T.text, textDim: T.textMuted, accent: '#4a9ede', accent2: 'var(--theme-accent-alt)' }}
          onCancel={() => setAvatarCropSrc('')}
          onConfirm={(img) => {
            setProfile(p => ({ ...p, pfp: img }));
            setUploadedAvatars(a => [img, ...a.filter(x => x !== img)].slice(0, 24));
            setAvatarCropSrc('');
          }}
        />
      )}

      {/* ━━ STATUS DROPDOWN ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {statusDropdown !== null && (() => {
        const activeItem = items.find(i => i.id === statusDropdown);
        return (
          <>
            <div style={{ position: 'fixed', inset: 0, zIndex: 998 }} onClick={() => setStatusDropdown(null)} aria-hidden="true" />
            <div className="fade-in dropdown-pop" role="dialog" aria-label="Set watch status"
              style={{ position: 'fixed', top: dropdownPos.y, left: dropdownPos.x, background: darkMode ? 'rgba(13,18,34,0.96)' : 'rgba(255,255,255,0.97)', border: `1px solid color-mix(in srgb, var(--theme-accent) 38%, ${T.dropdownBorder})`, borderRadius: 11, padding: '9px', zIndex: 999, boxShadow: darkMode ? '0 18px 44px rgba(0,0,0,0.52)' : '0 18px 42px rgba(17,24,39,0.16)', minWidth: 235 }}>
              <div style={{ fontFamily: 'var(--font-marvel-ui)', fontSize: 10, letterSpacing: 2, color: T.textMuted, marginBottom: 7, paddingBottom: 7, borderBottom: `1px solid color-mix(in srgb, var(--theme-accent) 24%, ${T.surfaceBorder})`, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 215 }}>
                {activeItem?.title}
              </div>
              <button
                onClick={() => { setBookmarks(p => ({ ...p, [activeItem.id]: p[activeItem.id] ? 0 : 1 })); setStatusDropdown(null); }}
                style={{ display: 'flex', alignItems: 'center', gap: 9, width: '100%', padding: '7px 9px', border: `1px solid ${bookmarks[activeItem?.id] ? '#7dd3fc66' : 'transparent'}`, background: bookmarks[activeItem?.id] ? 'rgba(125,211,252,0.2)' : (darkMode ? 'rgba(255,255,255,0.045)' : 'rgba(17,24,39,0.045)'), color: bookmarks[activeItem?.id] ? '#7dd3fc' : T.text, borderRadius: 6, cursor: 'pointer', fontFamily: 'var(--font-marvel-display)', fontSize: 12.5, textAlign: 'left' }}
              >
                <Bookmark size={13} />
                {bookmarks[activeItem?.id] ? 'Remove bookmark' : 'Add bookmark'}
              </button>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {Object.entries(STATUS_META).map(([key, meta]) => {
                  const isCurrent = key === activeItem?.status;
                  return (
                    <button key={key}
                      autoFocus={isCurrent}
                      onClick={() => { setStatusDirect(activeItem.id, key); setStatusDropdown(null); }}
                      onKeyDown={e => { if (e.key === 'Escape') setStatusDropdown(null); }}
                      aria-pressed={isCurrent}
                      style={{ display: 'flex', alignItems: 'center', gap: 9, width: '100%', padding: '7px 9px', border: `1px solid ${isCurrent ? meta.color + 'aa' : (darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(17,24,39,0.09)')}`, background: isCurrent ? meta.color + '26' : (darkMode ? 'rgba(255,255,255,0.045)' : 'rgba(17,24,39,0.045)'), color: isCurrent ? meta.color : T.text, borderRadius: 6, cursor: 'pointer', fontFamily: 'var(--font-marvel-display)', fontSize: 12.5, fontWeight: isCurrent ? 600 : 400, letterSpacing: 0.4, textAlign: 'left', transition: 'all 0.13s' }}
                      onMouseEnter={e => { if (!isCurrent) { e.currentTarget.style.background = meta.color + '20'; e.currentTarget.style.color = meta.color; } }}
                      onMouseLeave={e => { if (!isCurrent) { e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.045)' : 'rgba(17,24,39,0.045)'; e.currentTarget.style.color = T.text; } }}
                    >
                      <meta.Icon size={13} />
                      {meta.label}
                      {isCurrent && <span style={{ marginLeft: 'auto', fontSize: 8.5, opacity: 0.5, fontFamily: 'var(--font-marvel-ui)', letterSpacing: 1 }}>CURRENT</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        );
      })()}
      <SpeedInsights />
    </div>
  );
}
