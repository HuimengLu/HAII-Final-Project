import React, { useEffect, useState } from 'react';

export default function GeneratingScreen({ onNext, onCancel }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 3000; // 3 seconds
    const interval = 16; // ~60fps
    const increment = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onNext();
          }, 100);
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onNext]);

  return (
    <div className="screen-container" data-name="Generating">
      <header>
        <p className="screen-header-title">Turning your mood into music...</p>
        <p className="screen-header-subtitle">
          Generating a sound based on your chosen mood and direction.
        </p>
      </header>

      <div className="generating-spinner" aria-hidden="true" />

      <div className="generating-progress-container">
        <div className="generating-progress-bar">
          <div
            className="generating-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="generating-actions">
        <button type="button" className="generating-cancel" onClick={onCancel}>
          Cancel music generation
        </button>
      </div>
    </div>
  );
}


