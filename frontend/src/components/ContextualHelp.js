import React, { useState, useEffect } from 'react';

const ContextualHelp = ({ currentSection, userType }) => {
  const [helpContent, setHelpContent] = useState(null);
  const [showHelp, setShowHelp] = useState(false);

  const helpContentMap = {
    'template-selection': {
      'electrician': {
        title: 'Template für Elektriker',
        content: 'Wählen Sie ein Template, das Ihre elektrischen Dienstleistungen optimal präsentiert.',
        tips: [
          'Achten Sie auf eine klare Darstellung Ihrer Leistungen',
          'Fügen Sie Bilder von erfolgreichen Projekten hinzu',
          'Hervorheben Sie Ihre Zertifizierungen'
        ],
        templates: [
          {
            name: 'Elektro-Profi',
            features: ['Notfall-Service', 'Zertifizierungen', 'Projekt-Galerie']
          },
          {
            name: 'Elektro-Expert',
            features: ['Leistungskatalog', 'Online-Terminbuchung', 'Kundenbewertungen']
          }
        ]
      },
      'plumber': {
        title: 'Template für Installateure',
        content: 'Finden Sie das perfekte Template für Ihre Installationsarbeiten.',
        tips: [
          'Zeigen Sie Ihre Notfallbereitschaft',
          'Präsentieren Sie Ihre Dienstleistungsgebiete',
          'Hervorheben Sie Ihre Erfahrung'
        ],
        templates: [
          {
            name: 'Sanitär-Plus',
            features: ['24/7 Notdienst', 'Service-Gebiete', 'Referenzen']
          },
          {
            name: 'Heizungs-Expert',
            features: ['Heizungsberatung', 'Energieberatung', 'Online-Kalkulator']
          }
        ]
      }
    }
  };

  useEffect(() => {
    if (currentSection && userType && helpContentMap[currentSection]?.[userType]) {
      setHelpContent(helpContentMap[currentSection][userType]);
    }
  }, [currentSection, userType]);

  if (!helpContent) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setShowHelp(!showHelp)}
        className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700"
      >
        <i className="fas fa-question"></i>
      </button>

      {showHelp && (
        <div className="absolute bottom-16 right-0 w-80 bg-white rounded-lg shadow-xl p-4">
          <h3 className="text-lg font-bold mb-2">{helpContent.title}</h3>
          <p className="text-gray-600 mb-4">{helpContent.content}</p>
          
          {/* Vorlagen */}
          {helpContent.templates && (
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Verfügbare Vorlagen:</h4>
              <div className="space-y-3">
                {helpContent.templates.map((template, index) => (
                  <div key={index} className="border rounded p-3">
                    <h5 className="font-medium">{template.name}</h5>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {template.features.map((feature, idx) => (
                        <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <ul className="list-disc list-inside text-sm text-gray-600">
            {helpContent.tips.map((tip, index) => (
              <li key={index} className="mb-2">{tip}</li>
            ))}
          </ul>
          <button
            onClick={() => setShowHelp(false)}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            Schließen
          </button>
        </div>
      )}
    </div>
  );
};

export default ContextualHelp; 