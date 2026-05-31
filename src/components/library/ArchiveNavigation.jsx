import React from 'react';
import { Bookmark, Film, Layers, Search, Settings, SlidersH, Star, UserCircle } from '../../constants/icons.jsx';

const NAV = [
  ['home', 'Home', Film],
  ['library', 'Library', Layers],
  ['collections', 'Collections', Star],
  ['search', 'Search', Search],
  ['progress', 'Progress', Bookmark],
  ['settings', 'Settings', Settings],
];

export default function ArchiveNavigation({ activeView, onNavigate, onOpenSettings, onOpenMobileMenu, universe, profile, progress }) {
  const click = (id) => {
    if (id === 'settings') onOpenSettings?.();
    else onNavigate?.(id);
  };
  return (
    <>
      <aside className="archive-rail" aria-label="Archive navigation">
        <div className="archive-rail__brand">
          <span className="archive-rail__sigil">{universe === 'dc' ? 'DC' : 'MCU'}</span>
          <span><strong>Cinematic</strong><em>Library OS</em></span>
        </div>
        <nav className="archive-rail__nav">
          {NAV.map(([id, label, Icon]) => (
            <button key={id} type="button" className="archive-rail__item" data-active={activeView === id ? 'true' : 'false'} onClick={() => click(id)} aria-current={activeView === id ? 'page' : undefined}>
              <Icon size={18} /><span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="archive-rail__profile">
          {profile?.pfp ? <img src={profile.pfp} alt="" /> : <UserCircle size={28} />}
          <span><strong>{profile?.name || 'Library Keeper'}</strong><em>{progress}% complete</em></span>
        </div>
      </aside>
      <nav className="archive-dock" aria-label="Mobile archive navigation">
        {NAV.slice(0, 5).map(([id, label, Icon]) => (
          <button key={id} type="button" data-active={activeView === id ? 'true' : 'false'} onClick={() => click(id)} aria-label={label}>
            <Icon size={19} /><span>{label}</span>
          </button>
        ))}
        <button type="button" onClick={onOpenMobileMenu} aria-label="More actions"><SlidersH size={19} /><span>More</span></button>
      </nav>
    </>
  );
}
