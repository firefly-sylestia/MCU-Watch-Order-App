import React from 'react';

const ThemeToggle = React.memo(function ThemeToggle({ mode, onToggle }) {
  return <button className="theme-toggle" onClick={onToggle} aria-label="Toggle theme">{mode === 'dark' ? '🌙' : '☀️'}</button>;
});

export default ThemeToggle;
