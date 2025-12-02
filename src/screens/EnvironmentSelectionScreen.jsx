import React, { useState } from 'react';

const ENVIRONMENTS = [
  {
    id: 'car',
    label: 'In the car',
    image: 'https://www.figma.com/api/mcp/asset/06b84b36-2e54-43ab-9c57-1b4ba0fb624f',
  },
  {
    id: 'morning',
    label: 'Early morning',
    image: 'https://www.figma.com/api/mcp/asset/2a57e99f-c142-477c-9421-a75290eef18b',
  },
  {
    id: 'night',
    label: 'Late night',
    image: 'https://www.figma.com/api/mcp/asset/374884bf-aceb-45e9-94e3-09cc9be3055d',
  },
  {
    id: 'coffee',
    label: 'Coffee shop',
    image: 'https://www.figma.com/api/mcp/asset/6ed1b32e-39ea-40df-b334-09c3a47343ac',
  },
  {
    id: 'work',
    label: 'Working/Studying',
    image: 'https://www.figma.com/api/mcp/asset/1556d87f-13f9-4dfb-883e-892e358a3b3e',
  },
  {
    id: 'room',
    label: 'Alone in my room',
    image: 'https://www.figma.com/api/mcp/asset/6141a572-d8af-41ca-959a-f90d07e09470',
  },
];

export default function EnvironmentSelectionScreen({ onNext }) {
  const [selectedId, setSelectedId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  const handleSelect = (id) => {
    setSelectedId(id);
  };

  return (
    <div className="screen-container" data-name="Environment Selection">
      <header>
        <p className="screen-header-title">In this mood, where are you right now?</p>
      </header>

      <section className="environment-options">
        {ENVIRONMENTS.map((env) => {
          const isSelected = selectedId === env.id;
          const isHovered = hoveredId === env.id;
          const shouldShowColor = isSelected || isHovered;

          return (
            <div
              key={env.id}
              className={`environment-option ${isSelected ? 'environment-option-selected' : ''}`}
              onClick={() => handleSelect(env.id)}
              onMouseEnter={() => setHoveredId(env.id)}
              onMouseLeave={() => setHoveredId(null)}
              role="button"
              tabIndex={0}
            >
              <div className="environment-image-wrapper">
                <img
                  src={env.image}
                  alt={env.label}
                  className="environment-image"
                  style={{
                    filter: shouldShowColor ? 'none' : 'grayscale(100%)',
                    transition: 'filter 0.2s ease',
                  }}
                />
              </div>
              <p className="environment-label">{env.label}</p>
            </div>
          );
        })}
      </section>

      <div className="mood-cta-row">
        <button
          type="button"
          className="cta-button"
          disabled={!selectedId}
          onClick={onNext}
        >
          Next
        </button>
      </div>
    </div>
  );
}

