import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import TouchFriendlyButton from '../common/TouchFriendlyButton';
import './Preview.css';

function Preview() {
  const [website, setWebsite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [device, setDevice] = useState('desktop'); // 'desktop', 'tablet', 'mobile'
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWebsite = async () => {
      try {
        setLoading(true);
        // Wenn keine ID vorhanden ist, versuchen wir die aktuelle Website aus dem localStorage zu laden
        if (!id) {
          const currentWebsite = localStorage.getItem('currentWebsite');
          if (currentWebsite) {
            try {
              const parsedWebsite = JSON.parse(currentWebsite);
              console.log('Geladene Website aus localStorage:', parsedWebsite);
              setWebsite(parsedWebsite);
              setLoading(false);
              return;
            } catch (parseError) {
              console.error('Fehler beim Parsen der Website aus localStorage:', parseError);
              // Weiter zum API-Aufruf, falls das Parsen fehlschlägt
            }
          } else {
            console.log('Keine Website im localStorage gefunden');
            setError('Keine Vorschau-Daten gefunden. Bitte kehre zum Editor zurück und versuche es erneut.');
            setLoading(false);
            return;
          }
        }

        // Ansonsten laden wir die Website von der API
        if (id) {
          const response = await axios.get(`${API_BASE_URL}/websites/${id}`);
          setWebsite(response.data);
        } else {
          setError('Keine Website-ID gefunden und keine Daten im localStorage.');
        }
        setLoading(false);
      } catch (err) {
        console.error('Fehler beim Laden der Website:', err);
        setError('Die Website konnte nicht geladen werden. Bitte versuche es später erneut.');
        setLoading(false);
      }
    };

    fetchWebsite();
  }, [id]);

  const handleDeviceChange = (newDevice) => {
    setDevice(newDevice);
  };

  const getPreviewFrameClass = () => {
    switch (device) {
      case 'tablet':
        return 'preview-frame preview-tablet';
      case 'mobile':
        return 'preview-frame preview-mobile';
      default:
        return 'preview-frame preview-desktop';
    }
  };

  if (loading) {
    return (
      <div className="preview-page">
        <div className="preview-header">
          <h3>Website-Vorschau wird geladen...</h3>
          <TouchFriendlyButton
            type="secondary"
            onClick={() => navigate(-1)}
            className="back-button"
          >
            Zurück zum Editor
          </TouchFriendlyButton>
        </div>
        <div className="preview-loading">
          <p>Lade Vorschau...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="preview-page">
        <div className="preview-header">
          <h3>Fehler</h3>
          <TouchFriendlyButton
            type="secondary"
            onClick={() => navigate(-1)}
            className="back-button"
          >
            Zurück zum Editor
          </TouchFriendlyButton>
        </div>
        <div className="preview-error">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!website) {
    return (
      <div className="preview-page">
        <div className="preview-header">
          <h3>Keine Website gefunden</h3>
          <TouchFriendlyButton
            type="secondary"
            onClick={() => navigate(-1)}
            className="back-button"
          >
            Zurück zum Editor
          </TouchFriendlyButton>
        </div>
        <div className="preview-error">
          <p>Es wurde keine Website zum Anzeigen gefunden. Bitte erstelle zuerst eine Website.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="preview-page">
      <div className="preview-header">
        <h3>Vorschau: {website.title || 'Meine Website'}</h3>
        <div className="device-selector">
          <button
            className={`device-button ${device === 'desktop' ? 'active' : ''}`}
            onClick={() => handleDeviceChange('desktop')}
            title="Desktop-Ansicht"
          >
            <i className="fas fa-desktop"></i>
          </button>
          <button
            className={`device-button ${device === 'mobile' ? 'active' : ''}`}
            onClick={() => handleDeviceChange('mobile')}
            title="Mobile-Ansicht"
          >
            <i className="fas fa-mobile-alt"></i>
          </button>
        </div>
        <TouchFriendlyButton
          type="secondary"
          onClick={() => navigate(-1)}
          className="back-button"
        >
          Zurück zum Editor
        </TouchFriendlyButton>
      </div>
      <div className="preview-container">
        <div className={getPreviewFrameClass()}>
          <iframe
            src={`/preview-render?data=${encodeURIComponent(JSON.stringify(website))}`}
            title="Website-Vorschau"
            className="preview-iframe"
            frameBorder="0"
            scrolling="yes"
            allowFullScreen
            style={{ width: '100%', height: '100%', display: 'block' }}
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default Preview;
