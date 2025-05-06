const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

/**
 * Generiert einen QR-Code für eine Website und speichert ihn als Bild
 * @param {string} websiteId - Die ID der Website
 * @param {string} subdomain - Die Subdomain der Website
 * @param {Object} businessCard - Die Daten der digitalen Visitenkarte
 * @returns {Promise<string>} - Der Pfad zum generierten QR-Code-Bild
 */
async function generateQRCode(websiteId, subdomain, businessCard) {
  try {
    // Erstelle den Ordner für QR-Codes, falls er nicht existiert
    const qrCodeDir = path.join(__dirname, '../public/qrcodes');
    if (!fs.existsSync(qrCodeDir)) {
      fs.mkdirSync(qrCodeDir, { recursive: true });
    }

    // Erstelle den Dateinamen für den QR-Code
    const fileName = `${websiteId}.png`;
    const filePath = path.join(qrCodeDir, fileName);
    
    // Erstelle die URL für die Visitenkarte
    const url = `https://${subdomain}.247vitrine.com/card`;
    
    // Generiere den QR-Code
    await QRCode.toFile(filePath, url, {
      color: {
        dark: '#000000',
        light: '#ffffff'
      },
      width: 300,
      margin: 1
    });
    
    // Gib den relativen Pfad zum QR-Code zurück
    return `/qrcodes/${fileName}`;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
}

module.exports = { generateQRCode };
