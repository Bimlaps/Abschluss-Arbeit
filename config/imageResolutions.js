/**
 * Konfiguration für Bildauflösungen basierend auf Layout-Typen
 * Definiert die optimalen Bildgrößen für verschiedene Bereiche der Website
 */
const imageResolutions = {
  'one-page': {
    hero: { 
      width: 1920, 
      height: 1080, 
      aspectRatio: '16:9',
      description: 'Großes Headerbild für die Startseite'
    },
    about: { 
      width: 800, 
      height: 600, 
      aspectRatio: '4:3',
      description: 'Bild für den Über-uns-Bereich'
    },
    gallery: { 
      width: 600, 
      height: 400, 
      aspectRatio: '3:2',
      description: 'Bilder für die Galerie'
    },
    logo: { 
      width: 200, 
      height: 80, 
      aspectRatio: '5:2',
      description: 'Firmenlogo'
    }
  },
  'multi-page': {
    hero: { 
      width: 1600, 
      height: 800, 
      aspectRatio: '2:1',
      description: 'Headerbild für die Startseite'
    },
    about: { 
      width: 600, 
      height: 600, 
      aspectRatio: '1:1',
      description: 'Quadratisches Bild für die Über-uns-Seite'
    },
    gallery: { 
      width: 800, 
      height: 600, 
      aspectRatio: '4:3',
      description: 'Bilder für die Galerie-Seite'
    },
    logo: { 
      width: 180, 
      height: 60, 
      aspectRatio: '3:1',
      description: 'Firmenlogo für die Navigation'
    }
  },
  'sidebar': {
    hero: { 
      width: 1200, 
      height: 800, 
      aspectRatio: '3:2',
      description: 'Headerbild für die Hauptseite'
    },
    about: { 
      width: 500, 
      height: 400, 
      aspectRatio: '5:4',
      description: 'Bild für den Über-uns-Bereich'
    },
    gallery: { 
      width: 400, 
      height: 300, 
      aspectRatio: '4:3',
      description: 'Kleinere Bilder für die Galerie'
    },
    logo: { 
      width: 160, 
      height: 60, 
      aspectRatio: '8:3',
      description: 'Firmenlogo für die Sidebar'
    }
  }
};

module.exports = imageResolutions;
