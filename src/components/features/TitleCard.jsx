import React from 'react';
import './TitleCard.css';
export default function TitleCard({ children, className = '' }) {
  return <article className={`feature-title-card glass-surface ${className}`.trim()}>{children}</article>;
}
