import React from 'react';

export default function DurationNum({ seconds = 0 }) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return (
    <div className="duration-num">
      <p className="duration-num-text">{formattedTime}</p>
    </div>
  );
}

