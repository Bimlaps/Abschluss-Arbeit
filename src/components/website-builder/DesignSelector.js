import React from 'react';

const DesignSelector = ({ designs, selectedDesign, onSelect, onBack }) => {
  return (
    <div className="design-selector">
      <h2>Wählen Sie ein Design</h2>
      <p className="selector-description">
        Das Design bestimmt das Aussehen und den Stil Ihrer Website.
      </p>
      
      <div className="designs-grid">
        {designs.map(design => (
          <div 
            key={design._id} 
            className={`design-card ${selectedDesign === design._id ? 'selected' : ''}`}
            onClick={() => onSelect(design._id)}
          >
            <div className="design-thumbnail">
              <img src={design.thumbnail} alt={design.name} />
            </div>
            <div className="design-info">
              <h3>{design.name}</h3>
              <p>{design.description}</p>
              <span className="design-category">{design.category}</span>
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

export default DesignSelector;
