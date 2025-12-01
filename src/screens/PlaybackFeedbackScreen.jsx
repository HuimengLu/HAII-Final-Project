import React from 'react';

function PlayerCard() {
  return (
    <div className="player-card">
      <div className="player-thumb" />
      <div className="player-main">
        <div className="player-text">
          <p className="player-title">Song Title</p>
          <p className="player-subtitle">Short description</p>
        </div>
        <div className="player-controls">
          <button type="button" className="player-play">
            ▶
          </button>
          <div className="player-bar">
            <div className="player-bar-progress" />
          </div>
          <span className="player-time">00:00</span>
        </div>
      </div>
    </div>
  );
}

export default function PlaybackFeedbackScreen({ onPositive, onNegative }) {
  return (
    <div className="screen-container" data-name="Playback Feedback">
      <header>
        <p className="screen-header-title">Does this sound like how you feel?</p>
      </header>

      <PlayerCard />

      <section className="feedback-section">
        <p className="feedback-caption">Give us feedback to help improve the algorithm.</p>
        <div className="feedback-buttons">
          <button type="button" className="feedback-chip" onClick={onPositive}>
            <span>👍</span>
            <span>Yes, it matches my mood</span>
          </button>
          <button type="button" className="feedback-chip" onClick={onNegative}>
            <span>👎</span>
            <span>No, It feels a bit off.</span>
          </button>
        </div>
      </section>
    </div>
  );
}


