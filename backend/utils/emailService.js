const nodemailer = require('nodemailer');

/**
 * E-Mail-Service für Kontaktformulare und Benachrichtigungen
 */

// Konfiguriere den E-Mail-Transporter
const createTransporter = () => {
  // Prüfe, ob die Umgebungsvariablen für E-Mail vorhanden sind
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('E-Mail-Konfiguration fehlt. E-Mail-Funktionen sind deaktiviert.');
    return null;
  }
  
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

/**
 * Sendet eine E-Mail vom Kontaktformular
 * @param {Object} data - Kontaktformulardaten
 * @param {string} data.name - Name des Absenders
 * @param {string} data.email - E-Mail des Absenders
 * @param {string} data.phone - Telefonnummer des Absenders (optional)
 * @param {string} data.message - Nachricht
 * @param {string} data.recipient - E-Mail-Adresse des Empfängers
 * @returns {Promise<Object>} - Ergebnis des Sendevorgangs
 */
async function sendContactEmail(data) {
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      return { 
        success: false, 
        error: 'E-Mail-Konfiguration fehlt. E-Mail konnte nicht gesendet werden.' 
      };
    }
    
    const { name, email, phone, message, recipient } = data;
    
    // Validiere die Eingaben
    if (!name || !email || !message || !recipient) {
      return { 
        success: false, 
        error: 'Unvollständige Daten. Name, E-Mail, Nachricht und Empfänger sind erforderlich.' 
      };
    }
    
    // E-Mail an den Empfänger (Handwerker)
    const info = await transporter.sendMail({
      from: `"247Vitrine" <${process.env.EMAIL_USER}>`,
      to: recipient,
      subject: `Neue Anfrage von ${name} über deine Website`,
      html: `
        <h2>Neue Kontaktanfrage</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>E-Mail:</strong> ${email}</p>
        <p><strong>Telefon:</strong> ${phone || 'Nicht angegeben'}</p>
        <h3>Nachricht:</h3>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p>Diese Nachricht wurde über das Kontaktformular deiner 247Vitrine-Website gesendet.</p>
      `
    });
    
    // Bestätigungs-E-Mail an den Absender
    await transporter.sendMail({
      from: `"247Vitrine" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Deine Anfrage wurde erfolgreich übermittelt`,
      html: `
        <h2>Vielen Dank für deine Anfrage!</h2>
        <p>Hallo ${name},</p>
        <p>wir haben deine Nachricht erfolgreich übermittelt. Der Empfänger wird sich so bald wie möglich bei dir melden.</p>
        <h3>Deine Nachricht:</h3>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p>Dies ist eine automatisch generierte E-Mail. Bitte antworte nicht auf diese Nachricht.</p>
      `
    });
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
}

module.exports = { sendContactEmail };
