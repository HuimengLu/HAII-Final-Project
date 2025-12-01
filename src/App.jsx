import React, { useState } from 'react';
import MoodSelectorScreen from './screens/MoodSelectorScreen.jsx';
import MusicDirectionScreen from './screens/MusicDirectionScreen.jsx';
import GeneratingScreen from './screens/GeneratingScreen.jsx';
import PlaybackScreen from './screens/PlaybackScreen.jsx';
import PlaybackFeedbackScreen from './screens/PlaybackFeedbackScreen.jsx';
import PlaybackCorrectionScreen from './screens/PlaybackCorrectionScreen.jsx';

const SCREENS = ['mood-selector', 'music-direction', 'generating', 'playback', 'playback-feedback', 'playback-correction'];

export default function App() {
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);

  const goNext = () => {
    setCurrentScreenIndex((prev) => Math.min(prev + 1, SCREENS.length - 1));
  };

  const goPrev = () => {
    setCurrentScreenIndex((prev) => Math.max(prev - 1, 0));
  };

  const currentId = SCREENS[currentScreenIndex];

  return (
    <div className="app-root">
      <div className="app-shell">
        {currentId === 'mood-selector' && <MoodSelectorScreen onNext={goNext} />}
        {currentId === 'music-direction' && <MusicDirectionScreen onNext={goNext} />}
        {currentId === 'generating' && <GeneratingScreen onNext={goNext} onCancel={goPrev} />}
        {currentId === 'playback' && <PlaybackScreen onNext={goNext} />}
        {currentId === 'playback-feedback' && (
          <PlaybackFeedbackScreen onPositive={() => {}} onNegative={goNext} />
        )}
        {currentId === 'playback-correction' && <PlaybackCorrectionScreen />}
      </div>
    </div>
  );
}


