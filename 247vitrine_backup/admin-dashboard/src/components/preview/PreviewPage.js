import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../wizard/Wizard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

/**
 * Vorschau-Seite für mobile Geräte
 */
function PreviewPage() {
  const [previewHtml, setPreviewHtml] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchPreview = async () => {
      try {
        // Hole die aktuelle Website aus dem localStorage
        const websiteData = JSON.parse(localStorage.getItem('currentWebsite') || '{}');
        
        if (!websiteData.content) {
          setError('Keine Vorschau-Daten gefunden. Bitte kehre zum Editor zurück.');
          setLoading(false);
          return;
        }
        
        // Sende die Daten an den Server für die Vorschau-Generierung
        const response = await axios.post(`${API_URL}/api/preview`, {
          content: websiteData.content,
          layout: websiteData.layout?._id,
          design: websiteData.design?._id,
          colorScheme: websiteData.colorScheme?._id
        });
        
        if (response.data.html) {
          setPreviewHtml(response.data.html);
        } else {
          setError('Fehler bei der Generierung der Vorschau.');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error generating preview:', error);
        setError('Fehler bei der Generierung der Vorschau. Bitte versuche es später erneut.');
        setLoading(false);
      }
    };
    
    fetchPreview();
  }, []);
  
  return (
    <div className="preview-page">
      <div className="preview-header">
        <button 
          className="btn-secondary"
          onClick={() => navigate(-1)}
        >
          Zurück zum Editor
        </button>
        <h2>Website-Vorschau</h2>
      </div>
      
      <div className="preview-container">
        {loading ? (
          <div className="loading">
            <p>Vorschau wird geladen...</p>
          </div>
        ) : error ? (
          <div className="error">
            <p>{error}</p>
          </div>
        ) : (
          <iframe 
            srcDoc={previewHtml}
            title="Website-Vorschau"
            className="preview-iframe-fullpage"
            frameBorder="0"
          />
        )}
      </div>
    </div>
  );
}

export default PreviewPage;
