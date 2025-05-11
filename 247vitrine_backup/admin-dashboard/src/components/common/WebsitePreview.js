import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DeviceToolbar from './DeviceToolbar';
import { useDevice } from './DeviceContext';
import './Common.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

/**
 * Website-Vorschau-Komponente mit Geräte-Auswahl
 * @param {Object} props - Component props
 * @param {Object} props.website - Website-Daten für die Vorschau
 * @param {Function} props.onPublish - Funktion, die beim Klick auf den Veröffentlichen-Button aufgerufen wird
 * @param {boolean} props.showPublishButton - Ob der Veröffentlichen-Button angezeigt werden soll
 */
function WebsitePreview({ website, onPublish, showPublishButton = true }) {
  const [previewHtml, setPreviewHtml] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { deviceType, setDeviceType } = useDevice();

  // Generiere die Vorschau, wenn sich die Website-Daten ändern
  useEffect(() => {
    const generatePreview = async () => {
      if (!website || !website.content) return;

      try {
        setLoading(true);
        setError('');

        // Erstelle ein vollständiges Website-Objekt für die Vorschau
        const previewData = {
          content: website.content,
          layout: website.layout?._id || website.layout,
          design: website.design?._id || website.design,
          colorScheme: website.colorScheme?._id || website.colorScheme
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
  }, [website]);

  return (
    <div className="website-preview">
      <div className="website-preview-header">
        <div className="website-status-container">
          {website.isDemo && (
            <span className="demo-badge">Demo</span>
          )}
          {website.published && (
            <span className="published-badge">Veröffentlicht</span>
          )}
        </div>

        {showPublishButton && !website.published && (
          <div className="publish-button-container">
            <button
              className="publish-button"
              onClick={onPublish}
              disabled={website.isDemo}
              title={website.isDemo ? "Demo-Websites können nicht veröffentlicht werden" : ""}
            >
              Veröffentlichen
            </button>
          </div>
        )}
      </div>

      <div className={`website-preview-content preview-${deviceType}`}>
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

export default WebsitePreview;
