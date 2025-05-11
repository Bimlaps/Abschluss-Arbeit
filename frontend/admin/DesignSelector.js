import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Wizard.css';

const API_URL = 'http://localhost:3001';

function DesignSelector({ layoutId, onSelect }) {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDesign, setSelectedDesign] = useState(null);

  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/designs/by-layout/${layoutId}`);
        setDesigns(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching designs:', error);
        setError('Fehler beim Laden der Designs. Bitte versuche es später erneut.');
        setLoading(false);
      }
    };

    if (layoutId) {
      fetchDesigns();
    }
  }, [layoutId]);

  const handleDesignClick = (designId) => {
    setSelectedDesign(designId);
  };

  const handleContinue = () => {
    if (selectedDesign) {
      onSelect(selectedDesign);
    }
  };

  if (loading) {
    return <div className="loading">Designs werden geladen...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (designs.length === 0) {
    return (
      <div className="no-designs">
        <p>Keine Designs für dieses Layout gefunden. Bitte wähle ein anderes Layout.</p>
        <button className="btn-secondary" onClick={() => window.history.back()}>Zurück</button>
      </div>
    );
  }

  return (
    <div className="design-selector">
      <h2>Wähle ein Design für deine Website</h2>
      <p>Das Design bestimmt das Aussehen und den Stil deiner Website.</p>
      
      <div className="designs-grid">
        {designs.map(design => (
          <div 
            key={design._id} 
            className={`design-card ${selectedDesign === design._id ? 'selected' : ''}`}
            onClick={() => handleDesignClick(design._id)}
          >
            <img src={design.thumbnail} alt={design.name} />
            <div className="design-info">
              <h3>{design.name}</h3>
              <p>{design.description}</p>
              <span className="category">{design.category}</span>
            </div>
            {selectedDesign === design._id && (
              <div className="selected-indicator">
                <span>✓</span>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="wizard-actions">
        <button className="btn-secondary" onClick={() => window.history.back()}>Zurück</button>
        <button 
          className="btn-primary" 
          onClick={handleContinue}
          disabled={!selectedDesign}
        >
          Weiter
        </button>
      </div>
    </div>
  );
}

export default DesignSelector;
