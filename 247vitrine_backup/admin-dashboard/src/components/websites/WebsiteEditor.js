import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import WebsitePreview from '../common/WebsitePreview';
import '../wizard/Wizard.css';
import '../common/Common.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

/**
 * Website-Editor-Komponente für die Bearbeitung einer bestehenden Website
 */
function WebsiteEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [website, setWebsite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Lade Website-Daten
  useEffect(() => {
    const fetchWebsite = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/websites/${id}`);
        setWebsite(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching website:', error);
        setError('Fehler beim Laden der Website. Bitte versuche es später erneut.');
        setLoading(false);
      }
    };

    fetchWebsite();
  }, [id]);

  // Veröffentliche die Website
  const handlePublish = async () => {
    try {
      setSaving(true);
      const updatedWebsite = { ...website, published: true };

      try {
        const response = await axios.put(`${API_URL}/api/websites/${id}`, updatedWebsite);
        setWebsite(response.data);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } catch (apiError) {
        if (apiError.response && apiError.response.status === 403) {
          setError(apiError.response.data.message || 'Sie können nur eine veröffentlichte Website haben.');
        } else {
          throw apiError; // Weitergeben an den äußeren catch-Block
        }
      }

      setSaving(false);
    } catch (error) {
      console.error('Error publishing website:', error);
      setError('Fehler beim Veröffentlichen der Website. Bitte versuche es später erneut.');
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading">Website wird geladen...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!website) {
    return <div className="error">Website nicht gefunden.</div>;
  }

  return (
    <div className="website-editor">
      <div className="editor-header">
        <h1>Website bearbeiten: {website.name}</h1>
        <div className="editor-actions">
          <button
            className="btn-secondary"
            onClick={() => navigate('/websites')}
          >
            Zurück zur Übersicht
          </button>
          <button
            className="btn-primary"
            onClick={() => navigate(`/websites/${id}/edit-content`)}
          >
            Inhalte bearbeiten
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="success-message">
          Website wurde erfolgreich veröffentlicht!
        </div>
      )}

      <div className="website-preview-container">
        <WebsitePreview
          website={website}
          onPublish={handlePublish}
          showPublishButton={true}
        />
      </div>
    </div>
  );
}

export default WebsiteEditor;
