import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Wizard.css';

const API_URL = 'http://localhost:3001';

function ColorSchemeSelector({ onSelect }) {
  const [colorSchemes, setColorSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedColorScheme, setSelectedColorScheme] = useState(null);

  useEffect(() => {
    const fetchColorSchemes = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/color-schemes`);
        setColorSchemes(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching color schemes:', error);
        setError('Fehler beim Laden der Farbschemata. Bitte versuche es später erneut.');
        setLoading(false);
      }
    };

    fetchColorSchemes();
  }, []);

  const handleColorSchemeClick = (colorSchemeId) => {
    setSelectedColorScheme(colorSchemeId);
  };

  const handleContinue = () => {
    if (selectedColorScheme) {
      onSelect(selectedColorScheme);
    }
  };

  if (loading) {
    return <div className="loading">Farbschemata werden geladen...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="color-scheme-selector">
      <h2>Wähle ein Farbschema für deine Website</h2>
      <p>Das Farbschema bestimmt die Farben deiner Website.</p>
      
      <div className="color-schemes-grid">
        {colorSchemes.map(scheme => (
          <div 
            key={scheme._id} 
            className={`color-scheme-card ${selectedColorScheme === scheme._id ? 'selected' : ''}`}
            onClick={() => handleColorSchemeClick(scheme._id)}
          >
            <div className="color-preview">
              <div className="color-sample primary" style={{ backgroundColor: scheme.primary }}></div>
              <div className="color-sample secondary" style={{ backgroundColor: scheme.secondary }}></div>
              <div className="color-sample accent" style={{ backgroundColor: scheme.accent }}></div>
            </div>
            <img src={scheme.thumbnail} alt={scheme.name} />
            <div className="color-scheme-info">
              <h3>{scheme.name}</h3>
              <p>{scheme.description}</p>
            </div>
            {selectedColorScheme === scheme._id && (
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
          disabled={!selectedColorScheme}
        >
          Weiter
        </button>
      </div>
    </div>
  );
}

export default ColorSchemeSelector;
