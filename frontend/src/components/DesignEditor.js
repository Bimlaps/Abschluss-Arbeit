import React, { useState } from 'react';

function DesignEditor() {
  const [design, setDesign] = useState({
    colors: {
      primary: '#007bff',
      secondary: '#6c757d',
      background: '#ffffff',
      text: '#333333'
    },
    fonts: {
      heading: 'Arial',
      body: 'Helvetica'
    },
    spacing: {
      padding: '20px',
      margin: '10px'
    }
  });

  const handleColorChange = (colorKey, value) => {
    setDesign(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorKey]: value
      }
    }));
  };

  const handleFontChange = (fontKey, value) => {
    setDesign(prev => ({
      ...prev,
      fonts: {
        ...prev.fonts,
        [fontKey]: value
      }
    }));
  };

  const handleSpacingChange = (spacingKey, value) => {
    setDesign(prev => ({
      ...prev,
      spacing: {
        ...prev.spacing,
        [spacingKey]: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/website/design', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(design)
      });

      if (!response.ok) {
        throw new Error('Fehler beim Speichern');
      }

      alert('Design wurde gespeichert!');
    } catch (error) {
      alert('Fehler beim Speichern: ' + error.message);
    }
  };

  return (
    <div className="design-editor">
      <h2>Design Anpassen</h2>
      
      <div className="editor-section">
        <h3>Farben</h3>
        <div className="color-picker-group">
          <div className="form-group">
            <label>Primärfarbe:</label>
            <input
              type="color"
              value={design.colors.primary}
              onChange={(e) => handleColorChange('primary', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Sekundärfarbe:</label>
            <input
              type="color"
              value={design.colors.secondary}
              onChange={(e) => handleColorChange('secondary', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Hintergrundfarbe:</label>
            <input
              type="color"
              value={design.colors.background}
              onChange={(e) => handleColorChange('background', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Textfarbe:</label>
            <input
              type="color"
              value={design.colors.text}
              onChange={(e) => handleColorChange('text', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="editor-section">
        <h3>Schriftarten</h3>
        <div className="form-group">
          <label>Überschriften:</label>
          <select
            value={design.fonts.heading}
            onChange={(e) => handleFontChange('heading', e.target.value)}
          >
            <option value="Arial">Arial</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Georgia">Georgia</option>
          </select>
        </div>
        <div className="form-group">
          <label>Fließtext:</label>
          <select
            value={design.fonts.body}
            onChange={(e) => handleFontChange('body', e.target.value)}
          >
            <option value="Arial">Arial</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Georgia">Georgia</option>
          </select>
        </div>
      </div>

      <div className="editor-section">
        <h3>Abstände</h3>
        <div className="form-group">
          <label>Innenabstand:</label>
          <input
            type="text"
            value={design.spacing.padding}
            onChange={(e) => handleSpacingChange('padding', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Außenabstand:</label>
          <input
            type="text"
            value={design.spacing.margin}
            onChange={(e) => handleSpacingChange('margin', e.target.value)}
          />
        </div>
      </div>

      <div className="preview-section">
        <h3>Vorschau</h3>
        <div 
          className="design-preview"
          style={{
            backgroundColor: design.colors.background,
            color: design.colors.text,
            padding: design.spacing.padding,
            margin: design.spacing.margin,
            fontFamily: design.fonts.body
          }}
        >
          <h4 style={{ 
            color: design.colors.primary,
            fontFamily: design.fonts.heading 
          }}>
            Überschrift Vorschau
          </h4>
          <p>Dies ist ein Vorschautext, der das ausgewählte Design zeigt.</p>
          <button style={{
            backgroundColor: design.colors.primary,
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px'
          }}>
            Beispiel Button
          </button>
        </div>
      </div>

      <button onClick={handleSave} className="save-button">
        Design speichern
      </button>
    </div>
  );
}

export default DesignEditor; 