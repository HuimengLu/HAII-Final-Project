import React, { useState } from 'react';

const MUSIC_TYPE_IMAGES = {
  'Jazz': 'https://images.unsplash.com/photo-1634509507978-237c1dbc1505?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Indie Rock': 'https://images.unsplash.com/photo-1619378779232-d0fda1eb5681?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Disco': 'https://images.unsplash.com/photo-1517263904808-5dc91e3e7044?q=80&w=988&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Funk': 'https://images.unsplash.com/photo-1662553827284-51492068067a?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Rock': 'https://images.unsplash.com/photo-1534790021298-16d65d290461?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Lo-fi': 'https://blog.pond5.com/wp-content/uploads/sites/5/2023/10/lofi_Blog_header-1200x675.jpg',
  'Classical': 'https://s3-us-west-2.amazonaws.com/courses-images-archive-read-only/wp-content/uploads/sites/950/2015/09/26003250/15488964144_d835317370_o.jpg',
  'Synthwave': 'https://ichef.bbci.co.uk/images/ic/1920x1080/p06l219g.jpg',
  'Hip Hop': 'https://static.wixstatic.com/media/2a3794_9e55ce02399f410a858ea4a768519b64~mv2.jpg/v1/fill/w_568,h_568,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/2a3794_9e55ce02399f410a858ea4a768519b64~mv2.jpg',
  'Ambient': 'https://images.unsplash.com/photo-1634509507978-237c1dbc1505?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // 暂时使用 Jazz 的图片
};

const MUSIC_TYPE_POOLS = [
  ['Disco', 'Funk', 'Indie Rock'],
  ['Ambient', 'Lo-fi', 'Jazz'],
  ['Classical', 'Synthwave', 'Hip Hop'],
];

export default function MusicDirectionScreen({ onNext }) {
  const [poolIndex, setPoolIndex] = useState(0);
  const [selectedType, setSelectedType] = useState(null);
  const [hoveredType, setHoveredType] = useState(null);

  const options = MUSIC_TYPE_POOLS[poolIndex];

  const handleChangeTypes = () => {
    const nextIndex = (poolIndex + 1) % MUSIC_TYPE_POOLS.length;
    setPoolIndex(nextIndex);
    setSelectedType(null);
    setHoveredType(null);
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
          const isHovered = hoveredType === label;
          const shouldShowColor = isSelected || isHovered;
          const imageUrl = MUSIC_TYPE_IMAGES[label] || '';
          return (
            <button
              key={label}
              type="button"
              className={`music-type-card${isSelected ? ' music-type-card--selected' : ''}`}
              onClick={() => handleSelect(label)}
              onMouseEnter={() => setHoveredType(label)}
              onMouseLeave={() => setHoveredType(null)}
            >
              <div className="music-type-placeholder">
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt={label}
                    className="music-type-image"
                    style={{
                      filter: shouldShowColor ? 'none' : 'grayscale(100%)',
                      transition: 'filter 0.2s ease',
                    }}
                  />
                )}
              </div>
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


