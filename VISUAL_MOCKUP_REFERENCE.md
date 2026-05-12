# MCU Viewing Order - Visual Mockup Reference

## App Screens Overview

### 1. **Home Dashboard**
```
┌─────────────────────────────────────┐
│  MCU Viewing Order        ⚙️  🌙     │  ← Header with settings & dark mode
├─────────────────────────────────────┤
│                                     │
│  Progress: 32/40 Movies    [80% ▮▮▮]│  ← Overall stats
│                                     │
│  Watched: 128.5 hours     ❤️ 8 Favs│
│                                     │
├─────────────────────────────────────┤
│ PHASE TIMELINE                      │
│ [🟨] [🟦] [🟩] [🟪] [🟥]           │  ← Interactive phase tabs
│ 2008  2010  2015  2018  2021        │
├─────────────────────────────────────┤
│ CONTINUE WATCHING                   │
│ ┌─────────────┐                    │
│ │  Iron Man   │ ← You left off...   │
│ │  [Poster]   │ 45 minutes ago      │
│ │ ⏯️ RESUME   │                    │
│ └─────────────┘                    │
├─────────────────────────────────────┤
│ PHASE 1: THE INFINITY SAGA          │
│                                     │
│ ┌──────────┐ ┌──────────┐           │
│ │  Iron   │ │ Captain  │           │
│ │  Man    │ │ America  │           │
│ │ ⬜❤️     │ │ ⬜❤️      │           │
│ └──────────┘ └──────────┘           │
│                                     │
│ ┌──────────┐ ┌──────────┐           │
│ │   Thor  │ │  Avengers│           │
│ │         │ │          │           │
│ │ ✅❤️     │ │ ✅❤️      │           │
│ └──────────┘ └──────────┘           │
└─────────────────────────────────────┘
  [Home] [Timeline] [Search] [Profile]
```

---

### 2. **Movie Detail Screen**
```
┌─────────────────────────────────────┐
│ ← Back          Iron Man    ⋯ Menu  │
├─────────────────────────────────────┤
│                                     │
│        [Movie Poster 16:9]          │  ← Large poster image
│        (1080x608px)                 │
│                                     │
├─────────────────────────────────────┤
│ Iron Man (2008)                     │
│ Phase 1 • Action, Adventure         │
│ Runtime: 2h 6m • Rating: PG-13      │
│                                     │
│ ★★★★★ 4.8 (2,345 ratings)          │
├─────────────────────────────────────┤
│ WATCH STATUS:                       │
│ ⬜ Not Watched    [Mark as Watched] │
│ ❤️ Add to Favorites [           ]  │
├─────────────────────────────────────┤
│ SYNOPSIS                            │
│ "Genius billionaire Tony Stark..."  │
│ More ▼                              │
├─────────────────────────────────────┤
│ CAST HIGHLIGHTS                     │
│ ┌─────┐ ┌─────┐ ┌─────┐            │
│ │ RDJ │ │ Gwyn│ │ Jeff│            │
│ │Tony │ │Pepper│ │Yinsen           │
│ └─────┘ └─────┘ └─────┘            │
├─────────────────────────────────────┤
│ WATCH OPTIONS                       │
│ [🎬 Disney+] [📺 Cable] [💿 Buy]  │
└─────────────────────────────────────┘
```

---

### 3. **Timeline View**
```
┌─────────────────────────────────────┐
│ Watch Timeline            📊        │
├─────────────────────────────────────┤
│                                     │
│ 📅 Today, March 20                  │
│    Iron Man (Phase 1)  ⏱️ 2h 6m    │
│    ⭐⭐⭐⭐⭐ Loved it              │
│                                     │
│ 📅 March 15                         │
│    Captain America  ⏱️ 2h 4m        │
│    ⭐⭐⭐⭐ Great                   │
│    🔗 Watched with Sarah           │
│                                     │
│ 📅 March 10                         │
│    Thor (Rewatch)  ⏱️ 1h 55m        │
│    ⭐⭐⭐⭐⭐                      │
│                                     │
│ 📅 March 5                          │
│    The Avengers  ⏱️ 2h 23m          │
│    ⭐⭐⭐⭐                        │
│    👥 Watched with 4 friends       │
│                                     │
│ See More ▼                          │
│                                     │
└─────────────────────────────────────┘
```

