import React, { useCallback, useEffect, useRef, useState } from 'react';
import PlayBtn from '../components/PlayBtn.jsx';
import DurationBar from '../components/DurationBar.jsx';
import DurationNum from '../components/DurationNum.jsx';

const EMOTION_COLORS = {
  anxious: { inner: '#FFE0D9', outer: '#FFD0C4' },
  energetic: { inner: '#FFF1C7', outer: '#FFE08B' },
  neutral: { inner: '#F4F4F4', outer: '#E4E4E4' },
  down: { inner: '#E0E6FF', outer: '#C4D0FF' },
  relaxed: { inner: '#E2FFF0', outer: '#C6FFE0' },
};

function getEmotionFromCoords(nx, ny) {
  const distance = Math.sqrt(nx * nx + ny * ny);
  if (distance < 0.2) {
    return 'neutral';
  }
  if (nx < 0 && ny > 0) return 'anxious';
  if (nx > 0 && ny > 0) return 'energetic';
  if (nx < 0 && ny < 0) return 'down';
  return 'relaxed';
}

const EMOTION_LABELS = {
  anxious: 'Anxious',
  energetic: 'Energetic',
  neutral: 'Neutral',
  down: 'Down',
  relaxed: 'Relaxed',
};

function PlayerCard() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(120);
  const intervalRef = useRef(null);

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleSeek = (progress) => {
    const newTime = progress * duration;
    setCurrentTime(newTime);
  };

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, duration]);

  return (
    <div className="player-card">
      <div className="player-thumb" />
      <div className="player-main">
        <div className="player-text">
          <p className="player-title">Soft · Low energy · Early morning</p>
        </div>
        <div className="player-controls">
          <PlayBtn state={isPlaying ? 'pause' : 'play'} onClick={handlePlayPause} />
          <DurationBar currentTime={currentTime} duration={duration} onSeek={handleSeek} />
          <DurationNum seconds={currentTime} />
        </div>
      </div>
    </div>
  );
}

function SuccessModal({ onClose, onDownload, onRegenerate }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">Great! What would you like to do next?</h3>
        <div className="modal-actions">
          <button type="button" className="modal-button modal-button-primary" onClick={onDownload}>
            Download this music
          </button>
          <button type="button" className="modal-button modal-button-secondary" onClick={onRegenerate}>
            Generate another piece
          </button>
        </div>
      </div>
    </div>
  );
}

