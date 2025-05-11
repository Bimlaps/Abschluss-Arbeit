import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const WebsitePreview = () => {
  const { id } = useParams();
  const [website, setWebsite] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchWebsite = async () => {
      try {
        const res = await axios.get(`/api/websites/${id}`);
        setWebsite(res.data);
        
        // Generate preview
        const previewRes = await axios.post('/api/preview', {
          layout: res.data.layout._id,
          design: res.data.design._id,
          colorScheme: res.data.colorScheme._id,
          content: res.data.content
        });
        
        setPreview(previewRes.data.html);
        setLoading(false);
      } catch (err) {
        setError('Fehler beim Laden der Website-Vorschau');
        setLoading(false);
      }
    };
    
    fetchWebsite();
  }, [id]);
  
  if (loading) {
    return <div className="loading">Lädt Vorschau...</div>;
  }
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  return (
    <div className="website-preview-container">
      <div className="website-preview-header">
        <h1>Vorschau: {website?.title}</h1>
        <div className="preview-actions">
          <Link to={`/website-builder/${id}`} className="btn btn-primary">
            Bearbeiten
          </Link>
          <Link to="/dashboard" className="btn btn-outline">
            Zurück zum Dashboard
          </Link>
        </div>
      </div>
      
      <div className="preview-frame-container">
        <iframe
          title="Website Preview"
          srcDoc={preview}
          className="preview-iframe"
        />
      </div>
      
      <div className="preview-info">
        <div className="info-item">
          <strong>URL:</strong> {website?.subdomain}.247vitrine.ma
        </div>
        <div className="info-item">
          <strong>Status:</strong> 
          <span className={`status-badge ${website?.published ? 'published' : 'draft'}`}>
            {website?.published ? 'Veröffentlicht' : 'Entwurf'}
          </span>
        </div>
        <div className="info-item">
          <strong>Layout:</strong> {website?.layout.name}
        </div>
        <div className="info-item">
          <strong>Design:</strong> {website?.design.name}
        </div>
        <div className="info-item">
          <strong>Farbschema:</strong> {website?.colorScheme.name}
        </div>
      </div>
    </div>
  );
};

export default WebsitePreview;
