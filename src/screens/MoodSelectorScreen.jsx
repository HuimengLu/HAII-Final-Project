import React, { useCallback, useEffect, useRef, useState } from 'react';

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
  if (nx < 0 && ny > 0) return 'anxious'; // 左上
  if (nx > 0 && ny > 0) return 'energetic'; // 右上
  if (nx < 0 && ny < 0) return 'down'; // 左下
  return 'relaxed'; // 右下
}

const EMOTION_LABELS = {
  anxious: 'Anxious',
  energetic: 'Energetic',
  neutral: 'Neutral',
  down: 'Down',
  relaxed: 'Relaxed',
};

export default function MoodSelectorScreen({ onNext }) {
  const [cursorPos, setCursorPos] = useState({ x: 0.5, y: 0.5 }); // 0–1 in box
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
  }, [updateFromClientCoords]);

  const handleBoxPointerDown = (e) => {
    e.preventDefault();
    isDraggingRef.current = true;
    updateFromClientCoords(e.clientX, e.clientY, true);
  };

  const emotionColors = EMOTION_COLORS[emotion];
  const emotionStyle = {
    background: `radial-gradient(circle at 50% 40%, ${emotionColors.inner}, ${emotionColors.outer})`,
  };

  return (
    <div className="screen-container" data-name="Mood Selector">
      <header>
        <p className="screen-header-title">How are you feeling?</p>
        <p className="screen-header-subtitle">
          Move the dot to describe your energy and emotional direction.
        </p>
      </header>

      <section className="mood-emotion-block">
        <div className="mood-emotion-indicator" style={emotionStyle}>
          <div className="mood-emotion-face" />
        </div>
        <p className="mood-emotion-label">{EMOTION_LABELS[emotion]}</p>
      </section>

      <section className="mood-selector">
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
      </section>

      <div className="mood-cta-row">
        <button
          type="button"
          className="cta-button"
          disabled={!hasDragged}
          onClick={onNext}
        >
          Next
        </button>
      </div>
    </div>
  );
}


