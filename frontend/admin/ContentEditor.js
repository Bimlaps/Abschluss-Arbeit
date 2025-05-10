import React, { useState } from 'react';
import './Wizard.css';

function ContentEditor({ content, onChange }) {
  const [activeTab, setActiveTab] = useState('general');

  const handleChange = (section, field, value) => {
    const updatedContent = { ...content };
    
    if (section === 'general') {
      updatedContent[field] = value;
    } else if (section === 'services') {
      const serviceIndex = parseInt(field.split('-')[1]);
      const serviceField = field.split('-')[2];
      updatedContent.services[serviceIndex][serviceField] = value;
    } else {
      updatedContent[section][field] = value;
    }
    
    onChange(updatedContent);
  };

  const addService = () => {
    const updatedContent = { ...content };
    updatedContent.services.push({
      title: '',
      description: '',
      icon: '🔧'
    });
    onChange(updatedContent);
  };

  const removeService = (index) => {
    const updatedContent = { ...content };
    updatedContent.services.splice(index, 1);
    onChange(updatedContent);
  };

  return (
    <div className="content-editor">
      <h2>Bearbeite die Inhalte deiner Website</h2>
      
      <div className="editor-tabs">
        <button 
          className={activeTab === 'general' ? 'active' : ''} 
          onClick={() => setActiveTab('general')}
        >
          Allgemein
        </button>
        <button 
          className={activeTab === 'hero' ? 'active' : ''} 
          onClick={() => setActiveTab('hero')}
        >
          Hero-Bereich
        </button>
        <button 
          className={activeTab === 'about' ? 'active' : ''} 
          onClick={() => setActiveTab('about')}
        >
          Über uns
        </button>
        <button 
          className={activeTab === 'services' ? 'active' : ''} 
          onClick={() => setActiveTab('services')}
        >
          Leistungen
        </button>
        <button 
          className={activeTab === 'contact' ? 'active' : ''} 
          onClick={() => setActiveTab('contact')}
        >
          Kontakt
        </button>
      </div>
      
      <div className="editor-content">
        {activeTab === 'general' && (
          <div className="editor-section">
            <div className="form-group">
              <label>Titel</label>
              <input 
                type="text" 
                value={content.title} 
                onChange={(e) => handleChange('general', 'title', e.target.value)}
                placeholder="z.B. Muster Handwerker GmbH"
              />
            </div>
            <div className="form-group">
              <label>Beschreibung</label>
              <textarea 
                value={content.description} 
                onChange={(e) => handleChange('general', 'description', e.target.value)}
                placeholder="z.B. Ihr zuverlässiger Partner für alle Handwerksarbeiten"
              ></textarea>
            </div>
            <div className="form-group">
              <label>Logo URL</label>
              <input 
                type="text" 
                value={content.logo} 
                onChange={(e) => handleChange('general', 'logo', e.target.value)}
                placeholder="URL zu deinem Logo"
              />
            </div>
          </div>
        )}
        
        {activeTab === 'hero' && (
          <div className="editor-section">
            <div className="form-group">
              <label>Überschrift</label>
              <input 
                type="text" 
                value={content.hero.title} 
                onChange={(e) => handleChange('hero', 'title', e.target.value)}
                placeholder="z.B. Willkommen bei Muster Handwerker"
              />
            </div>
            <div className="form-group">
              <label>Untertitel</label>
              <input 
                type="text" 
                value={content.hero.subtitle} 
                onChange={(e) => handleChange('hero', 'subtitle', e.target.value)}
                placeholder="z.B. Qualität und Zuverlässigkeit seit 1995"
              />
            </div>
            <div className="form-group">
              <label>Bild URL</label>
              <input 
                type="text" 
                value={content.hero.image} 
                onChange={(e) => handleChange('hero', 'image', e.target.value)}
                placeholder="URL zu deinem Hero-Bild"
              />
            </div>
          </div>
        )}
        
        {activeTab === 'about' && (
          <div className="editor-section">
            <div className="form-group">
              <label>Überschrift</label>
              <input 
                type="text" 
                value={content.about.title} 
                onChange={(e) => handleChange('about', 'title', e.target.value)}
                placeholder="z.B. Über uns"
              />
            </div>
            <div className="form-group">
              <label>Text</label>
              <textarea 
                value={content.about.text} 
                onChange={(e) => handleChange('about', 'text', e.target.value)}
                placeholder="z.B. Wir sind ein Familienunternehmen mit über 25 Jahren Erfahrung..."
              ></textarea>
            </div>
            <div className="form-group">
              <label>Bild URL</label>
              <input 
                type="text" 
                value={content.about.image} 
                onChange={(e) => handleChange('about', 'image', e.target.value)}
                placeholder="URL zu deinem Über-uns-Bild"
              />
            </div>
          </div>
        )}
        
        {activeTab === 'services' && (
          <div className="editor-section">
            <h3>Leistungen</h3>
            {content.services.map((service, index) => (
              <div key={index} className="service-item">
                <h4>Leistung {index + 1}</h4>
                <div className="form-group">
                  <label>Titel</label>
                  <input 
                    type="text" 
                    value={service.title} 
                    onChange={(e) => handleChange('services', `service-${index}-title`, e.target.value)}
                    placeholder="z.B. Sanitärinstallation"
                  />
                </div>
                <div className="form-group">
                  <label>Beschreibung</label>
                  <textarea 
                    value={service.description} 
                    onChange={(e) => handleChange('services', `service-${index}-description`, e.target.value)}
                    placeholder="z.B. Professionelle Installation und Reparatur von Sanitäranlagen"
                  ></textarea>
                </div>
                <div className="form-group">
                  <label>Icon</label>
                  <input 
                    type="text" 
                    value={service.icon} 
                    onChange={(e) => handleChange('services', `service-${index}-icon`, e.target.value)}
                    placeholder="z.B. 🔧"
                  />
                </div>
                {content.services.length > 1 && (
                  <button 
                    type="button" 
                    className="btn-danger" 
                    onClick={() => removeService(index)}
                  >
                    Leistung entfernen
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="btn-secondary" onClick={addService}>
              Leistung hinzufügen
            </button>
          </div>
        )}
        
        {activeTab === 'contact' && (
          <div className="editor-section">
            <div className="form-group">
              <label>E-Mail</label>
              <input 
                type="email" 
                value={content.contact.email} 
                onChange={(e) => handleChange('contact', 'email', e.target.value)}
                placeholder="z.B. info@musterhandwerker.de"
              />
            </div>
            <div className="form-group">
              <label>Telefon</label>
              <input 
                type="tel" 
                value={content.contact.phone} 
                onChange={(e) => handleChange('contact', 'phone', e.target.value)}
                placeholder="z.B. +49 123 456789"
              />
            </div>
            <div className="form-group">
              <label>Adresse</label>
              <textarea 
                value={content.contact.address} 
                onChange={(e) => handleChange('contact', 'address', e.target.value)}
                placeholder="z.B. Musterstraße 123, 12345 Musterstadt"
              ></textarea>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ContentEditor;
