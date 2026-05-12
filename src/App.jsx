import React, { useState, useEffect, useRef, useMemo } from 'react';

// ─── Icon primitives ────────────────────────────────────────────────────────
const Icon = ({ children, size = 16, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    {children}
  </svg>
);
const Search    = p => <Icon {...p}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></Icon>;
const Eye       = p => <Icon {...p}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></Icon>;
const EyeOff    = p => <Icon {...p}><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></Icon>;
const Star      = p => <Icon {...p}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></Icon>;
const Film      = p => <Icon {...p}><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></Icon>;
const Tv        = p => <Icon {...p}><rect x="2" y="7" width="20" height="15" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></Icon>;
const Zap       = p => <Icon {...p}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></Icon>;
const ChevDown  = p => <Icon {...p}><polyline points="6 9 12 15 18 9"/></Icon>;
const ChevRight = p => <Icon {...p}><polyline points="9 18 15 12 9 6"/></Icon>;
const Check     = p => <Icon {...p}><polyline points="20 6 9 17 4 12"/></Icon>;
const Clock     = p => <Icon {...p}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></Icon>;
const Pause     = p => <Icon {...p}><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></Icon>;
const Trash2    = p => <Icon {...p}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></Icon>;
const Sun       = p => <Icon {...p}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></Icon>;
const Moon      = p => <Icon {...p}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></Icon>;
const Info      = p => <Icon {...p}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></Icon>;

// ─── Static data ────────────────────────────────────────────────────────────
const PHASES = [
  { id: 1, num: 1, name: 'Phase 1', color: '#e8b84b', glow: 'rgba(232,184,75,0.28)',  tagline: 'Assembling the Avengers',      summary: 'The birth of the MCU. Six heroes are introduced — Iron Man, Captain America, Thor, Hulk, Black Widow and Hawkeye — culminating in their first team-up against Loki and the Chitauri invasion of New York.' },
  { id: 2, num: 2, name: 'Phase 2', color: '#e05252', glow: 'rgba(224,82,82,0.28)',   tagline: 'Expanding the Universe',       summary: 'The Avengers go their separate ways but face escalating threats. HYDRA is exposed within SHIELD, the Guardians of the Galaxy are introduced, and Ultron nearly destroys humanity — setting the stage for a fractured alliance.' },
  { id: 3, num: 3, name: 'Phase 3', color: '#4a9ede', glow: 'rgba(74,158,222,0.28)',  tagline: 'The Infinity Saga Finale',     summary: 'The defining arc of the MCU. Civil War tears the Avengers apart, Thanos collects the Infinity Stones in Infinity War, and Endgame delivers the universe-spanning conclusion to 22 films.' },
  { id: 4, num: 4, name: 'Phase 4', color: '#a06cd5', glow: 'rgba(160,108,213,0.28)', tagline: 'The Multiverse Begins',         summary: 'Post-Endgame, the world is reeling. Disney+ series deepen character stories, the multiverse cracks open in No Way Home and Multiverse of Madness, and an entirely new roster of heroes emerges.' },
  { id: 5, num: 5, name: 'Phase 5', color: '#3ec47a', glow: 'rgba(62,196,122,0.28)',  tagline: 'The Multiverse Saga Escalates', summary: 'Kang the Conqueror emerges as the central threat across the multiverse. New heroes like Ms. Marvel, the Marvels and Ironheart push the MCU forward while legacy characters continue their arcs.' },
  { id: 6, num: 6, name: 'Phase 6', color: '#25c4a0', glow: 'rgba(37,196,160,0.28)',  tagline: 'A New Age Begins',              summary: 'The Multiverse Saga reaches its climax with Avengers: Doomsday and Secret Wars. The Fantastic Four join the MCU, and entirely new stories reshape the Marvel universe going forward.' },
];

const TYPE_META = {
  film:   { label: 'Film',   Icon: Film, color: '#e8b84b' },
  series: { label: 'Series', Icon: Tv,   color: '#4a9ede' },
  short:  { label: 'Short',  Icon: Zap,  color: '#a06cd5' },
};

const STATUS_META = {
  watched:        { label: 'Watched',        color: '#3ec47a', Icon: Check,  bg: 'rgba(62,196,122,0.1)'  },
  'plan-to-watch':{ label: 'Plan to Watch',  color: '#4a9ede', Icon: Clock,  bg: 'rgba(74,158,222,0.1)'  },
  watching:       { label: 'Watching',       color: '#e8b84b', Icon: Eye,    bg: 'rgba(232,184,75,0.1)'  },
  'on-hold':      { label: 'On Hold',        color: '#f39c12', Icon: Pause,  bg: 'rgba(243,156,18,0.1)'  },
  dropped:        { label: 'Dropped',        color: '#e05252', Icon: Trash2, bg: 'rgba(224,82,82,0.1)'   },
  unwatched:      { label: 'Unwatched',      color: '#334455', Icon: EyeOff, bg: 'transparent'           },
};

const NO_PREREQ = new Set([
  'None','None (standalone)','None (mostly standalone)',
  'None (multiverse)','None (intro to FF)','None (supernatural entry)',
  'None (prequel to Homecoming)','General MCU knowledge',
  'None (new arc starts)','None (alternate reality)',
  'None (alternate reality, optional)','None (separate continuity)',
]);

const SORT_LABELS = { order: 'Chronological', year: 'By Year', title: 'Alphabetical' };

const ESSENTIAL_LIST = [
  { id: 1,  order: 1,  phase: 1, type: 'film',   year: 2011, essential: true,  episodes: null, title: "Captain America: The First Avenger", prereq: "None", desc: "Steve Rogers, a scrawny kid from Brooklyn, is transformed into a super-soldier to fight HYDRA and the villainous Red Skull during World War II. Sets the entire MCU in motion." },
  { id: 2,  order: 2,  phase: 1, type: 'film',   year: 2008, essential: true,  episodes: null, title: "Iron Man", prereq: "None", desc: "Billionaire weapons manufacturer Tony Stark builds a powered suit of armor to escape captivity, then becomes Iron Man to fight evil — and discovers a far greater conspiracy." },
];

const ADDITIONAL_LIST = [
  { id: 101, order: 101, phase: 1, type: 'short',  year: 2013, essential: false, episodes: 1,  title: "Agent Carter (One-Shot)", prereq: "CATFA", desc: "A short film following Peggy Carter one year after WWII, proving her worth to SSR colleagues who underestimate her." },
];

const RAW = [...ESSENTIAL_LIST, ...ADDITIONAL_LIST].map(d => ({ ...d, status: 'unwatched', watchedDate: null }));

const LIST_MODES = [
  { id: 'core',     label: 'MCU',      sublabel: 'Curated List',       color: '#c0392b', desc: '60 curated films & series'           },
  { id: 'extended', label: 'Extended', sublabel: 'Full Chronological', color: '#4a9ede', desc: 'All entries incl. Netflix, SHIELD & more' },
];

export default function MCUViewer() {
  const [items,          setItems]          = useState(RAW);
  const [listMode,       setListMode]       = useState('core');
  const [search,         setSearch]         = useState('');
  const [sortBy,         setSortBy]         = useState('order');
  const [essentialOnly,  setEssOnly]        = useState(false);
  const [watchedOnly,    setWatchedOnly]    = useState(false);
  const [statusFilter,   setStatusFilter]   = useState(null);
  const [typeFilter,     setTypeFilter]     = useState(null);
  const [activePhase,    setActivePhase]    = useState(1);
  const [sortOpen,       setSortOpen]       = useState(false);
  const [statusDropdown, setStatusDropdown] = useState(null);
  const [dropdownPos,    setDropdownPos]    = useState({ x: 0, y: 0 });
  const [darkMode,       setDarkMode]       = useState(true);
  const [expandedItem,   setExpandedItem]   = useState(null);
  const [expandedPhase,  setExpandedPhase]  = useState(null);
  const [celebPhase,     setCelebPhase]     = useState(null);
  const [editingDateId,  setEditingDateId]  = useState(null);
  
  const phaseRefs  = useRef({});
  const sortRef    = useRef(null);
  const obsRef     = useRef(null);
  const isScrolling= useRef(false);
  const mainRef    = useRef(null);

  useEffect(() => {
    const s = localStorage.getItem('mcu-v7');
    if (s) {
      try {
        const saved = JSON.parse(s);
        setItems(prev => prev.map(i => ({
          ...i,
          status: saved[i.id]?.status || 'unwatched',
          watchedDate: saved[i.id]?.watchedDate || null
        })));
      } catch {}
    }
  }, []);

  const persist = (next) => {
    const data = {};
    next.forEach(i => {
      if (i.status !== 'unwatched' || i.watchedDate) {
        data[i.id] = { status: i.status, watchedDate: i.watchedDate };
      }
    });
    localStorage.setItem('mcu-v7', JSON.stringify(data));
  };

  const setStatusDirect = (id, newStatus) => {
    setItems(prev => {
      const n = prev.map(i => {
        if (i.id !== id) return i;
        const updated = { ...i, status: newStatus };
        if (newStatus === 'watched' && !i.watchedDate) {
          updated.watchedDate = new Date().toISOString().slice(0, 16);
        } else if (newStatus !== 'watched') {
          updated.watchedDate = null;
        }
        return updated;
      });
      const item = n.find(i => i.id === id);
      if (newStatus === 'watched' && item) {
        const phaseItems = n.filter(i => i.phase === item.phase && (listMode === 'core' ? coreIds.has(i.id) : true));
        const allDone = phaseItems.every(i => i.status === 'watched');
        if (allDone) {
          setCelebPhase(item.phase);
          setTimeout(() => setCelebPhase(null), 2400);
        }
      }
      persist(n);
      return n;
    });
  };

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const onScroll = () => {
      isScrolling.current = true;
      clearTimeout(isScrolling._t);
      isScrolling._t = setTimeout(() => { isScrolling.current = false; }, 150);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const root = mainRef.current;
    if (!root) return;
    obsRef.current?.disconnect();
    obsRef.current = new IntersectionObserver(entries => {
      let best = null, bestTop = Infinity;
      entries.forEach(e => {
        const top = e.boundingClientRect.top;
        if (e.isIntersecting && top >= 0 && top < bestTop) {
          bestTop = top;
          best = +e.target.dataset.phase;
        }
      });
      if (best !== null) setActivePhase(best);
    }, { root, rootMargin: '0px 0px -70% 0px', threshold: 0 });

    const timer = setTimeout(() => {
      Object.values(phaseRefs.current).forEach(el => el && obsRef.current?.observe(el));
    }, 50);
    return () => { clearTimeout(timer); obsRef.current?.disconnect(); };
  }, [listMode, essentialOnly]);

  useEffect(() => {
    const fn = e => { if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const scrollTo = id => {
    const el = phaseRefs.current[id];
    const container = mainRef.current;
    if (!el || !container) return;
    const containerTop = container.getBoundingClientRect().top;
    const elTop = el.getBoundingClientRect().top;
    const offset = elTop - containerTop + container.scrollTop - 16;
    container.scrollTo({ top: offset, behavior: 'smooth' });
  };

  const coreIds = useMemo(() => new Set(ESSENTIAL_LIST.map(i => i.id)), []);

  const markPhaseWatched = (phaseId, newStatus) => {
    setItems(prev => {
      const n = prev.map(i => {
        if (i.phase !== phaseId) return i;
        if (listMode === 'core' && !coreIds.has(i.id)) return i;
        const updated = { ...i, status: newStatus };
        if (newStatus === 'watched' && !i.watchedDate) {
          updated.watchedDate = new Date().toISOString().slice(0, 16);
        } else if (newStatus !== 'watched') {
          updated.watchedDate = null;
        }
        return updated;
      });
      persist(n);
      return n;
    });
  };

  const q = search.toLowerCase();
  const { filtered, grouped, phaseKeys } = useMemo(() => {
    const f = items.filter(i => {
      if (listMode === 'core' && !coreIds.has(i.id)) return false;
      if (listMode === 'core' && essentialOnly && !i.essential) return false;
      if (watchedOnly && i.status !== 'watched') return false;
      if (statusFilter && i.status !== statusFilter) return false;
      if (typeFilter && i.type !== typeFilter) return false;
      return i.title.toLowerCase().includes(q) || i.prereq.toLowerCase().includes(q);
    }).sort((a, b) =>
      sortBy === 'title' ? a.title.localeCompare(b.title) :
      sortBy === 'year'  ? a.year - b.year : a.order - b.order
    );
    const g = {};
    f.forEach(i => (g[i.phase] = g[i.phase] || []).push(i));
    const pk = Object.keys(g).map(Number).sort((a, b) => a - b);
    return { filtered: f, grouped: g, phaseKeys: pk };
  }, [items, listMode, essentialOnly, watchedOnly, statusFilter, typeFilter, q, sortBy, coreIds]);

  const activeItems = useMemo(
    () => listMode === 'core' ? items.filter(i => coreIds.has(i.id)) : items,
    [items, listMode, coreIds]
  );
  
  const totalWatched = useMemo(() => activeItems.filter(i => i.status === 'watched').length, [activeItems]);
  const essTotal     = useMemo(() => activeItems.filter(i => i.essential).length, [activeItems]);
  const essWatched   = useMemo(() => activeItems.filter(i => i.essential && i.status === 'watched').length, [activeItems]);
  const pct = activeItems.length ? Math.round((totalWatched / activeItems.length) * 100) : 0;

  const openStatusDropdown = (e, itemId) => {
    if (isScrolling.current) return;
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const dropW = 240, dropH = 280;
    let x = rect.left - dropW + rect.width;
    let y = rect.top - dropH - 8;
    if (x < 8) x = 8;
    if (x + dropW > window.innerWidth - 8) x = window.innerWidth - dropW - 8;
    if (y < 8) y = rect.bottom + 8;
    setDropdownPos({ x, y });
    setStatusDropdown(prev => prev === itemId ? null : itemId);
  };

  const T = darkMode ? {
    appBg: '#06060f', headerBg: 'linear-gradient(180deg,#0d0d1e 0%,#06060f 100%)',
    headerBorder: '#13132a', navBg: '#08081a', navBorder: '#13132a',
    filterBg: '#07071a', filterBorder: '#10101f',
    surfaceBg: '#0b0b1c', surfaceBorder: '#12122a',
    rowHoverBg: 'rgba(255,255,255,0.025)', rowWatchedBg: '#080814',
    rowBorder: '#0e0e1e', expandBg: '#090916', expandBorder: '#14142a',
    pillBg: '#0d0d1e', pillBorder: '#1a1a2e', pillText: '#6a7a90',
    pillHoverBorder: '#252540', pillHoverText: '#c5d0e8',
    inputBg: '#0b0b1d', inputBorder: '#171730', inputColor: '#c5d0e8',
    dropdownBg: '#0d0d1e', dropdownBorder: '#1e1e36', dropdownShadow: '0 24px 64px rgba(0,0,0,0.95)',
    text: '#c8d4e8', textMuted: '#556070', textFaint: '#2a3344',
    sortHoverBg: '#0f0f22', statBg: '#0b0b1c', statBorder: '#131328',
    numFaint: '#4a5566', footerText: '#1e2a38',
    scrollTrack: '#07070f', scrollThumb: '#16162a', scrollThumbH: '#222238',
    hexDot: 'rgba(255,255,255,0.01)', switcherBg: '#080818', switcherBorder: '#13132a',
    phaseSummaryBg: '#08081c', phaseSummaryBorder: '#13132a',
    accentHoverBorder: '#c0392b'
  } : {
    appBg: '#f2f0eb', headerBg: 'linear-gradient(180deg,#ffffff 0%,#f2f0eb 100%)',
    headerBorder: '#ddd8d0', navBg: '#ffffff', navBorder: '#e8e2d8',
    filterBg: '#faf8f4', filterBorder: '#e4ddd4',
    surfaceBg: '#ffffff', surfaceBorder: '#e0dbd2',
    rowHoverBg: 'rgba(0,0,0,0.025)', rowWatchedBg: '#f7f5f0',
    rowBorder: '#ede8e0', expandBg: '#faf7f2', expandBorder: '#e4ddd4',
    pillBg: '#f0ece4', pillBorder: '#ddd8cf', pillText: '#6a7080',
    pillHoverBorder: '#c8c2b8', pillHoverText: '#1a2030',
    inputBg: '#ffffff', inputBorder: '#ddd8cf', inputColor: '#1a2030',
    dropdownBg: '#ffffff', dropdownBorder: '#ddd8cf', dropdownShadow: '0 24px 64px rgba(0,0,0,0.16)',
    text: '#1a2030', textMuted: '#8090a0', textFaint: '#c0bcb4',
    sortHoverBg: '#f5f2ec', statBg: '#ffffff', statBorder: '#e4ddd4',
    numFaint: '#a0a8b0', footerText: '#a0a8b0',
    scrollTrack: '#ece8e0', scrollThumb: '#ccc8c0', scrollThumbH: '#b8b4ac',
    hexDot: 'rgba(0,0,0,0.025)', switcherBg: '#f8f5f0', switcherBorder: '#e4ddd4',
    phaseSummaryBg: '#f5f2ec', phaseSummaryBorder: '#e4ddd4',
    accentHoverBorder: '#c0392b'
  };

  return (
    <div style={{ width: '100%', height: '100dvh', background: T.appBg, color: T.text, fontFamily: "'Rajdhani',system-ui,sans-serif", display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'background 0.32s cubic-bezier(0.34,1.56,0.64,1), color 0.32s cubic-bezier(0.34,1.56,0.64,1)' }} className="theme-switch">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body{scroll-behavior:smooth}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:${T.scrollTrack}}
        ::-webkit-scrollbar-thumb{background:${T.scrollThumb};border-radius:4px}
        ::-webkit-scrollbar-thumb:hover{background:${T.scrollThumbH}}
        input,button,select{font-family:inherit}
        input:focus{outline:none}
        button:focus-visible{outline:2px solid #c0392b;outline-offset:2px}

        @keyframes sweep{0%{transform:translateX(-120%)}100%{transform:translateX(220%)}}
        .sweep::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.22),transparent);animation:sweep 2.8s ease-in-out infinite}

        @keyframes phaseFlash{0%{opacity:0}20%{opacity:0.22}80%{opacity:0.18}100%{opacity:0}}
        .phase-flash{animation:phaseFlash 2.4s ease both}

        @keyframes rowIn{from{opacity:0;transform:translateX(-5px)}to{opacity:1;transform:translateX(0)}}
        .row-in{animation:rowIn 0.2s ease both}

        @keyframes sectionUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .section-up{animation:sectionUp 0.32s ease both}

        @keyframes fadeIn{from{opacity:0;transform:scale(0.97) translateY(-4px)}to{opacity:1;transform:scale(1) translateY(0)}}
        .fade-in{animation:fadeIn 0.16s ease both}

        @keyframes expandDown{from{opacity:0;max-height:0;padding-top:0;padding-bottom:0}to{opacity:1;max-height:600px;padding-top:10px;padding-bottom:10px}}
        .expand-row{animation:expandDown 0.28s cubic-bezier(0.34,1.56,0.64,1) both;overflow:hidden}

        @keyframes themeFadeSwitch{from{opacity:0}to{opacity:1}}
        .theme-switch{animation:themeFadeSwitch 0.32s ease both}

        @keyframes buttonPulse{0%{box-shadow:0 0 0 0 rgba(192,57,43,0.4)}70%{box-shadow:0 0 0 6px rgba(192,57,43,0)}100%{box-shadow:0 0 0 0 rgba(192,57,43,0)}}
        
        .wbtn{width:30px;height:30px;border-radius:50%;border:1.5px solid transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform 0.16s cubic-bezier(0.34,1.56,0.64,1),box-shadow 0.18s,background 0.18s;flex-shrink:0}
        .wbtn:hover{transform:scale(1.12)}
        .wbtn:active{transform:scale(0.88);animation:buttonPulse 0.4s}

        /* Adjusted length-to-width ratio per strict styling commands */
        .fpill{display:flex;align-items:center;gap:6px;padding:8px 32px;border-radius:999px;border:1.5px solid ${T.pillBorder};background:${T.pillBg};cursor:pointer;font-size:clamp(14px,2.2vw,16px);font-weight:600;letter-spacing:0.05em;color:${T.pillText};transition:all 0.2s cubic-bezier(0.34,1.56,0.64,1);white-space:nowrap}
        .fpill:hover{border-color:${T.pillHoverBorder};color:${T.pillHoverText};transform:translateY(-2px);box-shadow:0 6px 16px rgba(0,0,0,0.2)}

        .sopt{padding:13px 20px;font-family:'Bebas Neue',sans-serif;font-size:clamp(15px,2.2vw,18px);letter-spacing:2.5px;cursor:pointer;color:${T.pillText};transition:all 0.2s cubic-bezier(0.34,1.56,0.64,1)}
        .sopt:hover{background:${T.sortHoverBg};color:${T.text};transform:translateX(4px)}
        .sopt.picked{color:#c0392b;font-weight:700}

        /* 3-Column Standardized Grid Layout + Visual Feedback Border */
        .rrow{position:relative;transition:background 0.13s,border-left-color 0.15s,transform 0.15s cubic-bezier(0.34,1.56,0.64,1);display:grid;align-items:center;grid-template-columns:40px 1fr 80px 40px;gap:14px;padding:14px 18px;border-bottom:1px solid ${T.rowBorder};border-left:3px solid transparent;min-height:68px}
        .rrow:last-child{border-bottom:none}
        .rrow:hover{background:${T.rowHoverBg} !important;border-left-color:${T.accentHoverBorder};transform:translateX(2px)}

        .title-btn{background:none;border:none;cursor:pointer;text-align:left;padding:0;color:inherit;font-family:inherit;display:block;width:100%}
        .title-btn:focus-visible{outline:2px solid #c0392b;outline-offset:2px;border-radius:3px}

        .hexbg{background-image:radial-gradient(circle,${T.hexDot} 1px,transparent 1px);background-size:28px 28px}

        .lmode-btn{display:flex;flex-direction:column;padding:12px 22px 10px;border:none;background:transparent;cursor:pointer;text-align:left;transition:all 0.2s;border-bottom:2px solid transparent}
        .lmode-btn.active{border-bottom-color:var(--mc)}
        .lmode-btn:hover:not(.active){background:${T.rowHoverBg}}

        .theme-btn{width:32px;height:32px;border-radius:50%;border:1px solid ${T.pillBorder};background:${T.pillBg};color:${T.pillText};cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s;flex-shrink:0}
        .theme-btn:hover{border-color:${T.pillHoverBorder};color:${T.pillHoverText};transform:rotate(22deg)}

        /* Sticky Nav Restyling for Contrast & Alignment */
        .phase-sticky{
          position:sticky;top:0;z-index:90;
          display:flex;align-items:center;gap:8px;
          overflow-x:auto;padding:10px 24px;
          background:${darkMode ? 'rgba(7,7,18,0.9)' : 'rgba(248,246,242,0.92)'};
          backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);
          border-bottom:1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)'};
          scrollbar-width:thin;scrollbar-color:rgba(192,57,43,0.3) transparent;
        }
        .phase-sticky::-webkit-scrollbar{height:4px}
        .phase-sticky::-webkit-scrollbar-track{background:transparent}
        .phase-sticky::-webkit-scrollbar-thumb{background:rgba(192,57,43,0.3);border-radius:2px}
        
        .ph-pill{
          display:flex;flex-direction:column;align-items:center;gap:1px;
          padding:6px 12px;border:none;flex-shrink:0;
          background:transparent;cursor:pointer;
          transition:all 0.16s;
          font-family:'Bebas Neue',sans-serif;
          position:relative;
          color:${darkMode ? '#94a3b8' : '#64748b'}; /* Improved Contrast */
          border-bottom: 2px solid transparent;
        }
        .ph-pill:hover{background:${darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}}
        .ph-pill.active{border-bottom-color: #c0392b; color: ${darkMode ? '#ffffff' : '#000000'}; font-weight: 700;}

        /* Hide default scrollbar on main while keeping functionality */
        main::-webkit-scrollbar{width:4px}
        main::-webkit-scrollbar-track{background:transparent}
        main::-webkit-scrollbar-thumb{background:${T.scrollThumb};border-radius:4px}
        main::-webkit-scrollbar-thumb:hover{background:${T.scrollThumbH}}
      `}</style>

      {/* ━━ HEADER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <header className="hexbg" style={{ background: T.headerBg, borderBottom: `1px solid ${T.headerBorder}`, flexShrink: 0 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 24px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 6 }}>
            {/* Title */}
            <div style={{ fontFamily: "'Orbitron',sans-serif", lineHeight: 0.88, marginBottom: 0, fontWeight: 900 }}>
              <div style={{ fontSize: 'clamp(56px, 10vw, 120px)', letterSpacing: 'clamp(2px, 1vw, 8px)', color: '#c0392b', textShadow: darkMode ? '0 0 44px rgba(192,57,43,0.5),0 2px 0 #7a0000' : '0 2px 8px rgba(192,57,43,0.2)' }}>MCU</div>
              <div style={{ fontSize: 'clamp(32px, 5vw, 72px)', letterSpacing: 'clamp(4px, 1.5vw, 12px)', color: T.text, marginTop: 0 }}>VIEWING ORDER</div>
              <div style={{ fontSize: 'clamp(13px, 2.4vw, 18px)', color: T.textMuted, letterSpacing: 3, fontFamily: "'Bebas Neue',sans-serif", marginTop: 1 }}>
                PHASES 1–6 &nbsp;·&nbsp; {activeItems.length} ENTRIES &nbsp;·&nbsp; {LIST_MODES.find(m => m.id === listMode)?.sublabel.toUpperCase()}
              </div>
            </div>
            {/* Consolidated Status Dashboard */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: T.statBg, border: `1px solid ${T.statBorder}`, borderRadius: 12, padding: '16px 24px', minWidth: 160, boxShadow: darkMode ? 'inset 0 1px 0 rgba(255,255,255,0.04)' : 'none' }}>
              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(40px, 6vw, 64px)', letterSpacing: 1, color: '#3ec47a', lineHeight: 1, textShadow: darkMode ? `0 0 16px rgba(62,196,122,0.35)` : 'none' }}>
                {totalWatched}<span style={{ fontSize: 'clamp(20px, 3vw, 32px)', color: T.numFaint }}>/{activeItems.length}</span>
              </div>
              <div style={{ fontSize: 'clamp(12px, 2vw, 16px)', letterSpacing: 2, color: T.textMuted, marginTop: 4, fontFamily: "'Bebas Neue',sans-serif" }}>TOTAL WATCHED</div>
              <div style={{ marginTop: 10, padding: '4px 16px', borderRadius: 999, background: '#e8b84b1a', border: '1px solid #e8b84b88', color: '#e8b84b', fontSize: 'clamp(11px, 1.8vw, 13px)', fontFamily: "'Bebas Neue',sans-serif", letterSpacing: 1.5 }}>
                {essWatched} / {essTotal} MUST-WATCH
              </div>
            </div>
          </div>
          {/* Master progress bar */}
          <div style={{ background: T.surfaceBg, border: `1px solid ${T.surfaceBorder}`, borderRadius: 999, height: 5, overflow: 'hidden', position: 'relative', marginBottom: 2 }}>
            <div className="sweep" style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,#7a0000 0%,#c0392b 38%,#e85252 72%,#3ec47a 100%)', borderRadius: 999, transition: 'width 0.7s cubic-bezier(.4,0,.2,1)', position: 'relative', overflow: 'hidden' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'clamp(12px, 2vw, 16px)', color: T.textMuted, letterSpacing: 2, fontFamily: "'Bebas Neue',sans-serif" }}>
            <span>{pct}% COMPLETE</span>
            <span>{activeItems.length - totalWatched} REMAINING</span>
          </div>
        </div>
      </header>

      {/* ━━ LIST MODE SWITCHER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div style={{ background: T.switcherBg, borderBottom: `1px solid ${T.switcherBorder}`, flexShrink: 0 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', padding: '0 24px' }}>
          {LIST_MODES.map(mode => {
            const isActive = listMode === mode.id;
            const modeItems = mode.id === 'core' ? items.filter(i => coreIds.has(i.id)) : items;
            const modeWatched = modeItems.filter(i => i.status === 'watched').length;
            const modePct = modeItems.length ? Math.round((modeWatched / modeItems.length) * 100) : 0;
            return (
              <button key={mode.id} className={`lmode-btn ${isActive ? 'active' : ''}`}
                style={{ '--mc': mode.color }}
                onClick={() => { setListMode(mode.id); setSearch(''); setEssOnly(false); setTypeFilter(null); setStatusFilter(null); setWatchedOnly(false); setSortBy('order'); setActivePhase(1); setExpandedItem(null); setExpandedPhase(null); }}
                aria-pressed={isActive}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 15, letterSpacing: 3, color: isActive ? mode.color : T.textMuted, transition: 'color 0.2s' }}>
                    {mode.label}
                  </span>
                  <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 10, letterSpacing: 1.5, color: isActive ? mode.color + 'bb' : T.textFaint, transition: 'color 0.2s' }}>
                    {modeItems.length}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 1 }}>
                  <span style={{ fontSize: 10, color: isActive ? T.textMuted : T.textFaint, letterSpacing: 0.4, fontFamily: "'Rajdhani',sans-serif", transition: 'color 0.2s' }}>{mode.desc}</span>
                  {modePct > 0 && <span style={{ fontSize: 9, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: 1, color: modePct === 100 ? mode.color : T.textFaint }}>· {modePct}%</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ━━ FILTER BAR ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div style={{ background: T.filterBg, borderBottom: `1px solid ${T.filterBorder}`, overflowX: 'auto', flexShrink: 0 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', padding: '8px 24px' }}>
          <div style={{ position: 'relative', flex: '1 1 170px', minWidth: 130 }}>
            <Search size={12} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: T.textMuted }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search titles..."
              style={{ width: '100%', background: T.inputBg, border: `1px solid ${T.inputBorder}`, borderRadius: 999, padding: '5px 11px 5px 26px', color: T.inputColor, fontSize: 11, letterSpacing: 0.3 }} />
          </div>
          <div ref={sortRef} style={{ position: 'relative' }} onMouseEnter={() => setSortOpen(true)} onMouseLeave={() => setSortOpen(false)}>
            <button className="fpill" onClick={() => setSortOpen(o => !o)}
              style={{ color: '#c0392b', borderColor: darkMode ? '#1e1430' : '#f0d8d0', background: darkMode ? '#0d0818' : '#fff5f3', fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(14px, 2.2vw, 16px)', letterSpacing: 2 }}>
              {SORT_LABELS[sortBy]}
              <ChevDown size={12} style={{ opacity: 0.6, transform: sortOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>
            {sortOpen && (
              <div className="fade-in" style={{ position: 'fixed', background: T.dropdownBg, border: `1px solid ${T.dropdownBorder}`, borderRadius: 9, overflow: 'hidden', zIndex: 200, boxShadow: T.dropdownShadow, minWidth: 200 }}>
                {Object.entries(SORT_LABELS).map(([k, v]) => (
                  <div key={k} className={`sopt ${sortBy === k ? 'picked' : ''}`} onClick={() => { setSortBy(k); setSortOpen(false); }}>{v}</div>
                ))}
              </div>
            )}
          </div>
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
          {listMode === 'core' && (
            <button className="fpill"
              style={essentialOnly ? { borderColor: '#e8b84b88', background: '#e8b84b14', color: '#e8b84b' } : {}}
              onClick={() => setEssOnly(o => !o)}>
              <Star size={10} />Must-Watch
            </button>
          )}
          <button className="fpill"
            style={watchedOnly ? { borderColor: '#3ec47a88', background: '#3ec47a14', color: '#3ec47a' } : {}}
            onClick={() => setWatchedOnly(o => !o)}>
            <Check size={10} />Watched
          </button>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 10.5, color: T.textMuted, letterSpacing: 2 }}>
              {filtered.length} RESULTS
            </span>
            <button className="theme-btn" onClick={() => setDarkMode(d => !d)} title={darkMode ? 'Light Mode' : 'Dark Mode'} aria-label="Toggle theme">
              {darkMode ? <Sun size={13} /> : <Moon size={13} />}
            </button>
          </div>
        </div>
      </div>

      {/* ━━ CONTENT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <main ref={mainRef} style={{ overflowY: 'auto', overflowX: 'hidden', flex: 1, WebkitOverflowScrolling: 'touch' }}>
        
        {/* Central Alignment Wrapper */}
        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          
          {/* ━━ STICKY PHASE NAV ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <nav aria-label="Phase navigation" className="phase-sticky">
            {PHASES.map(ph => {
              const phItems = items.filter(i =>
                i.phase === ph.id &&
                (listMode === 'core' ? coreIds.has(i.id) : true) &&
                (listMode === 'core' && essentialOnly ? i.essential : true)
              );
              const phPct = phItems.length ? Math.round((phItems.filter(i => i.status === 'watched').length / phItems.length) * 100) : 0;
              const isOn = activePhase === ph.id;
              
              return (
                <button
                  key={ph.id}
                  className={`ph-pill ${isOn ? 'active' : ''}`}
                  onClick={() => scrollTo(ph.id)}
                  aria-label={`${ph.name} — ${phPct}% watched`}
                >
                  <span style={{ fontSize: 'clamp(11px, 1.8vw, 13px)', letterSpacing: 2 }}>
                    {ph.name}
                  </span>
                  <span style={{ fontSize: 'clamp(9px, 1.4vw, 10px)', letterSpacing: 0.3, color: phPct === 100 ? ph.color : (isOn ? 'inherit' : T.textFaint), lineHeight: 1 }}>
                    {phPct === 100 ? '✓ DONE' : `${phPct}%`}
                  </span>
                </button>
              );
            })}
          </nav>

          <div style={{ padding: '24px 24px 80px', width: '100%', minHeight: 'calc(100% - 400px)' }} className="list-mode-switch" key={listMode}>
            {phaseKeys.length === 0 && (
              <div style={{ textAlign: 'center', padding: '80px 0', fontFamily: "'Bebas Neue',sans-serif", fontSize: 19, color: T.textMuted, letterSpacing: 4 }}>
                NO RESULTS — ADJUST YOUR FILTERS
              </div>
            )}

            {phaseKeys.map(pid => {
              const ph = PHASES.find(p => p.id === pid);
              const rows = grouped[pid];
              const done = rows.filter(r => r.status === 'watched').length;
              const phasePct = rows.length ? Math.round((done / rows.length) * 100) : 0;
              const isCelebrating = celebPhase === pid;
              const summaryOpen = expandedPhase === pid;

              return (
                <section key={pid} className="section-up" data-phase={pid} ref={el => { phaseRefs.current[pid] = el; }} style={{ marginBottom: 36, scrollMarginTop: 64, position: 'relative' }}>
                  
                  {isCelebrating && (
                    <div className="phase-flash" style={{ position: 'absolute', inset: 0, background: ph.color, borderRadius: 12, pointerEvents: 'none', zIndex: 5 }} />
                  )}

                  {/* Enhanced Section Divider */}
                  <div style={{ background: T.surfaceBg, border: `1px solid ${T.surfaceBorder}`, padding: '16px 24px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, flexWrap: 'wrap', boxShadow: darkMode ? '0 4px 12px rgba(0,0,0,0.2)' : '0 2px 6px rgba(0,0,0,0.03)' }}>
                    <div style={{ width: 4, height: 44, background: ph.color, borderRadius: 2, flexShrink: 0, boxShadow: darkMode ? `0 0 12px ${ph.glow}` : 'none' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 'clamp(24px, 3.6vw, 36px)', letterSpacing: 6, color: ph.color, lineHeight: 1, fontWeight: 700, textShadow: darkMode ? `0 0 18px ${ph.glow}` : 'none' }}>
                        Phase {ph.num}
                      </div>
                      <div style={{ fontSize: 'clamp(11px, 2vw, 14px)', color: T.textMuted, letterSpacing: 3, fontFamily: "'Bebas Neue',sans-serif", marginTop: 2, textTransform: 'uppercase' }}>
                        {ph.tagline}
                      </div>
                    </div>
                    {/* Integrated Phase Progress */}
                    <div style={{ flex: 1, minWidth: 200, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Bebas Neue',sans-serif", fontSize: 13, letterSpacing: 1.5, color: phasePct === 100 ? ph.color : T.textMuted }}>
                        <span>PROGRESS</span>
                        <span>{done} / {rows.length}</span>
                      </div>
                      <div style={{ width: '100%', background: T.filterBg, border: `1px solid ${T.filterBorder}`, borderRadius: 999, height: 4, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${phasePct}%`, background: ph.color, borderRadius: 999, transition: 'width 0.5s ease', opacity: darkMode ? 0.85 : 0.9 }} />
                      </div>
                    </div>
                    {/* Action Controls */}
                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                      <button onClick={() => setExpandedPhase(summaryOpen ? null : pid)}
                        aria-label={summaryOpen ? 'Hide phase summary' : 'Show phase summary'}
                        style={{ background: summaryOpen ? ph.color + '16' : 'transparent', border: `1px solid ${summaryOpen ? ph.color + '66' : T.surfaceBorder}`, color: summaryOpen ? ph.color : T.textMuted, borderRadius: 6, padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: 1.5, transition: 'all 0.18s' }}>
                        <Info size={13} />INFO
                      </button>
                      {done < rows.length ? (
                        <button onClick={() => markPhaseWatched(pid, 'watched')}
                          style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 11, letterSpacing: 1.5, color: ph.color, background: 'transparent', border: `1px solid ${ph.color}44`, borderRadius: 6, padding: '6px 12px', cursor: 'pointer', transition: 'all 0.16s' }}
                          onMouseEnter={e => { e.currentTarget.style.background = ph.color + '16'; e.currentTarget.style.borderColor = ph.color + '88'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = ph.color + '44'; }}>
                          MARK ALL
                        </button>
                      ) : (
                        <button onClick={() => markPhaseWatched(pid, 'unwatched')}
                          style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 11, letterSpacing: 1.5, color: T.textMuted, background: 'transparent', border: `1px solid ${T.surfaceBorder}`, borderRadius: 6, padding: '6px 12px', cursor: 'pointer', transition: 'all 0.16s' }}
                          onMouseEnter={e => { e.currentTarget.style.background = T.rowHoverBg; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                          CLEAR
                        </button>
                      )}
                    </div>
                  </div>

                  {summaryOpen && (
                    <div className="fade-in" style={{ background: T.phaseSummaryBg, border: `1px solid ${T.phaseSummaryBorder}`, borderLeft: `3px solid ${ph.color}`, borderRadius: '0 8px 8px 0', padding: '14px 18px', marginBottom: 16, fontSize: 13.5, color: T.textMuted, lineHeight: 1.6, fontFamily: "'Rajdhani',sans-serif", letterSpacing: 0.2 }}>
                      {ph.summary}
                    </div>
                  )}

                  {/* List Items Wrapper */}
                  <div style={{ background: T.surfaceBg, border: `1px solid ${T.surfaceBorder}`, borderRadius: 10, overflow: 'hidden', boxShadow: darkMode ? '0 2px 20px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.03)' : '0 1px 6px rgba(0,0,0,0.06)' }}>
                    {rows.map((item, idx) => {
                      const m = TYPE_META[item.type];
                      const statusMeta = STATUS_META[item.status];
                      const showPre = !NO_PREREQ.has(item.prereq);
                      const isWatched = item.status === 'watched';
                      const isExpanded = expandedItem === item.id;

                      return (
                        <div key={item.id}>
                          {/* 3-Column Grid Row */}
                          <div className="rrow row-in" style={{ background: isWatched ? T.rowWatchedBg : 'transparent' }}>
                            
                            {/* ID Column */}
                            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 15, color: isWatched ? ph.color : T.textMuted, transition: 'color 0.26s', textAlign: 'center' }}>
                              {isWatched ? <Check size={14} style={{ color: ph.color, margin: '0 auto' }} /> : (idx + 1)}
                            </div>

                            {/* Title Column */}
                            <button className="title-btn" onClick={() => setExpandedItem(isExpanded ? null : item.id)}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                                <span style={{ fontSize: 'clamp(15px, 2.4vw, 20px)', fontWeight: isWatched ? 400 : 600, lineHeight: 1.5, color: isWatched ? T.textMuted : T.text, textDecoration: isWatched ? 'line-through' : 'none', textDecorationColor: T.textFaint, transition: 'color 0.26s', fontFamily: "'Rajdhani',sans-serif" }}>
                                  {item.title}
                                </span>
                                {item.episodes && (
                                  <span style={{ fontSize: 9, color: T.textMuted, background: T.expandBg, border: `1px solid ${T.expandBorder}`, borderRadius: 3, padding: '1px 5px', fontFamily: "'Bebas Neue',sans-serif", letterSpacing: 1, flexShrink: 0 }}>
                                    {item.episodes} EP
                                  </span>
                                )}
                                <span style={{ fontSize: 9, color: m.color, opacity: 0.75, fontWeight: 700, letterSpacing: 0.6, display: 'flex', alignItems: 'center', gap: 2, fontFamily: "'Bebas Neue',sans-serif", flexShrink: 0 }}>
                                  <m.Icon size={8} />{m.label}
                                </span>
                                {!item.essential && (
                                  <span style={{ fontSize: 8.5, color: T.textMuted, background: T.expandBg, border: `1px solid ${T.expandBorder}`, borderRadius: 3, padding: '1px 4px', letterSpacing: 1, fontFamily: "'Bebas Neue',sans-serif", flexShrink: 0 }}>OPT</span>
                                )}
                                <ChevRight size={12} style={{ color: T.textFaint, transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0, marginLeft: 'auto' }} />
                              </div>
                            </button>

                            {/* Year/Prereq Column */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(13px, 2vw, 15px)', letterSpacing: 2, color: T.text, textAlign: 'center', fontWeight: 600 }}>
                                {item.year}
                              </div>
                              {showPre && (
                                <div style={{ fontSize: 'clamp(9px, 1.2vw, 10px)', color: T.textMuted, fontFamily: "'Rajdhani',sans-serif", letterSpacing: 0.3, textAlign: 'center', maxWidth: 80, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }} title={`Needs: ${item.prereq}`}>
                                  {item.prereq}
                                </div>
                              )}
                            </div>

                            {/* Status Button Column */}
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                              <button className="wbtn"
                                aria-label={`${statusMeta.label} — click to change`}
                                aria-haspopup="true"
                                aria-expanded={statusDropdown === item.id}
                                onClick={e => openStatusDropdown(e, item.id)}
                                onContextMenu={e => e.preventDefault()}
                                onKeyDown={e => {
                                  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openStatusDropdown(e, item.id); }
                                  if (e.key === 'Escape') setStatusDropdown(null);
                                }}
                                style={{ background: statusMeta.bg, color: statusMeta.color, borderColor: statusMeta.color + '55', boxShadow: item.status !== 'unwatched' && darkMode ? `0 0 9px ${statusMeta.color}35` : 'none' }}
                              >
                                <statusMeta.Icon size={12} />
                              </button>
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="expand-row" style={{ background: T.expandBg, borderBottom: `1px solid ${T.expandBorder}`, borderLeft: `3px solid ${ph.color}44`, padding: '14px 16px 14px 54px' }}>
                              <p style={{ fontSize: 'clamp(13px, 2.2vw, 16px)', color: T.textMuted, lineHeight: 1.7, fontFamily: "'Rajdhani',sans-serif", letterSpacing: 0.3, marginBottom: 12 }}>
                                {item.desc}
                              </p>
                              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                <button
                                  onClick={() => setStatusDirect(item.id, 'watched')}
                                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 6, border: `1px solid ${item.status === 'watched' ? '#3ec47a88' : T.expandBorder}`, background: item.status === 'watched' ? '#3ec47a18' : 'transparent', color: item.status === 'watched' ? '#3ec47a' : T.textMuted, cursor: 'pointer', fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(12px, 2vw, 14px)', letterSpacing: 1.5, transition: 'all 0.15s' }}
                                  onMouseEnter={e => { if (item.status !== 'watched') { e.currentTarget.style.background = '#3ec47a12'; e.currentTarget.style.color = '#3ec47a'; } }}
                                  onMouseLeave={e => { if (item.status !== 'watched') { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = T.textMuted; } }}
                                >
                                  <Check size={11} />WATCHED
                                </button>
                                <button
                                  onClick={() => setStatusDirect(item.id, 'plan-to-watch')}
                                  style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 6, border: `1px solid ${item.status === 'plan-to-watch' ? '#4a9ede88' : T.expandBorder}`, background: item.status === 'plan-to-watch' ? '#4a9ede18' : 'transparent', color: item.status === 'plan-to-watch' ? '#4a9ede' : T.textMuted, cursor: 'pointer', fontFamily: "'Bebas Neue',sans-serif", fontSize: 11, letterSpacing: 1.5, transition: 'all 0.15s' }}
                                  onMouseEnter={e => { if (item.status !== 'plan-to-watch') { e.currentTarget.style.background = '#4a9ede12'; e.currentTarget.style.color = '#4a9ede'; } }}
                                  onMouseLeave={e => { if (item.status !== 'plan-to-watch') { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = T.textMuted; } }}
                                >
                                  <Clock size={11} />PLAN TO WATCH
                                </button>
                                <button
                                  onClick={() => setStatusDirect(item.id, 'unwatched')}
                                  style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 6, border: `1px solid ${item.status === 'unwatched' ? '#55667788' : T.expandBorder}`, background: item.status === 'unwatched' ? '#55667718' : 'transparent', color: item.status === 'unwatched' ? '#8899aa' : T.textMuted, cursor: 'pointer', fontFamily: "'Bebas Neue',sans-serif", fontSize: 11, letterSpacing: 1.5, transition: 'all 0.15s' }}
                                  onMouseEnter={e => { if (item.status !== 'unwatched') { e.currentTarget.style.background = '#55667710'; e.currentTarget.style.color = '#8899aa'; } }}
                                  onMouseLeave={e => { if (item.status !== 'unwatched') { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = T.textMuted; } }}
                                >
                                  <EyeOff size={11} />UNWATCH
                                </button>
                              </div>
                              {item.status === 'watched' && item.watchedDate && (
                                <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${T.surfaceBorder}`, display: 'flex', alignItems: 'center', gap: 8 }}>
                                  <span style={{ fontSize: 10, color: T.textMuted, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: 1 }}>WATCHED:</span>
                                  {editingDateId === item.id ? (
                                    <input
                                      type="datetime-local"
                                      value={item.watchedDate}
                                      onChange={e => {
                                        setItems(prev => prev.map(i => i.id === item.id ? { ...i, watchedDate: e.target.value } : i));
                                      }}
                                      onBlur={() => {
                                        setEditingDateId(null);
                                        persist(items);
                                      }}
                                      autoFocus
                                      style={{ padding: '4px 6px', borderRadius: 4, border: `1px solid #c0392b66`, background: T.inputBg, color: T.inputColor, fontSize: 11, fontFamily: "'Rajdhani',sans-serif" }}
                                    />
                                  ) : (
                                    <button
                                      onClick={() => setEditingDateId(item.id)}
                                      style={{ fontSize: 'clamp(11px, 1.8vw, 13px)', color: '#3ec47a', background: 'transparent', border: `1px solid #3ec47a44`, borderRadius: 4, padding: '4px 8px', cursor: 'pointer', fontFamily: "'Rajdhani',sans-serif", transition: 'all 0.15s' }}
                                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#3ec47a88'; e.currentTarget.style.background = '#3ec47a08'; }}
                                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#3ec47a44'; e.currentTarget.style.background = 'transparent'; }}
                                    >
                                      {item.watchedDate ? new Date(item.watchedDate + ':00').toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Mark watched'}
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
            <div style={{ textAlign: 'center', marginTop: 44, fontFamily: "'Bebas Neue',sans-serif", fontSize: 9, color: T.footerText, letterSpacing: 3.5 }}>
              MCU VIEWING ORDER &nbsp;·&nbsp; PHASES 1–6 &nbsp;·&nbsp; PROGRESS SAVED LOCALLY
            </div>
          </div>
        </div>
      </main>

      {/* ━━ STATUS DROPDOWN ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {statusDropdown !== null && (() => {
        const activeItem = items.find(i => i.id === statusDropdown);
        return (
          <>
            <div style={{ position: 'fixed', inset: 0, zIndex: 998 }} onClick={() => setStatusDropdown(null)} aria-hidden="true" />
            <div className="fade-in" role="dialog" aria-label="Set watch status"
              style={{ position: 'fixed', top: dropdownPos.y, left: dropdownPos.x, background: T.dropdownBg, border: `1px solid ${T.dropdownBorder}`, borderRadius: 11, padding: '9px', zIndex: 999, boxShadow: T.dropdownShadow, minWidth: 235 }}>
              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 10, letterSpacing: 2, color: T.textMuted, marginBottom: 7, paddingBottom: 7, borderBottom: `1px solid ${T.surfaceBorder}`, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 215 }}>
                {activeItem?.title}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {Object.entries(STATUS_META).map(([key, meta]) => {
                  const isCurrent = key === activeItem?.status;
                  return (
                    <button key={key}
                      autoFocus={isCurrent}
                      onClick={() => { setStatusDirect(activeItem.id, key); setStatusDropdown(null); }}
                      onKeyDown={e => { if (e.key === 'Escape') setStatusDropdown(null); }}
                      aria-pressed={isCurrent}
                      style={{ display: 'flex', alignItems: 'center', gap: 9, width: '100%', padding: '7px 9px', border: `1px solid ${isCurrent ? meta.color + '77' : 'transparent'}`, background: isCurrent ? meta.color + '15' : 'transparent', color: isCurrent ? meta.color : T.pillText, borderRadius: 6, cursor: 'pointer', fontFamily: "'Rajdhani',sans-serif", fontSize: 12.5, fontWeight: isCurrent ? 600 : 400, letterSpacing: 0.4, textAlign: 'left', transition: 'all 0.13s' }}
                      onMouseEnter={e => { if (!isCurrent) { e.currentTarget.style.background = meta.color + '10'; e.currentTarget.style.color = meta.color; } }}
                      onMouseLeave={e => { if (!isCurrent) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = T.pillText; } }}
                    >
                      <meta.Icon size={13} />
                      {meta.label}
                      {isCurrent && <span style={{ marginLeft: 'auto', fontSize: 8.5, opacity: 0.5, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: 1 }}>CURRENT</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        );
      })()}
    </div>
  );
}
