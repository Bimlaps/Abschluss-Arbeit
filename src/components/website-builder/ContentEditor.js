import React, { useState, useEffect } from 'react';

const ContentEditor = ({ layout, content, onChange, onBack, onPreview }) => {
  const [currentContent, setCurrentContent] = useState({});
  const [activeSection, setActiveSection] = useState('hero');
  
  useEffect(() => {
    // Initialize content with default values if empty
    if (!content || Object.keys(content).length === 0) {
      const defaultContent = {
        title: 'Meine Website',
        description: 'Eine professionelle Website für mein Unternehmen',
        hero: {
          title: 'Willkommen',
          subtitle: 'Auf meiner Website'
        },
        about: {
          title: 'Über uns',
          text: 'Hier steht ein Text über unser Unternehmen.'
        },
        services: [
          {
            title: 'Service 1',
            description: 'Beschreibung des ersten Services'
          }
        ],
        contact: {
          email: '',
          phone: '',
          address: ''
        }
      };
      
      setCurrentContent(defaultContent);
      onChange(defaultContent);
    } else {
      setCurrentContent(content);
    }
  }, [content, onChange]);
  
  const handleInputChange = (section, field, value) => {
    const updatedContent = { ...currentContent };
    
    if (section) {
      if (!updatedContent[section]) {
        updatedContent[section] = {};
      }
      updatedContent[section][field] = value;
    } else {
      updatedContent[field] = value;
    }
    
    setCurrentContent(updatedContent);
    onChange(updatedContent);
  };
  
  const handleServiceChange = (index, field, value) => {
    const updatedContent = { ...currentContent };
    
    if (!updatedContent.services) {
      updatedContent.services = [];
    }
    
    if (!updatedContent.services[index]) {
      updatedContent.services[index] = {};
    }
    
    updatedContent.services[index][field] = value;
    
    setCurrentContent(updatedContent);
    onChange(updatedContent);
  };
  
  const addService = () => {
    const updatedContent = { ...currentContent };
    
    if (!updatedContent.services) {
      updatedContent.services = [];
    }
    
    updatedContent.services.push({
      title: `Service ${updatedContent.services.length + 1}`,
      description: 'Beschreibung des Services'
    });
    
    setCurrentContent(updatedContent);
    onChange(updatedContent);
  };
  
  const removeService = (index) => {
    const updatedContent = { ...currentContent };
    updatedContent.services.splice(index, 1);
    
    setCurrentContent(updatedContent);
    onChange(updatedContent);
  };
  
  // Parse layout structure
  const layoutStructure = layout ? JSON.parse(layout.structure) : {};
  
  return (
    <div className="content-editor">
      <h2>Inhalte bearbeiten</h2>
      
      <div className="content-editor-container">
        <div className="content-sections">
          <div 
            className={`section-tab ${activeSection === 'general' ? 'active' : ''}`}
            onClick={() => setActiveSection('general')}
          >
            Allgemein
          </div>
          
          {layoutStructure.hero && (
            <div 
              className={`section-tab ${activeSection === 'hero' ? 'active' : ''}`}
              onClick={() => setActiveSection('hero')}
            >
              Hero-Bereich
            </div>
          )}
          
          {layoutStructure.about && (
            <div 
              className={`section-tab ${activeSection === 'about' ? 'active' : ''}`}
              onClick={() => setActiveSection('about')}
            >
              Über uns
            </div>
          )}
          
          {layoutStructure.services && (
            <div 
              className={`section-tab ${activeSection === 'services' ? 'active' : ''}`}
              onClick={() => setActiveSection('services')}
            >
              Leistungen
            </div>
          )}
          
          {layoutStructure.contact && (
            <div 
              className={`section-tab ${activeSection === 'contact' ? 'active' : ''}`}
              onClick={() => setActiveSection('contact')}
            >
              Kontakt
            </div>
          )}
        </div>
        
        <div className="section-content">
          {activeSection === 'general' && (
            <div className="general-section">
              <div className="form-group">
                <label>Website-Titel</label>
                <input
                  type="text"
                  value={currentContent.title || ''}
                  onChange={(e) => handleInputChange(null, 'title', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Beschreibung</label>
                <textarea
                  value={currentContent.description || ''}
                  onChange={(e) => handleInputChange(null, 'description', e.target.value)}
                />
              </div>
            </div>
          )}
          
          {activeSection === 'hero' && (
            <div className="hero-section">
              <div className="form-group">
                <label>Überschrift</label>
                <input
                  type="text"
                  value={currentContent.hero?.title || ''}
                  onChange={(e) => handleInputChange('hero', 'title', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Untertitel</label>
                <input
                  type="text"
                  value={currentContent.hero?.subtitle || ''}
                  onChange={(e) => handleInputChange('hero', 'subtitle', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Hintergrundbild</label>
                <div className="image-upload">
                  <input type="file" accept="image/*" />
                  <button className="btn btn-sm">Hochladen</button>
                </div>
              </div>
            </div>
          )}
          
          {activeSection === 'about' && (
            <div className="about-section">
              <div className="form-group">
                <label>Überschrift</label>
                <input
                  type="text"
                  value={currentContent.about?.title || ''}
                  onChange={(e) => handleInputChange('about', 'title', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Text</label>
                <textarea
                  value={currentContent.about?.text || ''}
                  onChange={(e) => handleInputChange('about', 'text', e.target.value)}
                  rows="6"
                />
              </div>
              <div className="form-group">
                <label>Bild</label>
                <div className="image-upload">
                  <input type="file" accept="image/*" />
                  <button className="btn btn-sm">Hochladen</button>
                </div>
              </div>
            </div>
          )}
          
          {activeSection === 'services' && (
            <div className="services-section">
              <h3>Leistungen</h3>
              
              {currentContent.services?.map((service, index) => (
                <div key={index} className="service-item">
                  <div className="service-header">
                    <h4>Leistung {index + 1}</h4>
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => removeService(index)}
                    >
                      Entfernen
                    </button>
                  </div>
                  <div className="form-group">
                    <label>Titel</label>
                    <input
                      type="text"
                      value={service.title || ''}
                      onChange={(e) => handleServiceChange(index, 'title', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Beschreibung</label>
                    <textarea
                      value={service.description || ''}
                      onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                      rows="3"
                    />
                  </div>
                </div>
              ))}
              
              <button className="btn btn-outline" onClick={addService}>
                Leistung hinzufügen
              </button>
            </div>
          )}
          
          {activeSection === 'contact' && (
            <div className="contact-section">
              <div className="form-group">
                <label>E-Mail</label>
                <input
                  type="email"
                  value={currentContent.contact?.email || ''}
                  onChange={(e) => handleInputChange('contact', 'email', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Telefon</label>
                <input
                  type="tel"
                  value={currentContent.contact?.phone || ''}
                  onChange={(e) => handleInputChange('contact', 'phone', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Adresse</label>
                <textarea
                  value={currentContent.contact?.address || ''}
                  onChange={(e) => handleInputChange('contact', 'address', e.target.value)}
                  rows="3"
                />
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="editor-actions">
        <button className="btn btn-outline" onClick={onBack}>
          Zurück
        </button>
        <button className="btn btn-secondary" onClick={onPreview}>
          Vorschau
        </button>
      </div>
    </div>
  );
};

export default ContentEditor;
