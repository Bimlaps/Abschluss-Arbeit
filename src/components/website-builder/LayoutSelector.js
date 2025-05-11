import React from 'react';

const LayoutSelector = ({ layouts, selectedLayout, onSelect }) => {
  return (
    <div className="layout-selector">
      <h2>Wählen Sie ein Layout</h2>
      <p className="selector-description">
        Das Layout bestimmt die grundlegende Struktur Ihrer Website.
      </p>
      
      <div className="layouts-grid">
        {layouts.map(layout => (
          <div 
            key={layout._id} 
            className={`layout-card ${selectedLayout === layout._id ? 'selected' : ''}`}
            onClick={() => onSelect(layout._id)}
          >
            <div className="layout-thumbnail">
              <img src={layout.thumbnail} alt={layout.name} />
            </div>
            <div className="layout-info">
              <h3>{layout.name}</h3>
              <p>{layout.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LayoutSelector;
