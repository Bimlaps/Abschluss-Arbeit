import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WebsiteEditor from './WebsiteEditor';
import DesignEditor from './DesignEditor';
import SEOEditor from './SEOEditor';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeEditor, setActiveEditor] = useState(null);

  useEffect(() => {
    // Überprüfe ob User eingeloggt ist
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!userStr || !token) {
      navigate('/login');
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      setUser(userData);
    } catch (error) {
      console.error('Fehler beim Laden der Benutzerdaten:', error);
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const renderEditor = () => {
    switch (activeEditor) {
      case 'website':
        return <WebsiteEditor />;
      case 'design':
        return <DesignEditor />;
      case 'seo':
        return <SEOEditor />;
      default:
        return null;
    }
  };

  if (!user) {
    return <div>Laden...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Willkommen, {user.name}!</h1>
        <button onClick={handleLogout} className="logout-button">
          Abmelden
        </button>
      </div>

      {!activeEditor ? (
        <div className="dashboard-content">
          <div className="dashboard-section">
            <h2>Ihre Website-Übersicht</h2>
            <div className="website-stats">
              <div className="stat-card">
                <h3>Status</h3>
                <p>Aktiv</p>
              </div>
              <div className="stat-card">
                <h3>Letzte Änderung</h3>
                <p>Heute</p>
              </div>
              <div className="stat-card">
                <h3>Besucher</h3>
                <p>-</p>
              </div>
            </div>
          </div>
          <div className="dashboard-section">
            <h2>Schnellzugriff</h2>
            <div className="quick-actions">
              <button 
                className="action-button"
                onClick={() => setActiveEditor('website')}
              >
                Website bearbeiten
              </button>
              <button 
                className="action-button"
                onClick={() => setActiveEditor('design')}
              >
                Design anpassen
              </button>
              <button 
                className="action-button"
                onClick={() => setActiveEditor('seo')}
              >
                SEO optimieren
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="editor-container">
          <button 
            className="back-button"
            onClick={() => setActiveEditor(null)}
          >
            Zurück zum Dashboard
          </button>
          {renderEditor()}
        </div>
      )}
    </div>
  );
}

export default Dashboard; 