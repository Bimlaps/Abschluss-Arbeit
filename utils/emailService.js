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
 * Sendet eine E-Mail
 * @param {Object} options - E-Mail-Optionen
 * @param {string} options.to - Empfänger
 * @param {string} options.subject - Betreff
 * @param {string} options.text - Text-Version der E-Mail
 * @param {string} options.html - HTML-Version der E-Mail
 * @returns {Promise<Object>} - Ergebnis des Sendevorgangs
 */
exports.sendEmail = async (options) => {
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      console.warn('E-Mail-Transporter nicht konfiguriert. E-Mail wird nicht gesendet.');
      return { success: false, error: 'E-Mail-Dienst nicht konfiguriert' };
    }
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('E-Mail gesendet:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Fehler beim Senden der E-Mail:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Sendet eine Kontaktformular-E-Mail
 * @param {Object} data - Kontaktformular-Daten
 * @param {string} data.name - Name des Absenders
 * @param {string} data.email - E-Mail des Absenders
 * @param {string} data.phone - Telefonnummer des Absenders (optional)
 * @param {string} data.message - Nachricht
 * @param {string} data.recipient - Empfänger-E-Mail-Adresse
 * @returns {Promise<Object>} - Ergebnis des Sendevorgangs
 */
exports.sendContactEmail = async (data) => {
  const { name, email, phone, message, recipient } = data;
  
  const subject = `Neue Kontaktanfrage von ${name}`;
  
  const text = `
    Neue Kontaktanfrage von Ihrer Website:
    
    Name: ${name}
    E-Mail: ${email}
    Telefon: ${phone || 'Nicht angegeben'}
    
    Nachricht:
    ${message}
  `;
  
  const html = `
    <h2>Neue Kontaktanfrage von Ihrer Website</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>E-Mail:</strong> ${email}</p>
    <p><strong>Telefon:</strong> ${phone || 'Nicht angegeben'}</p>
    <h3>Nachricht:</h3>
    <p>${message.replace(/\n/g, '<br>')}</p>
  `;
  
  return await exports.sendEmail({
    to: recipient,
    subject,
    text,
    html
  });
};