---

### 4. **Phase Detail Screen**
```
┌─────────────────────────────────────┐
│ ← Back  Phase 1: The Beginning  ✓   │
├─────────────────────────────────────┤
│                                     │
│ COMPLETION: [████████░░ 80%]       │
│ 16 of 20 movies watched            │
│                                     │
│ Total Runtime: 48.5 hours          │
│ Average Rating: 4.4★               │
│                                     │
│ Release Period: 2008 - 2010        │
│                                     │
├─────────────────────────────────────┤
│ MOVIES IN THIS PHASE                │
│                                     │
│ [✅] Iron Man (2008)   ⏱️ 2h 6m    │
│ [✅] The Incredible Hulk  ⏱️ 1h 52m│
│ [✅] Iron Man 2  ⏱️ 2h 4m           │
│ [✅] Thor  ⏱️ 1h 55m                │
│ [✅] Captain America  ⏱️ 2h 4m      │
│ [✅] The Avengers  ⏱️ 2h 23m        │
│                                     │
│ [⬜] (4 more not started)           │
│                                     │
│ [CONTINUE WATCHING]                 │
│                                     │
└─────────────────────────────────────┘
```

---

### 5. **Search & Filter Screen**
```
┌─────────────────────────────────────┐
│ 🔍 Search MCU                   ✓  │
├─────────────────────────────────────┤
│                                     │
│ FILTERS:                            │
│ ┌─────────────────────────────────┐│
│ │ Phase:  [All ▼]               │ │
│ │ Status: [All ▼]               │ │
│ │ Rating: [4+ ▼]                │ │
│ │ Sort:   [Release Date ▼]      │ │
│ │        [Apply Filters]         │ │
│ └─────────────────────────────────┘│
│                                     │
├─────────────────────────────────────┤
│ RESULTS (12 movies)                 │
│                                     │
│ ┌──────────┐ ┌──────────┐           │
│ │  Iron   │ │ Captain  │           │
│ │  Man    │ │ America  │           │
│ │ ⭐4.8   │ │ ⭐4.7   │           │
│ └──────────┘ └──────────┘           │
│                                     │
│ ┌──────────┐ ┌──────────┐           │
│ │   Thor  │ │  Avengers│           │
│ │ ⭐4.6   │ │ ⭐4.9   │           │
│ └──────────┘ └──────────┘           │
│                                     │
└─────────────────────────────────────┘
  [Home] [Timeline] [Search] [Profile]
```

---

### 6. **Profile & Statistics**
```
┌─────────────────────────────────────┐
│ Profile               Settings ⚙️   │
├─────────────────────────────────────┤
│                                     │
│      👤 MCU Superfan                │
│                                     │
│   Member since March 2024           │
│                                     │
├─────────────────────────────────────┤
│ YOUR STATS                          │
│                                     │
│ Movies Watched:     32/40   [80%]   │
│ Favorite Phase:     Phase 2         │
│ Total Hours:        124.5h          │
│ Avg Rating:         4.5★            │
│ Longest Streak:     15 days         │
│ Rewatches:          8               │
│                                     │
├─────────────────────────────────────┤
│ ACHIEVEMENTS 🏆                     │
│ ⭐ Phase Master (Complete Phase 1)  │
│ ⭐ Marathon Watcher (100+ hours)    │
│ ⭐ Critic (Rate 20+ movies)         │
│                                     │
├─────────────────────────────────────┤
│ PREFERENCES                         │
│ 🌙 Dark Mode           [Toggle On]  │
│ 📢 Notifications       [Toggle On]  │
│ 🔐 Privacy: Public    [Change]     │
│ 📤 Export Data        [Download]   │
│                                     │
│ [Logout]                            │
│                                     │
└─────────────────────────────────────┘
```

---

## Color Implementation Examples

