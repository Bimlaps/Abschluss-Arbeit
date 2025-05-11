import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Wizard.css';
import DeviceSelector from '../common/DeviceSelector';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

/**
 * Live-Vorschau-Komponente für die Echtzeit-Anzeige der Website während der Bearbeitung
 * @param {Object} props - Component props
 * @param {Object} props.content - Website content
 * @param {Object} props.layout - Selected layout
 * @param {Object} props.design - Selected design
 * @param {Object} props.colorScheme - Selected color scheme
 */
function LivePreview({ content, layout, design, colorScheme }) {
  const [previewHtml, setPreviewHtml] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deviceType, setDeviceType] = useState('desktop');

  // Generiere die Vorschau, wenn sich der Inhalt ändert
  useEffect(() => {
    const generatePreview = async () => {
      if (!content) return;

      try {
        setLoading(true);
        setError('');

        // Erstelle ein vollständiges Website-Objekt für die Vorschau
        const previewData = {
          content,
          layout: layout?._id,
          design: design?._id,
          colorScheme: colorScheme?._id
        };

        // Sende die Daten an den Server für die Vorschau-Generierung
        const response = await axios.post(`${API_URL}/api/preview`, previewData);

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

    // Debounce-Funktion, um nicht bei jeder kleinen Änderung eine Anfrage zu senden
    const debounce = setTimeout(() => {
      generatePreview();
    }, 500);

    return () => clearTimeout(debounce);
  }, [content, layout, design, colorScheme]);

  // Gerätetyp-Klasse für die Vorschau
  const getDeviceClass = () => {
    switch (deviceType) {
      case 'mobile':
        return 'preview-mobile';
      case 'tablet':
        return 'preview-tablet';
      default:
        return 'preview-desktop';
    }
  };

  return (
    <div className="live-preview">
      <div className="preview-header">
        <h3>Echtzeit-Vorschau</h3>
        <DeviceSelector deviceType={deviceType} setDeviceType={setDeviceType} />
      </div>

      <div className={`preview-frame ${getDeviceClass()}`}>
        {loading ? (
          <div className="preview-loading">
            <p>Vorschau wird geladen...</p>
          </div>
        ) : error ? (
          <div className="preview-error">
            <p>{error}</p>
          </div>
        ) : (
          <iframe
            srcDoc={previewHtml}
            title="Website-Vorschau"
            className="preview-iframe"
            frameBorder="0"
          />
        )}
      </div>
    </div>
  );
}

export default LivePreview;
