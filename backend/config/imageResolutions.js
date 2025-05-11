/**
 * Konfiguration für Bildauflösungen
 * Definiert die verschiedenen Auflösungen für hochgeladene Bilder
 */

module.exports = {
  // Thumbnail-Größe für Vorschaubilder
  thumbnail: {
    width: 150,
    height: 150,
    quality: 80
  },
  
  // Mittlere Größe für Galerieansichten
  medium: {
    width: 600,
    height: 400,
    quality: 85
  },
  
  // Große Größe für Detailansichten
  large: {
    width: 1200,
    height: 800,
    quality: 90
  },
  
  // Volle Größe für Downloads (behält Originalgröße bei, komprimiert nur)
  full: {
    quality: 95
  }
};
