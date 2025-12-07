import React from 'react';

export default function DurationBar({ currentTime = 0, duration = 120, onSeek }) {
  const progress = duration > 0 ? Math.min(currentTime / duration, 1) : 0;

  const handleClick = (e) => {
    if (!onSeek) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newProgress = Math.max(0, Math.min(1, x / rect.width));
    onSeek(newProgress);
  };

  const progressPercent = progress * 100;

  return (
    <div className="duration-bar" onClick={handleClick}>
      <div 
        className="duration-bar-progress" 
        style={{ width: `${progressPercent}%` }}
      />
    </div>
  );
}

