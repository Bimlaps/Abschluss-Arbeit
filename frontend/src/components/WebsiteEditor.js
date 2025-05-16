import React, { useState } from 'react';

function WebsiteEditor() {
  const [content, setContent] = useState({
    title: 'Meine Handwerker-Website',
    description: 'Willkommen auf meiner Webseite',
    services: [
      { title: 'Service 1', description: 'Beschreibung Service 1' },
      { title: 'Service 2', description: 'Beschreibung Service 2' }
    ]
  });

  const handleContentChange = (field, value) => {
    setContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleServiceChange = (index, field, value) => {
    const newServices = [...content.services];
    newServices[index] = {
      ...newServices[index],
      [field]: value
    };
    handleContentChange('services', newServices);
  };

  const addService = () => {
    handleContentChange('services', [
      ...content.services,
      { title: 'Neuer Service', description: 'Neue Beschreibung' }
    ]);
  };

  const removeService = (index) => {
    const newServices = content.services.filter((_, i) => i !== index);
    handleContentChange('services', newServices);
  };

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/website/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(content)
      });

      if (!response.ok) {
        throw new Error('Fehler beim Speichern');
      }

      alert('Änderungen wurden gespeichert!');
    } catch (error) {
      alert('Fehler beim Speichern: ' + error.message);
    }
  };

  return (
    <div className="website-editor">
      <h2>Website Bearbeiten</h2>
      
      <div className="editor-section">
        <h3>Allgemeine Informationen</h3>
        <div className="form-group">
          <label>Website Titel:</label>
          <input
            type="text"
            value={content.title}
            onChange={(e) => handleContentChange('title', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Beschreibung:</label>
          <textarea
            value={content.description}
            onChange={(e) => handleContentChange('description', e.target.value)}
          />
        </div>
      </div>

      <div className="editor-section">
        <h3>Services</h3>
        {content.services.map((service, index) => (
          <div key={index} className="service-item">
            <div className="form-group">
              <label>Service Titel:</label>
              <input
                type="text"
                value={service.title}
                onChange={(e) => handleServiceChange(index, 'title', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Service Beschreibung:</label>
              <textarea
                value={service.description}
                onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
              />
            </div>
            <button 
              type="button" 
              className="remove-button"
              onClick={() => removeService(index)}
            >
              Service entfernen
            </button>
          </div>
        ))}
        <button type="button" onClick={addService} className="add-button">
          Service hinzufügen
        </button>
      </div>

      <button onClick={handleSave} className="save-button">
        Änderungen speichern
      </button>
    </div>
  );
}

export default WebsiteEditor; 