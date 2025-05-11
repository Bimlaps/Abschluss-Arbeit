import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';

const BlogEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditing = !!id;
  
  // Extrahiere websiteId aus der URL, wenn vorhanden
  const queryParams = new URLSearchParams(location.search);
  const websiteIdFromQuery = queryParams.get('websiteId');
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    tags: '',
    categories: '',
    status: 'draft',
    featuredImage: '',
    websiteId: websiteIdFromQuery || ''
  });
  
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState('');
  
  const { isAuthenticated } = useContext(AuthContext);
  
  useEffect(() => {
    // Überprüfen, ob der Benutzer angemeldet ist
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Websites abrufen
        const websitesRes = await axios.get('/api/websites');
        setWebsites(websitesRes.data);
        
        // Wenn im Bearbeitungsmodus, Blog-Beitrag abrufen
        if (isEditing) {
          const blogPostRes = await axios.get(`/api/blog/${id}`);
          const blogPost = blogPostRes.data;
          
          setFormData({
            title: blogPost.title,
            content: blogPost.content,
            summary: blogPost.summary,
            tags: blogPost.tags.join(', '),
            categories: blogPost.categories.join(', '),
            status: blogPost.status,
            featuredImage: blogPost.featuredImage,
            websiteId: blogPost.website._id
          });
          
          // Vorschau generieren
          setPreview(blogPost.contentHtml);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Fehler beim Laden der Daten');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, isEditing, isAuthenticated, navigate]);
  
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handlePreview = async () => {
    try {
      // Markdown in HTML umwandeln
      const res = await axios.post('/api/blog/preview', {
        content: formData.content
      });
      
      setPreview(res.data.html);
    } catch (err) {
      console.error('Error generating preview:', err);
      setError('Fehler bei der Vorschau-Generierung');
    }
  };
  
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const res = await axios.post('/api/blog/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Bild-URL in das Formular einfügen
      setFormData(prev => ({
        ...prev,
        featuredImage: res.data.imageUrl
      }));
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Fehler beim Hochladen des Bildes');
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setError('');
      
      // Daten für die API vorbereiten
      const blogPostData = {
        title: formData.title,
        content: formData.content,
        summary: formData.summary,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        categories: formData.categories.split(',').map(cat => cat.trim()).filter(cat => cat),
        status: formData.status,
        featuredImage: formData.featuredImage,
        websiteId: formData.websiteId
      };
      
      if (isEditing) {
        // Blog-Beitrag aktualisieren
        await axios.put(`/api/blog/${id}`, blogPostData);
      } else {
        // Neuen Blog-Beitrag erstellen
        await axios.post('/api/blog', blogPostData);
      }
      
      // Zurück zur Blog-Liste navigieren
      navigate('/blog');
    } catch (err) {
      console.error('Error saving blog post:', err);
      setError(err.response?.data?.message || 'Fehler beim Speichern des Blog-Beitrags');
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return <div className="loading">Lädt Editor...</div>;
  }
  
  return (
    <div className="blog-editor-container">
      <div className="blog-editor-header">
        <h1>{isEditing ? 'Blog-Beitrag bearbeiten' : 'Neuen Blog-Beitrag erstellen'}</h1>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="blog-editor-form">
        <div className="form-group">
          <label htmlFor="title">Titel *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="summary">Zusammenfassung *</label>
          <textarea
            id="summary"
            name="summary"
            value={formData.summary}
            onChange={handleInputChange}
            required
            rows="3"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="websiteId">Website *</label>
          <select
            id="websiteId"
            name="websiteId"
            value={formData.websiteId}
            onChange={handleInputChange}
            required
          >
            <option value="">-- Website auswählen --</option>
            {websites.map(website => (
              <option key={website._id} value={website._id}>
                {website.title}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="tags">Tags (durch Komma getrennt)</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="z.B. Neuigkeiten, Tipps, Angebote"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="categories">Kategorien (durch Komma getrennt)</label>
            <input
              type="text"
              id="categories"
              name="categories"
              value={formData.categories}
              onChange={handleInputChange}
              placeholder="z.B. Allgemein, Produkte, Dienstleistungen"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="featuredImage">Titelbild</label>
          {formData.featuredImage && (
            <div className="featured-image-preview">
              <img src={formData.featuredImage} alt="Titelbild" />
            </div>
          )}
          <input
            type="file"
            id="featuredImage"
            name="featuredImage"
            onChange={handleImageUpload}
            accept="image/*"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="content">Inhalt (Markdown) *</label>
          <div className="markdown-editor">
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              required
              rows="15"
              placeholder="# Überschrift 1&#10;## Überschrift 2&#10;&#10;Normaler Text&#10;&#10;* Listenpunkt 1&#10;* Listenpunkt 2&#10;&#10;[Link](https://example.com)"
            />
            <div className="markdown-toolbar">
              <button type="button" onClick={() => handleInputChange({ target: { name: 'content', value: formData.content + '# ' } })}>H1</button>
              <button type="button" onClick={() => handleInputChange({ target: { name: 'content', value: formData.content + '## ' } })}>H2</button>
              <button type="button" onClick={() => handleInputChange({ target: { name: 'content', value: formData.content + '### ' } })}>H3</button>
              <button type="button" onClick={() => handleInputChange({ target: { name: 'content', value: formData.content + '**Fett**' } })}>Fett</button>
              <button type="button" onClick={() => handleInputChange({ target: { name: 'content', value: formData.content + '*Kursiv*' } })}>Kursiv</button>
              <button type="button" onClick={() => handleInputChange({ target: { name: 'content', value: formData.content + '- ' } })}>Liste</button>
              <button type="button" onClick={() => handleInputChange({ target: { name: 'content', value: formData.content + '[Link](url)' } })}>Link</button>
              <button type="button" onClick={() => handleInputChange({ target: { name: 'content', value: formData.content + '![Alt-Text](bild-url)' } })}>Bild</button>
              <button type="button" onClick={handlePreview} className="preview-button">Vorschau</button>
            </div>
          </div>
        </div>
        
        {preview && (
          <div className="markdown-preview">
            <h3>Vorschau</h3>
            <div 
              className="preview-content"
              dangerouslySetInnerHTML={{ __html: preview }}
            />
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
          >
            <option value="draft">Entwurf</option>
            <option value="published">Veröffentlicht</option>
          </select>
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="btn btn-outline"
            onClick={() => navigate('/blog')}
          >
            Abbrechen
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? 'Wird gespeichert...' : (isEditing ? 'Aktualisieren' : 'Erstellen')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogEditor;
