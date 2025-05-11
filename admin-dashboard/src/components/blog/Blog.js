import React, { useState, useEffect, useContext } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import BlogList from './BlogList';
import BlogDetail from './BlogDetail';
import BlogEditor from './BlogEditor';
import './Blog.css';

const BlogRoutes = () => {
  const { isAuthenticated } = useContext(AuthContext);
  
  return (
    <Routes>
      <Route path="/" element={<BlogHome />} />
      <Route path="/:id" element={<BlogDetail />} />
      <Route 
        path="/new" 
        element={isAuthenticated ? <BlogEditor /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/edit/:id" 
        element={isAuthenticated ? <BlogEditor /> : <Navigate to="/login" />} 
      />
    </Routes>
  );
};

const BlogHome = () => {
  const [websites, setWebsites] = useState([]);
  const [selectedWebsite, setSelectedWebsite] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { isAuthenticated } = useContext(AuthContext);
  
  useEffect(() => {
    const fetchWebsites = async () => {
      try {
        setLoading(true);
        
        const res = await axios.get('/api/websites');
        setWebsites(res.data);
        
        // Wenn Websites vorhanden sind, wähle die erste aus
        if (res.data.length > 0) {
          setSelectedWebsite(res.data[0]._id);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching websites:', err);
        setError('Fehler beim Laden der Websites');
        setLoading(false);
      }
    };
    
    fetchWebsites();
  }, []);
  
  const handleWebsiteChange = (e) => {
    setSelectedWebsite(e.target.value);
  };
  
  if (loading) {
    return <div className="loading">Lädt Websites...</div>;
  }
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  if (websites.length === 0) {
    return (
      <div className="no-websites">
        <h2>Keine Websites gefunden</h2>
        <p>Sie müssen zuerst eine Website erstellen, bevor Sie Blog-Beiträge hinzufügen können.</p>
      </div>
    );
  }
  
  return (
    <div className="blog-container">
      <div className="blog-header">
        <h1>Blog-Verwaltung</h1>
        
        <div className="website-selector">
          <label htmlFor="website-select">Website auswählen:</label>
          <select
            id="website-select"
            value={selectedWebsite}
            onChange={handleWebsiteChange}
          >
            {websites.map(website => (
              <option key={website._id} value={website._id}>
                {website.title}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {selectedWebsite && <BlogList websiteId={selectedWebsite} />}
    </div>
  );
};

export default BlogRoutes;
