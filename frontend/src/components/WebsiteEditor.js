import React, { useState, useEffect } from 'react';

function WebsiteEditor() {
  const [content, setContent] = useState({
    title: 'Meine Handwerker-Website',
    description: 'Willkommen auf meiner Webseite',
    services: [
      { title: 'Service 1', description: 'Beschreibung Service 1' },
      { title: 'Service 2', description: 'Beschreibung Service 2' }
    ]
  });

  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [selectedColorScheme, setSelectedColorScheme] = useState(null);
  const [selectedFont, setSelectedFont] = useState('Arial'); // Standard-Schriftart
  const [previewDevice, setPreviewDevice] = useState('desktop'); // 'desktop' oder 'mobile'

  // Vorlagen für verschiedene Branchen
  const templates = [
    {
      id: 'handwerker',
      name: 'Handwerker',
      description: 'Ideal für Handwerksbetriebe',
      sections: ['Leistungen', 'Referenzen', 'Kontakt']
    },
    {
      id: 'dienstleister',
      name: 'Dienstleister',
      description: 'Perfekt für Beratungsunternehmen',
      sections: ['Services', 'Team', 'Kontakt']
    },
    {
      id: 'shop',
      name: 'Online-Shop',
      description: 'Für Einzelhändler und Verkäufer',
      sections: ['Produkte', 'Über uns', 'Kontakt']
    }
  ];

  // Design-Stile
  const designs = [
    {
      id: 'modern',
      name: 'Modern',
      description: 'Clean und minimalistisch',
      features: ['Große Bilder', 'Viel Weißraum', 'Sans-Serif Fonts']
    },
    {
      id: 'klassisch',
      name: 'Klassisch',
      description: 'Traditionell und seriös',
      features: ['Serif Fonts', 'Strukturiertes Layout', 'Zurückhaltende Farben']
    },
    {
      id: 'kreativ',
      name: 'Kreativ',
      description: 'Auffällig und einzigartig',
      features: ['Asymmetrisches Layout', 'Bold Typography', 'Dynamische Elemente']
    }
  ];

  // Farbschemas
  const colorSchemes = [
    {
      id: 'blau',
      name: 'Blau',
      colors: {
        primary: '#1E40AF',
        secondary: '#3B82F6',
        accent: '#60A5FA',
        background: '#F8FAFC'
      }
    },
    {
      id: 'gruen',
      name: 'Grün',
      colors: {
        primary: '#166534',
        secondary: '#22C55E',
        accent: '#4ADE80',
        background: '#F0FDF4'
      }
    },
    {
      id: 'warm',
      name: 'Warm',
      colors: {
        primary: '#9F1239',
        secondary: '#E11D48',
        accent: '#FB7185',
        background: '#FFF1F2'
      }
    }
  ];

  // Verfügbare Schriftarten
  const fonts = [
    { id: 'arial', name: 'Arial', style: 'Arial, sans-serif' },
    { id: 'georgia', name: 'Georgia', style: 'Georgia, serif' },
    { id: 'verdana', name: 'Verdana', style: 'Verdana, sans-serif' },
    { id: 'roboto', name: 'Roboto', style: 'Roboto, sans-serif' },
    { id: 'opensans', name: 'Open Sans', style: 'Open Sans, sans-serif' },
  ];

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

  const previewWidthClass = previewDevice === 'mobile' ? 'w-full max-w-sm mx-auto' : 'w-full';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Website erstellen</h1>
        
        {/* Vorlagen-Auswahl */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">1. Vorlage auswählen</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {templates.map((template) => (
              <div
                key={template.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedTemplate?.id === template.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => setSelectedTemplate(template)}
              >
                <h3 className="font-medium">{template.name}</h3>
                <p className="text-sm text-gray-600">{template.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Design-Auswahl */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">2. Design wählen</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {designs.map((design) => (
              <div
                key={design.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedDesign?.id === design.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => setSelectedDesign(design)}
              >
                <h3 className="font-medium">{design.name}</h3>
                <p className="text-sm text-gray-600">{design.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Farbschema-Auswahl */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">3. Farbschema wählen</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {colorSchemes.map((scheme) => (
              <div
                key={scheme.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedColorScheme?.id === scheme.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => setSelectedColorScheme(scheme)}
              >
                <h3 className="font-medium">{scheme.name}</h3>
                <div className="flex gap-2 mt-2">
                  {Object.entries(scheme.colors).map(([key, color]) => (
                    <div
                      key={key}
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: color }}
                      title={`${key}: ${color}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Schriftart-Auswahl */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">4. Schriftart wählen</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {fonts.map((font) => (
              <div
                key={font.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedFont === font.style ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                onClick={() => setSelectedFont(font.style)}
                style={{ fontFamily: font.style }}
              >
                <h3 className="font-medium">{font.name}</h3>
                <p className="text-sm text-gray-600">Beispieltext mit dieser Schriftart.</p>
              </div>
            ))}
          </div>
        </div>

        {/* Vorschau */}        
        {selectedTemplate && selectedDesign && selectedColorScheme && selectedFont && (
          <div className="mt-8 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Vorschau</h2>
            
            {/* Geräte-Ansicht Umschalter */}
            <div className="mb-4 flex justify-center space-x-4">
              <button
                className={`px-4 py-2 rounded ${previewDevice === 'desktop' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                onClick={() => setPreviewDevice('desktop')}
              >
                Desktop
              </button>
              <button
                className={`px-4 py-2 rounded ${previewDevice === 'mobile' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                onClick={() => setPreviewDevice('mobile')}
              >
                Mobile
              </button>
            </div>

            {/* Vorschau-Container */}            
            <div className={`border rounded-lg overflow-hidden ${previewWidthClass}`} style={{ backgroundColor: selectedColorScheme.colors.background, fontFamily: selectedFont }}>
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold" style={{ color: selectedColorScheme.colors.primary, fontFamily: selectedFont }}>
                  {content.title}
                </h1>
                <p className="mt-2" style={{ color: selectedColorScheme.colors.secondary, fontFamily: selectedFont }}>
                  {content.description}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.services.map((service, index) => (
                  <div 
                    key={index} 
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: selectedColorScheme.colors.accent + '20', fontFamily: selectedFont }}
                  >
                    <h3 className="font-bold" style={{ color: selectedColorScheme.colors.primary, fontFamily: selectedFont }}>
                      {service.title}
                    </h3>
                    <p className="mt-2" style={{ color: selectedColorScheme.colors.secondary, fontFamily: selectedFont }}>
                      {service.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Website erstellen
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default WebsiteEditor; 