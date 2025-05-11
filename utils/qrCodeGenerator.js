const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

/**
 * Generiert einen QR-Code für eine digitale Visitenkarte
 * @param {string} websiteId - ID der Website
 * @param {string} subdomain - Subdomain der Website
 * @param {Object} businessCard - Visitenkartendaten
 * @returns {Promise<string>} - URL des generierten QR-Codes
 */
exports.generateQRCode = async (websiteId, subdomain, businessCard) => {
  try {
    // Stelle sicher, dass das Verzeichnis existiert
    const qrCodeDir = path.join(__dirname, '..', 'public', 'qrcodes');
    if (!fs.existsSync(qrCodeDir)) {
      fs.mkdirSync(qrCodeDir, { recursive: true });
    }

    // Erstelle einen eindeutigen Dateinamen
    const fileName = `qrcode-${websiteId}-${Date.now()}.png`;
    const filePath = path.join(qrCodeDir, fileName);

    // Erstelle vCard-Daten
    const vCardData = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${businessCard.contactPerson || ''}`,
      `ORG:${businessCard.companyName || ''}`,
      `TITLE:${businessCard.position || ''}`,
      `TEL;TYPE=WORK,VOICE:${businessCard.phone || ''}`,
      `EMAIL;TYPE=WORK:${businessCard.email || ''}`,
      `ADR;TYPE=WORK:;;${businessCard.address || ''}`,
      `URL:${businessCard.website || `https://${subdomain}.247vitrine.ma`}`,
      'END:VCARD'
    ].join('\\n');

    // Generiere den QR-Code
    await QRCode.toFile(filePath, vCardData, {
      errorCorrectionLevel: 'H',
      type: 'png',
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });

    // Gib die URL des QR-Codes zurück
    return `/qrcodes/${fileName}`;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};
