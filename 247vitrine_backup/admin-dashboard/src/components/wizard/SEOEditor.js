import React from 'react';
import Tooltip from '../common/Tooltip';
import './Wizard.css';

/**
 * SEO-Editor-Komponente für die Optimierung der Website für Suchmaschinen
 * @param {Object} props - Component props
 * @param {Object} props.content - Website content
 * @param {Function} props.onChange - Change handler
 */
function SEOEditor({ content, onChange }) {
  // Initialisiere SEO-Objekt, falls es noch nicht existiert
  if (!content.seo) {
    content.seo = {
      title: content.title || '',
      description: content.description || '',
      keywords: ''
    };
  }
  
  const handleChange = (field, value) => {
    const updatedContent = { ...content };
    if (!updatedContent.seo) {
      updatedContent.seo = {};
    }
    updatedContent.seo[field] = value;
    onChange(updatedContent);
  };
  
  // Berechne die verbleibenden Zeichen
  const titleLength = (content.seo?.title || '').length;
  const titleMaxLength = 60;
  const titleRemainingChars = titleMaxLength - titleLength;
  
  const descriptionLength = (content.seo?.description || '').length;
  const descriptionMaxLength = 160;
  const descriptionRemainingChars = descriptionMaxLength - descriptionLength;
  
  // Bestimme die Farbe für die Zeichenanzahl
  const getTitleCharCountColor = () => {
    if (titleRemainingChars >= 20) return 'green';
    if (titleRemainingChars >= 0) return 'orange';
    return 'red';
  };
  
  const getDescriptionCharCountColor = () => {
    if (descriptionRemainingChars >= 40) return 'green';
    if (descriptionRemainingChars >= 0) return 'orange';
    return 'red';
  };
  
  return (
    <div className="seo-editor">
      <div className="form-section-title">
        <h3>Suchmaschinenoptimierung (SEO)</h3>
      </div>
      <p>
        Diese Einstellungen helfen deiner Website, in Suchmaschinen besser gefunden zu werden.
      </p>
      
      <div className="form-group priority-high">
        <Tooltip content="Der Titel erscheint in den Suchergebnissen und im Browser-Tab. Er sollte prägnant und aussagekräftig sein.">
          <label>Seitentitel</label>
        </Tooltip>
        <input
          type="text"
          value={content.seo?.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="z.B. Meisterbetrieb Schmidt - Sanitär, Heizung, Klima in Berlin"
          maxLength={titleMaxLength}
        />
        <div 
          className="character-count" 
          style={{ color: getTitleCharCountColor() }}
        >
          {titleRemainingChars} Zeichen übrig
        </div>
      </div>
      
      <div className="form-group priority-high">
        <Tooltip content="Die Beschreibung wird in den Suchergebnissen angezeigt. Sie sollte das Angebot deines Unternehmens kurz und präzise zusammenfassen.">
          <label>Meta-Beschreibung</label>
        </Tooltip>
        <textarea
          value={content.seo?.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Kurze Beschreibung deines Unternehmens und deiner Leistungen (max. 160 Zeichen)"
          maxLength={descriptionMaxLength}
        ></textarea>
        <div 
          className="character-count" 
          style={{ color: getDescriptionCharCountColor() }}
        >
          {descriptionRemainingChars} Zeichen übrig
        </div>
      </div>
      
      <div className="form-group priority-medium">
        <Tooltip content="Schlüsselwörter helfen Suchmaschinen, den Inhalt deiner Website zu verstehen. Trenne mehrere Begriffe mit Kommas.">
          <label>Schlüsselwörter</label>
        </Tooltip>
        <input
          type="text"
          value={content.seo?.keywords || ''}
          onChange={(e) => handleChange('keywords', e.target.value)}
          placeholder="z.B. Sanitär, Heizung, Klima, Berlin, Notdienst"
        />
      </div>
      
      <div className="seo-preview">
        <h4>Vorschau in Suchergebnissen</h4>
        <div className="search-result-preview">
          <div className="search-title">{content.seo?.title || content.title || 'Seitentitel'}</div>
          <div className="search-url">www.deine-website.de</div>
          <div className="search-description">
            {content.seo?.description || content.description || 'Keine Beschreibung vorhanden.'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SEOEditor;