function CorrectionSavedModal({ onExplore }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">New mood mapping has been saved! 🎉 Click the button below to generate another piece of music</h3>
        <div className="modal-actions">
          <button type="button" className="modal-button modal-button-primary" onClick={onExplore}>
            Explore new music piece
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PlaybackFeedbackScreen({ onPositive, onNegative, onRegenerate }) {
  const [showModal, setShowModal] = useState(false);
  const [showCorrectionSavedModal, setShowCorrectionSavedModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [cursorPos, setCursorPos] = useState({ x: 0.5, y: 0.5 });
  const [hasDragged, setHasDragged] = useState(false);
  const [emotion, setEmotion] = useState('neutral');
  const boxRef = useRef(null);
  const isDraggingRef = useRef(false);

  const updateFromClientCoords = useCallback((clientX, clientY, markDragged = false) => {
    const rect = boxRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clampedX = Math.min(Math.max(clientX, rect.left), rect.right);
    const clampedY = Math.min(Math.max(clientY, rect.top), rect.bottom);

    const x = (clampedX - rect.left) / rect.width;
    const y = (clampedY - rect.top) / rect.height;

    const nx = x * 2 - 1;
    const ny = (y * 2 - 1) * -1;

    setCursorPos({ x, y });
    setEmotion(getEmotionFromCoords(nx, ny));
    if (markDragged) {
      setHasDragged(true);
    }
  }, []);

  useEffect(() => {
    if (selectedFeedback !== 'no') return;

    function handleMove(e) {
      if (!isDraggingRef.current) return;
      updateFromClientCoords(e.clientX, e.clientY, true);
    }
    function handleUp() {
      isDraggingRef.current = false;
    }
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
  }, [selectedFeedback, updateFromClientCoords]);

  const handleBoxPointerDown = (e) => {
    e.preventDefault();
    isDraggingRef.current = true;
    updateFromClientCoords(e.clientX, e.clientY, true);
  };

  const handlePositive = () => {
    setSelectedFeedback('yes');
    setShowModal(true);
  };

  const handleNegative = () => {
    setSelectedFeedback('no');
  };

  const handleDownload = () => {
    console.log('Download music');
    setShowModal(false);
  };

  const handleRegenerate = () => {
    console.log('Regenerate music');
    setShowModal(false);
    if (onRegenerate) {
      onRegenerate();
    }
  };

  const handleSaveCorrection = () => {
    const nx = cursorPos.x * 2 - 1;
    const ny = (cursorPos.y * 2 - 1) * -1;
    
    const savedData = {
      music: 'current_music_data',
      moodCoords: { x: nx, y: ny },
      emotion: emotion,
    };
    
    console.log('Saved correction:', savedData);
    
    setShowCorrectionSavedModal(true);
  };

  const handleExploreNewMusic = () => {
    setShowCorrectionSavedModal(false);
    if (onRegenerate) {
      onRegenerate();
    }
  };

  const emotionColors = EMOTION_COLORS[emotion];
  const emotionStyle = {
    background: `radial-gradient(circle at 50% 40%, ${emotionColors.inner}, ${emotionColors.outer})`,
  };

  return (
    <div className="screen-container" data-name="Playback Feedback">
      <header>
        <p className="screen-header-title">Does this sound like how you feel?</p>
      </header>

      <PlayerCard />

      <section className="feedback-section">
        <p className="feedback-caption">Give us feedback to help improve the algorithm.</p>
        <div className="feedback-buttons">
          <button
            type="button"
            className={`feedback-chip ${selectedFeedback === 'yes' ? 'feedback-chip-selected' : ''}`}
            onClick={handlePositive}
          >
            <span>👍</span>
            <span>Yes, it matches my mood</span>
          </button>
          <button
            type="button"
            className={`feedback-chip ${selectedFeedback === 'no' ? 'feedback-chip-selected' : ''}`}
            onClick={handleNegative}
          >
            <span>👎</span>
            <span>No, It feels a bit off.</span>
          </button>
        </div>
      </section>

      {selectedFeedback === 'no' && (
        <>
          <section className="correction-section">
            <p className="correction-title">Where would you place this sound instead?</p>
            <div className="correction-layout">
              <div className="mood-emotion-block">
                <div className="mood-emotion-indicator" style={emotionStyle}>
                  <div className="mood-emotion-face" />
                </div>
                <p className="mood-emotion-label">{EMOTION_LABELS[emotion]}</p>
              </div>
              <div className="mood-selector correction-selector">
                <div className="mood-axis-label mood-axis-label-top">HIGH ENERGY</div>
                <div className="mood-axis-label mood-axis-label-bottom">LOW ENERGY</div>
                <div className="mood-axis-label mood-axis-label-left">UNPLEASANT</div>
                <div className="mood-axis-label mood-axis-label-right">PLEASANT</div>
                <div
                  ref={boxRef}
                  className="mood-box"
                  onPointerDown={handleBoxPointerDown}
                  role="button"
                  tabIndex={0}
                >
                  <div className="mood-box-axis mood-box-axis-x" />
                  <div className="mood-box-axis mood-box-axis-y" />
                  <div
                    className="mood-cursor"
                    style={{
                      left: `${cursorPos.x * 100}%`,
                      top: `${cursorPos.y * 100}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                </div>
              </div>
            </div>
          </section>

          <div className="mood-cta-row">
            <button
              type="button"
              className="cta-button"
              disabled={!hasDragged}
              onClick={handleSaveCorrection}
            >
              Save this correction
            </button>
          </div>
        </>
      )}

      {showModal && (
        <SuccessModal
          onClose={() => setShowModal(false)}
          onDownload={handleDownload}
          onRegenerate={handleRegenerate}
        />
      )}

      {showCorrectionSavedModal && (
        <CorrectionSavedModal onExplore={handleExploreNewMusic} />
      )}
    </div>
  );
}