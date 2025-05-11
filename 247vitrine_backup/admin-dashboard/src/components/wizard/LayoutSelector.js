import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Wizard.css';

const API_URL = 'http://localhost:3001';

function LayoutSelector({ onSelect, selectedLayout: initialSelectedLayout }) {
  const [layouts, setLayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLayout, setSelectedLayout] = useState(initialSelectedLayout || null);

  useEffect(() => {
    // Wenn ein initialSelectedLayout übergeben wurde, setze es als ausgewähltes Layout
    if (initialSelectedLayout) {
      setSelectedLayout(initialSelectedLayout);
    }
  }, [initialSelectedLayout]);

  useEffect(() => {
    const fetchLayouts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/layouts`);
        setLayouts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching layouts:', error);
        setError('Fehler beim Laden der Layouts. Bitte versuche es später erneut.');
        setLoading(false);
      }
    };

    fetchLayouts();
  }, []);

  const handleLayoutClick = (layoutId) => {
    setSelectedLayout(layoutId);
  };

  const handleContinue = () => {
    if (selectedLayout) {
      onSelect(selectedLayout);
    }
  };

  if (loading) {
    return <div className="loading">Layouts werden geladen...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="layout-selector">
      <h2>Wähle ein Layout für deine Website</h2>
      <p>Das Layout bestimmt die grundlegende Struktur deiner Website.</p>
      
      <div className="layouts-grid">
        {layouts.map(layout => (
          <div 
            key={layout._id} 
            className={`layout-card ${selectedLayout === layout._id ? 'selected' : ''}`}
            onClick={() => handleLayoutClick(layout._id)}
          >
            <img src={layout.thumbnail} alt={layout.name} />
            <div className="layout-info">
              <h3>{layout.name}</h3>
              <p>{layout.description}</p>
            </div>
            {selectedLayout === layout._id && (
              <div className="selected-indicator">
                <span>✓</span>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="wizard-actions">
        <button 
          className="btn-primary" 
          onClick={handleContinue}
          disabled={!selectedLayout}
        >
          Weiter
        </button>
      </div>
    </div>
  );
}

export default LayoutSelector;