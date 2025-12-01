import React, { useState } from 'react';

const MUSIC_TYPE_POOLS = [
  ['Disco', 'Funk', 'Indie Rock'],
  ['Ambient', 'Lo-fi', 'Jazz'],
  ['Classical', 'Synthwave', 'Hip Hop'],
];

export default function MusicDirectionScreen({ onNext }) {
  const [poolIndex, setPoolIndex] = useState(0);
  const [selectedType, setSelectedType] = useState(null);

  const options = MUSIC_TYPE_POOLS[poolIndex];

  const handleChangeTypes = () => {
    const nextIndex = (poolIndex + 1) % MUSIC_TYPE_POOLS.length;
    setPoolIndex(nextIndex);
    setSelectedType(null);
  };

  const handleSelect = (label) => {
    setSelectedType(label);
  };

  return (
    <div className="screen-container" data-name="Music Direction">
      <header>
        <p className="screen-header-title">Possible music directions for your mood</p>
        <p className="screen-header-subtitle">
          Based on your mood, the AI suggests these directions. You decide which one feels right!
        </p>
      </header>

      <section className="music-types-row">
        {options.map((label) => {
          const isSelected = selectedType === label;
          return (
            <button
              key={label}
              type="button"
              className={`music-type-card${isSelected ? ' music-type-card--selected' : ''}`}
              onClick={() => handleSelect(label)}
            >
              <div className="music-type-placeholder" />
              <p className="music-type-label">{label}</p>
            </button>
          );
        })}
      </section>

      <section className="music-extra">
        <p className="music-extra-caption">Not matching what you want?</p>
        <button type="button" className="music-extra-button" onClick={handleChangeTypes}>
          <span className="music-extra-icon">⟳</span>
          <span>Give me other music types</span>
        </button>
      </section>

      <div className="mood-cta-row">
        <button
          type="button"
          className="cta-button"
          onClick={onNext}
          disabled={!selectedType}
        >
          Explore my music
        </button>
      </div>
    </div>
  );
}


