import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Import components
import LayoutSelector from './LayoutSelector';
import DesignSelector from './DesignSelector';
import ColorSchemeSelector from './ColorSchemeSelector';
import ContentEditor from './ContentEditor';

const WebsiteBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const [step, setStep] = useState(1);
  const [layouts, setLayouts] = useState([]);
  const [designs, setDesigns] = useState([]);
  const [colorSchemes, setColorSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState('');
  
  const [website, setWebsite] = useState({
    title: '',
    description: '',
    subdomain: '',
    layout: '',
    design: '',
    colorScheme: '',
    content: {},
    published: false,
    isDemo: false
  });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch layouts, designs, and color schemes
        const [layoutsRes, designsRes, colorSchemesRes] = await Promise.all([
          axios.get('/api/layouts'),
          axios.get('/api/designs'),
          axios.get('/api/color-schemes')
        ]);
        
        setLayouts(layoutsRes.data);
        setDesigns(designsRes.data);
        setColorSchemes(colorSchemesRes.data);
        
        // If editing, fetch website data
        if (isEditing) {
          const websiteRes = await axios.get(`/api/websites/${id}`);
          setWebsite(websiteRes.data);
        }
        
        setLoading(false);
      } catch (err) {
        setError('Fehler beim Laden der Daten');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, isEditing]);
  
  const handleLayoutSelect = (layoutId) => {
    setWebsite({ ...website, layout: layoutId });
    setStep(2);
  };
  
  const handleDesignSelect = (designId) => {
    setWebsite({ ...website, design: designId });
    setStep(3);
  };
  
  const handleColorSchemeSelect = (colorSchemeId) => {
    setWebsite({ ...website, colorScheme: colorSchemeId });
    setStep(4);
  };
  
  const handleContentChange = (content) => {
    setWebsite({ ...website, content });
  };
  
  const handleInputChange = (e) => {
    setWebsite({ ...website, [e.target.name]: e.target.value });
  };
  
  const generatePreview = async () => {
    try {
      const res = await axios.post('/api/preview', {
        layout: website.layout,
        design: website.design,
        colorScheme: website.colorScheme,
        content: website.content
      });
      
      setPreview(res.data.html);
    } catch (err) {
      setError('Fehler bei der Vorschau-Generierung');
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isEditing) {
        await axios.put(`/api/websites/${id}`, website);
      } else {
        await axios.post('/api/websites', website);
      }
      
      navigate('/dashboard');
    } catch (err) {
      setError('Fehler beim Speichern der Website');
    }
  };
  
  if (loading) {
    return <div className="loading">Lädt...</div>;
  }
  
  return (
    <div className="website-builder-container">
      <div className="website-builder-header">
        <h1>{isEditing ? 'Website bearbeiten' : 'Neue Website erstellen'}</h1>
        <div className="steps-indicator">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>1. Layout</div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>2. Design</div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>3. Farbschema</div>
          <div className={`step ${step >= 4 ? 'active' : ''}`}>4. Inhalt</div>
        </div>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="website-builder-content">
        {step === 1 && (
          <LayoutSelector 
            layouts={layouts} 
            selectedLayout={website.layout} 
            onSelect={handleLayoutSelect} 
          />
        )}
        
        {step === 2 && (
          <DesignSelector 
            designs={designs.filter(design => design.layout._id === website.layout)} 
            selectedDesign={website.design} 
            onSelect={handleDesignSelect} 
            onBack={() => setStep(1)} 
          />
        )}
        
        {step === 3 && (
          <ColorSchemeSelector 
            colorSchemes={colorSchemes} 
            selectedColorScheme={website.colorScheme} 
            onSelect={handleColorSchemeSelect} 
            onBack={() => setStep(2)} 
          />
        )}
        
        {step === 4 && (
          <div className="content-editor-container">
            <div className="website-info-form">
              <h2>Website-Informationen</h2>
              <div className="form-group">
                <label htmlFor="title">Titel</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={website.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Beschreibung</label>
                <textarea
                  id="description"
                  name="description"
                  value={website.description}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="subdomain">Subdomain</label>
                <div className="subdomain-input">
                  <input
                    type="text"
                    id="subdomain"
                    name="subdomain"
                    value={website.subdomain}
                    onChange={handleInputChange}
                    required
                  />
                  <span>.247vitrine.ma</span>
                </div>
              </div>
            </div>
            
            <ContentEditor 
              layout={layouts.find(l => l._id === website.layout)} 
              content={website.content} 
              onChange={handleContentChange} 
              onBack={() => setStep(3)} 
              onPreview={generatePreview}
            />
            
            <div className="preview-container">
              {preview && (
                <iframe
                  title="Website Preview"
                  srcDoc={preview}
                  className="preview-iframe"
                />
              )}
            </div>
            
            <div className="form-actions">
              <button className="btn btn-outline" onClick={() => setStep(3)}>
                Zurück
              </button>
              <button className="btn btn-primary" onClick={handleSubmit}>
                {isEditing ? 'Aktualisieren' : 'Erstellen'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebsiteBuilder;
