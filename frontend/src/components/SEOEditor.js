import React, { useState } from 'react';

function SEOEditor() {
  const [seoData, setSeoData] = useState({
    title: '',
    description: '',
    keywords: '',
    socialImage: '',
    customMetaTags: [
      { name: '', content: '' }
    ]
  });

  const handleInputChange = (field, value) => {
    setSeoData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMetaTagChange = (index, field, value) => {
    const newMetaTags = [...seoData.customMetaTags];
    newMetaTags[index] = {
      ...newMetaTags[index],
      [field]: value
    };
    handleInputChange('customMetaTags', newMetaTags);
  };

  const addMetaTag = () => {
    setSeoData(prev => ({
      ...prev,
      customMetaTags: [...prev.customMetaTags, { name: '', content: '' }]
    }));
  };

  const removeMetaTag = (index) => {
    setSeoData(prev => ({
      ...prev,
      customMetaTags: prev.customMetaTags.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/website/seo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(seoData)
      });

      if (!response.ok) {
        throw new Error('Fehler beim Speichern');
      }

      alert('SEO-Einstellungen wurden gespeichert!');
    } catch (error) {
      alert('Fehler beim Speichern: ' + error.message);
    }
  };

  return (
    <div className="seo-editor">
      <h2>SEO Optimierung</h2>
      
      <div className="editor-section">
        <h3>Basis SEO-Einstellungen</h3>
        <div className="form-group">
          <label>Meta Titel:</label>
          <input
            type="text"
            value={seoData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Seitentitel für Suchmaschinen"
          />
          <small>Empfohlene Länge: 50-60 Zeichen</small>
        </div>

        <div className="form-group">
          <label>Meta Beschreibung:</label>
          <textarea
            value={seoData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Kurze Beschreibung Ihrer Website"
          />
          <small>Empfohlene Länge: 150-160 Zeichen</small>
        </div>

        <div className="form-group">
          <label>Keywords:</label>
          <input
            type="text"
            value={seoData.keywords}
            onChange={(e) => handleInputChange('keywords', e.target.value)}
            placeholder="keyword1, keyword2, keyword3"
          />
          <small>Trennen Sie Keywords mit Kommas</small>
        </div>

        <div className="form-group">
          <label>Social Media Vorschaubild:</label>
          <input
            type="text"
            value={seoData.socialImage}
            onChange={(e) => handleInputChange('socialImage', e.target.value)}
            placeholder="URL zum Vorschaubild"
          />
        </div>
      </div>

      <div className="editor-section">
        <h3>Benutzerdefinierte Meta-Tags</h3>
        {seoData.customMetaTags.map((tag, index) => (
          <div key={index} className="meta-tag-group">
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                value={tag.name}
                onChange={(e) => handleMetaTagChange(index, 'name', e.target.value)}
                placeholder="Meta-Tag Name"
              />
            </div>
            <div className="form-group">
              <label>Inhalt:</label>
              <input
                type="text"
                value={tag.content}
                onChange={(e) => handleMetaTagChange(index, 'content', e.target.value)}
                placeholder="Meta-Tag Inhalt"
              />
            </div>
            <button 
              type="button" 
              className="remove-button"
              onClick={() => removeMetaTag(index)}
            >
              Meta-Tag entfernen
            </button>
          </div>
        ))}
        <button type="button" onClick={addMetaTag} className="add-button">
          Meta-Tag hinzufügen
        </button>
      </div>

      <div className="editor-section">
        <h3>SEO Vorschau</h3>
        <div className="seo-preview">
          <div className="google-preview">
            <div className="preview-title">{seoData.title || 'Ihr Seitentitel'}</div>
            <div className="preview-url">www.ihre-website.de</div>
            <div className="preview-description">
              {seoData.description || 'Ihre Meta-Beschreibung wird hier angezeigt...'}
            </div>
          </div>
        </div>
      </div>

      <button onClick={handleSave} className="save-button">
        SEO-Einstellungen speichern
      </button>
    </div>
  );
}

export default SEOEditor; 