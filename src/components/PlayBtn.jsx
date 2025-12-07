import React, { useState } from 'react';

export default function PlayBtn({ state = 'play', onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  const getDisplayState = () => {
    if (isHovered) {
      return state === 'play' ? 'play-hover' : 'pause-hover';
    }
    return state;
  };

  const displayState = getDisplayState();

  return (
    <button
      type="button"
      className={`play-btn play-btn-${displayState}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={state === 'play' ? 'Play' : 'Pause'}
    >
      {displayState === 'play' || displayState === 'play-hover' ? (
        <svg
          width="38"
          height="38"
          viewBox="0 0 38 38"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="play-btn-icon"
        >
          <circle cx="19" cy="19" r="19" fill={displayState === 'play' ? '#FFFFFF' : '#4A4A4A'} />
          <path
            d="M14 11L14 27L26 19L14 11Z"
            fill={displayState === 'play' ? '#4A4A4A' : '#FFFFFF'}
          />
        </svg>
      ) : (
        <svg
          width="38"
          height="38"
          viewBox="0 0 38 38"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="play-btn-icon"
        >
          <circle cx="19" cy="19" r="19" fill={displayState === 'pause' ? '#FFFFFF' : '#4A4A4A'} />
          <rect x="13" y="13" width="4" height="12" fill={displayState === 'pause' ? '#4A4A4A' : '#FFFFFF'} />
          <rect x="21" y="13" width="4" height="12" fill={displayState === 'pause' ? '#4A4A4A' : '#FFFFFF'} />
        </svg>
      )}
    </button>
  );
}

