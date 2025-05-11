import React from 'react';

const ColorSchemeSelector = ({ colorSchemes, selectedColorScheme, onSelect, onBack }) => {
  return (
    <div className="color-scheme-selector">
      <h2>Wählen Sie ein Farbschema</h2>
      <p className="selector-description">
        Das Farbschema bestimmt die Farben Ihrer Website.
      </p>
      
      <div className="color-schemes-grid">
        {colorSchemes.map(colorScheme => (
          <div 
            key={colorScheme._id} 
            className={`color-scheme-card ${selectedColorScheme === colorScheme._id ? 'selected' : ''}`}
            onClick={() => onSelect(colorScheme._id)}
          >
            <div className="color-scheme-preview">
              <div className="color-preview primary" style={{ backgroundColor: colorScheme.primary }}></div>
              <div className="color-preview secondary" style={{ backgroundColor: colorScheme.secondary }}></div>
              <div className="color-preview accent" style={{ backgroundColor: colorScheme.accent }}></div>
              <div className="color-preview text" style={{ backgroundColor: colorScheme.text }}></div>
              <div className="color-preview background" style={{ backgroundColor: colorScheme.background }}></div>
            </div>
            <div className="color-scheme-info">
              <h3>{colorScheme.name}</h3>
              <p>{colorScheme.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="selector-actions">
        <button className="btn btn-outline" onClick={onBack}>
          Zurück
        </button>
      </div>
    </div>
  );
};

export default ColorSchemeSelector;
