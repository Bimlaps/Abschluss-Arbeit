import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';

const Dashboard = () => {
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { user } = useContext(AuthContext);
  
  useEffect(() => {
    const fetchWebsites = async () => {
      try {
        const res = await axios.get('/api/websites');
        setWebsites(res.data);
        setLoading(false);
      } catch (err) {
        setError('Fehler beim Laden der Websites');
        setLoading(false);
      }
    };
    
    fetchWebsites();
  }, []);
  
  const handlePublishToggle = async (id, currentStatus) => {
    try {
      await axios.put(`/api/websites/${id}`, { published: !currentStatus });
      
      // Update local state
      setWebsites(websites.map(website => 
        website._id === id ? { ...website, published: !currentStatus } : website
      ));
    } catch (err) {
      setError('Fehler beim Aktualisieren des Veröffentlichungsstatus');
    }
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Sind Sie sicher, dass Sie diese Website löschen möchten?')) {
      try {
        await axios.delete(`/api/websites/${id}`);
        
        // Update local state
        setWebsites(websites.filter(website => website._id !== id));
      } catch (err) {
        setError('Fehler beim Löschen der Website');
      }
    }
  };
  
  if (loading) {
    return <div className="loading">Lädt...</div>;
  }
  
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <Link to="/website-builder" className="btn btn-primary">
          Neue Website erstellen
        </Link>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="dashboard-content">
        <h2>Meine Websites</h2>
        
        {websites.length === 0 ? (
          <div className="no-websites">
            <p>Sie haben noch keine Websites erstellt.</p>
            <Link to="/website-builder" className="btn btn-outline">
              Erste Website erstellen
            </Link>
          </div>
        ) : (
          <div className="websites-grid">
            {websites.map(website => (
              <div key={website._id} className="website-card">
                <div className="website-card-header">
                  <h3>{website.title}</h3>
                  <span className={`status-badge ${website.published ? 'published' : 'draft'}`}>
                    {website.published ? 'Veröffentlicht' : 'Entwurf'}
                  </span>
                </div>
                <div className="website-card-body">
                  <p>{website.description || 'Keine Beschreibung'}</p>
                  <div className="website-info">
                    <span>Subdomain: {website.subdomain}.247vitrine.ma</span>
                    <span>Erstellt am: {new Date(website.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="website-card-footer">
                  <Link to={`/website-builder/${website._id}`} className="btn btn-sm">
                    Bearbeiten
                  </Link>
                  <Link to={`/website-preview/${website._id}`} className="btn btn-sm btn-outline">
                    Vorschau
                  </Link>
                  <button 
                    className={`btn btn-sm ${website.published ? 'btn-warning' : 'btn-success'}`}
                    onClick={() => handlePublishToggle(website._id, website.published)}
                  >
                    {website.published ? 'Zurückziehen' : 'Veröffentlichen'}
                  </button>
                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(website._id)}
                  >
                    Löschen
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