### Header Component
```jsx
<header style={{
  background: 'linear-gradient(135deg, #0F1419 0%, #1A1F2E 100%)',
  borderBottom: '2px solid #D4AF37',
  padding: '16px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}}>
  <h1 style={{ color: '#D4AF37', fontSize: '24px', fontWeight: 700 }}>
    MCU Viewing Order
  </h1>
  <div style={{ display: 'flex', gap: '16px' }}>
    <button style={{ color: '#F5F5F5' }}>⚙️</button>
    <button style={{ color: '#F5F5F5' }}>🌙</button>
  </div>
</header>
```

### Movie Card Component
```jsx
<div style={{
  background: '#1A1F2E',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 8px 24px rgba(212, 175, 55, 0.15)',
  transition: 'transform 0.3s ease-out',
  cursor: 'pointer',
  ':hover': {
    transform: 'translateY(-8px)'
  }
}}>
  <img src={posterUrl} style={{ width: '100%', height: '240px' }} />
  <div style={{ padding: '16px' }}>
    <h3 style={{ color: '#F5F5F5', marginBottom: '8px' }}>{title}</h3>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ 
        background: '#D4AF37', 
        color: '#0F1419',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 600
      }}>
        {phase}
      </span>
      <span style={{ color: '#1E90FF' }}>⭐ {rating}</span>
    </div>
  </div>
</div>
```

### Progress Bar Component
```jsx
<div style={{
  background: '#1A1F2E',
  height: '8px',
  borderRadius: '4px',
  overflow: 'hidden',
  marginTop: '8px'
}}>
  <div style={{
    background: 'linear-gradient(90deg, #1E90FF 0%, #D4AF37 100%)',
    height: '100%',
    width: `${percentage}%`,
    transition: 'width 0.5s ease-out'
  }} />
</div>
```

---

## Animation Keyframes

### Card Entrance
```css
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.movie-card {
  animation: slideUp 0.3s ease-out;
}
```

### Completion Pulse
```css
@keyframes completionPulse {
  0% {
    boxShadow: 0 0 0 0 rgba(212, 175, 55, 0.7);
    transform: scale(1);
  }
  50% {
    boxShadow: 0 0 0 12px rgba(212, 175, 55, 0);
    transform: scale(1.05);
  }
  100% {
    boxShadow: 0 0 0 0 rgba(212, 175, 55, 0);
    transform: scale(1);
  }
}

.checkmark {
  animation: completionPulse 0.6s ease-out;
}
```

### Progress Fill
```css
@keyframes progressFill {
  from {
    backgroundPosition: 0% center;
  }
  to {
    backgroundPosition: 200% center;
  }
}

.progress-bar {
  backgroundImage: linear-gradient(
    90deg,
    #1E90FF,
    #D4AF37,
    #1E90FF
  );
  backgroundSize: 200% 100%;
  animation: progressFill 1.5s ease-in-out;
}
```

---

## Responsive Grid Layouts

### Mobile (320px - 640px)
```css
.movie-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 16px;
}

.phase-timeline {
  display: flex;
  overflow-x: auto;
  gap: 8px;
  padding: 16px;
}
```

### Tablet (641px - 1024px)
```css
.movie-grid {
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding: 24px;
}
```

### Desktop (1025px+)
```css
.movie-grid {
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  padding: 40px;
}

.layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 24px;
}
```

---

## Accessibility Features

### Focus States
```css
button:focus, a:focus {
  outline: 2px solid #D4AF37;
  outlineOffset: 4px;
}
```

### High Contrast Mode
```css
@media (prefers-contrast: more) {
  :root {
    --color-gold: #FFD700;
    --color-navy: #000000;
  }
}
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Dark Mode CSS Variables

```css
:root {
  --bg-primary: #F5F5F5;
  --bg-secondary: #1A1F2E;
  --text-primary: #0F1419;
  --text-secondary: #666666;
  --accent-gold: #D4AF37;
  --accent-blue: #1E90FF;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #0A0E17;
    --bg-secondary: #151B28;
    --text-primary: #E8E8E8;
    --text-secondary: #A0A0A0;
    --accent-gold: #E5C158;
    --accent-blue: #4FA3FF;
  }
}

/* Manual dark mode toggle */
[data-theme="dark"] {
  --bg-primary: #0A0E17;
  --bg-secondary: #151B28;
  /* ... */
}
```

This mockup reference provides a complete visual guide for implementing the enhanced MCU Viewing Order interface with consistent styling and professional polish.
