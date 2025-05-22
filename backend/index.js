const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const compression = require('compression');
const { rateLimit } = require('express-rate-limit');
const { logger, expressLogger } = require('./config/logger');
const { metricsMiddleware, getMetrics } = require('./config/metrics');
const authController = require('./controllers/authController');
const { authenticate, authorize } = require('./middleware/auth');
const { sendEmail } = require('./utils/emailService');

// Routen importieren
const adminRoutes = require('./routes/adminRoutes');

// Modelle importieren
const Layout = require('./models/Layout');
const Design = require('./models/Design');
const ColorScheme = require('./models/ColorScheme');
const Website = require('./models/Website');
const Template = require('./models/Template');
const User = require('./models/User');

// Umgebungsvariablen laden
dotenv.config();

// Express-App erstellen
const app = express();
const PORT = process.env.PORT || 3001;

// Sicherheits-Middleware
app.use(helmet());
app.use(compression());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minuten
  max: 100 // Limit jede IP auf 100 Requests pro Fenster
});
app.use(limiter);

// Logging & Monitoring Middleware
app.use(expressLogger);
app.use(metricsMiddleware);

// Metrics Endpoint
app.get('/metrics', getMetrics);

// Middleware
app.use(cors({
  origin: '*', // Erlaubt Anfragen von allen Ursprüngen
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));
app.use(express.json());

// Statische Dateien bereitstellen
// Wichtig: Die Reihenfolge ist entscheidend!
// Zuerst die expliziten Routen definieren, dann die statischen Middleware-Funktionen
app.use('/static', express.static(path.join(__dirname, 'public')));

// Explizite Routen für HTML-Dateien
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/dashboard.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/register.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/preview.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'preview.html'));
});

app.get('/website-builder.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'website-builder.html'));
});

app.get('/test.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'test.html'));
});

// MongoDB-Verbindung
console.log('Connecting to MongoDB with URI:', process.env.MONGODB_URI ? 'URI from .env file' : 'Fallback URI');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://247vitrine-db:l9dyz9HhhejrP23ztH7LsVetUjNJuT6duzLoVwqhhRZMZWHA85vhcQWUYtOFt9iAj0tZY5IMfLxRACDbDfZgcA==@247vitrine-db.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@247vitrine-db@', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  logger.info('MongoDB connected successfully');
})
.catch(err => {
  logger.error('MongoDB connection error:', err);

  // Versuche, mit lokaler MongoDB zu verbinden, wenn die Azure-Verbindung fehlschlägt
  logger.info('Attempting to connect to local MongoDB...');
  return mongoose.connect('mongodb://localhost:27017/247vitrine', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => logger.info('Connected to local MongoDB successfully'))
  .catch(localErr => logger.error('Local MongoDB connection error:', localErr));
});

// Auth-Routen
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);
app.get('/api/auth/me', authenticate, authController.getMe);

// Admin-Routen registrieren
app.use('/api/admin', adminRoutes);

// Layout-Routen
app.get('/api/layouts', async (req, res) => {
  try {
    const layouts = await Layout.find();
    res.json(layouts);
  } catch (error) {
    console.error('Error fetching layouts:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Design-Routen
app.get('/api/designs', async (req, res) => {
  try {
    const designs = await Design.find().populate('layout');
    res.json(designs);
  } catch (error) {
    console.error('Error fetching designs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/designs/by-layout/:layoutId', async (req, res) => {
  try {
    const designs = await Design.find({ layout: req.params.layoutId }).populate('layout');
    res.json(designs);
  } catch (error) {
    console.error('Error fetching designs by layout:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Designs nach Layout-Kategorie abrufen
app.get('/api/designs/by-category/:category', async (req, res) => {
  try {
    // Finde zuerst alle Layouts mit der angegebenen Kategorie
    const layouts = await Layout.find({ category: req.params.category });

    // Sammle alle Layout-IDs
    const layoutIds = layouts.map(layout => layout._id);

    // Finde alle Designs, die zu diesen Layouts gehören
    const designs = await Design.find({ layout: { $in: layoutIds } }).populate('layout');

    res.json(designs);
  } catch (error) {
    console.error('Error fetching designs by layout category:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Farbschema-Routen
app.get('/api/color-schemes', async (req, res) => {
  try {
    const colorSchemes = await ColorScheme.find();
    res.json(colorSchemes);
  } catch (error) {
    console.error('Error fetching color schemes:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Template-Routen
app.get('/api/templates', async (req, res) => {
  try {
    const user = req.user;
    let query = {};

    // Wenn der Benutzer ein Kunde ist, nur öffentliche Templates anzeigen
    if (user && user.role === 'customer') {
      query.isPublic = true;
    }

    const templates = await Template.find(query);
    res.json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/templates/:id', async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    res.json(template);
  } catch (error) {
    console.error('Error fetching template:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/templates', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const template = new Template(req.body);
    await template.save();
    res.status(201).json(template);
  } catch (error) {
    console.error('Error creating template:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/templates/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const template = await Template.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    res.json(template);
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/templates/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const template = await Template.findByIdAndDelete(req.params.id);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    res.json({ message: 'Template deleted successfully' });
  } catch (error) {
    console.error('Error deleting template:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// QR-Code-Generator importieren
const { generateQRCode } = require('./utils/qrCodeGenerator');

// Upload-Controller importieren
const { upload, processImage } = require('./controllers/uploadController');

// Sitemap-Generator importieren
const { generateSitemap } = require('./utils/sitemapGenerator');

// E-Mail-Service importieren
const { sendContactEmail } = require('./utils/emailService');

// Kontaktformular-Template importieren
const { generateContactForm } = require('./templates/contactForm');

/**
 * Generiert HTML für die Live-Vorschau einer Website
 * @param {Object} content - Website-Inhalte
 * @param {Object} layout - Ausgewähltes Layout
 * @param {Object} design - Ausgewähltes Design
 * @param {Object} colorScheme - Ausgewähltes Farbschema
 * @returns {string} - Generiertes HTML
 */
function generatePreviewHTML(content, layout, design, colorScheme) {
  // Fallback-Werte, falls keine Komponenten ausgewählt wurden
  const layoutStructure = layout ? JSON.parse(layout.structure) : {
    header: true,
    hero: true,
    about: true,
    services: true,
    contact: true,
    footer: true
  };

  const designCSS = design ? design.css : '';
  const designJS = design ? design.js : '';

  const colors = colorScheme ? {
    primary: colorScheme.primary,
    secondary: colorScheme.secondary,
    accent: colorScheme.accent,
    text: colorScheme.text,
    background: colorScheme.background
  } : {
    primary: '#0284c7',
    secondary: '#0ea5e9',
    accent: '#38bdf8',
    text: '#333333',
    background: '#ffffff'
  };

  // Generiere das HTML
  return `
    <!DOCTYPE html>
    <html lang="de">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${content.title || 'Website-Vorschau'}</title>
      <style>
        :root {
          --primary-color: ${colors.primary};
          --secondary-color: ${colors.secondary};
          --accent-color: ${colors.accent};
          --text-color: ${colors.text};
          --background-color: ${colors.background};
        }

        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          color: var(--text-color);
          background-color: var(--background-color);
          margin: 0;
          padding: 0;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        header {
          background-color: var(--primary-color);
          color: white;
          padding: 20px 0;
        }

        .logo {
          font-size: 24px;
          font-weight: bold;
        }

        .hero {
          background-color: var(--secondary-color);
          color: white;
          padding: 60px 0;
          text-align: center;
        }

        .hero h1 {
          font-size: 36px;
          margin-bottom: 20px;
        }

        .hero p {
          font-size: 18px;
          max-width: 800px;
          margin: 0 auto;
        }

        section {
          padding: 60px 0;
        }

        h2 {
          color: var(--primary-color);
          margin-bottom: 30px;
        }

        .about-content {
          display: flex;
          flex-wrap: wrap;
          gap: 30px;
        }

        .about-text {
          flex: 1;
          min-width: 300px;
        }

        .about-image {
          flex: 1;
          min-width: 300px;
        }

        .about-image img {
          max-width: 100%;
          border-radius: 8px;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 30px;
        }

        .service-card {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          padding: 20px;
        }

        .service-card h3 {
          color: var(--primary-color);
          margin-top: 0;
        }

        .contact {
          background-color: var(--secondary-color);
          color: white;
          padding: 60px 0;
        }

        .contact-info {
          display: flex;
          flex-wrap: wrap;
          gap: 30px;
          margin-top: 30px;
        }

        .contact-details {
          flex: 1;
          min-width: 300px;
        }

        .contact-form-container {
          flex: 2;
          min-width: 300px;
        }

        .contact-form {
          background-color: white;
          border-radius: 12px;
          padding: 30px;
          color: var(--text-color);
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
          max-width: 600px;
          margin: 0 auto;
        }

        .contact-form h3 {
          color: var(--primary-color);
          margin-top: 0;
          margin-bottom: 20px;
          font-size: 22px;
          text-align: center;
          border-bottom: 2px solid var(--primary-color);
          padding-bottom: 10px;
        }

        .contact-form .form-group {
          margin-bottom: 25px;
        }

        .contact-form label {
          display: block;
          margin-bottom: 8px;
          font-weight: bold;
          color: var(--primary-color);
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .contact-form input,
        .contact-form textarea {
          width: 100%;
          padding: 12px 15px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          font-family: inherit;
          font-size: 16px;
          transition: border-color 0.3s, box-shadow 0.3s;
          background-color: #f9f9f9;
        }

        .contact-form input:focus,
        .contact-form textarea:focus {
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.2);
          outline: none;
          background-color: white;
        }

        .contact-form textarea {
          height: 150px;
          resize: vertical;
        }

        .contact-form .submit-button {
          background-color: var(--primary-color);
          color: white;
          border: none;
          border-radius: 8px;
          padding: 14px 24px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
          display: block;
          width: 100%;
          max-width: 250px;
          margin: 0 auto;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .contact-form .submit-button:hover {
          background-color: var(--secondary-color);
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        .contact-form .submit-button:active {
          transform: translateY(0);
        }

        .contact-form .submit-button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .contact-form .success-message {
          background-color: #d4edda;
          color: #155724;
          padding: 15px;
          border-radius: 4px;
          margin-bottom: 20px;
        }

        .contact-form .error-message {
          background-color: #f8d7da;
          color: #721c24;
          padding: 15px;
          border-radius: 4px;
          margin-top: 20px;
        }

        footer {
          background-color: #333;
          color: white;
          text-align: center;
          padding: 20px 0;
        }

        /* Galerie Styles */
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
          margin-top: 30px;
        }

        .gallery-item {
          position: relative;
          overflow: hidden;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .gallery-item img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .gallery-item:hover img {
          transform: scale(1.05);
        }

        .gallery-caption {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: rgba(0,0,0,0.7);
          color: white;
          padding: 10px;
          transform: translateY(100%);
          transition: transform 0.3s ease;
        }

        .gallery-item:hover .gallery-caption {
          transform: translateY(0);
        }

        /* Visitenkarte Styles */
        .business-card {
          background-color: var(--secondary-color);
          color: white;
          padding: 40px 0;
        }

        .card-container {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          background-color: white;
          color: var(--text-color);
          border-radius: 10px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          padding: 30px;
          margin-top: 30px;
        }

        .card-info {
          flex: 1;
          min-width: 250px;
          padding-right: 20px;
        }

        .card-qr {
          text-align: center;
          padding: 20px;
        }

        .card-qr img {
          max-width: 150px;
          margin-bottom: 10px;
        }

        /* Social Media Links */
        .social-links {
          margin-top: 20px;
          display: flex;
          justify-content: center;
          gap: 15px;
        }

        .social-icon {
          display: inline-block;
          color: white;
          text-decoration: none;
          padding: 8px 15px;
          border-radius: 4px;
          background-color: var(--accent-color);
          transition: background-color 0.3s ease;
        }

        .social-icon:hover {
          background-color: var(--primary-color);
        }

        /* Responsive Styles */
        @media (max-width: 768px) {
          .about-content {
            flex-direction: column;
          }

          .services-grid {
            grid-template-columns: 1fr;
          }
        }

        ${designCSS}
      </style>
    </head>
    <body>
      ${layoutStructure.header ? `
        <header>
          <div class="container">
            <div class="logo">
              ${content.title || 'Meine Website'}
            </div>
          </div>
        </header>
      ` : ''}

      ${layoutStructure.hero ? `
        <section class="hero">
          <div class="container">
            <h1>${content.hero?.title || 'Willkommen auf meiner Website'}</h1>
            <p>${content.hero?.subtitle || 'Hier finden Sie alle Informationen zu meinen Dienstleistungen.'}</p>
          </div>
        </section>
      ` : ''}

      ${layoutStructure.about ? `
        <section class="about">
          <div class="container">
            <h2>${content.about?.title || 'Über uns'}</h2>
            <div class="about-content">
              <div class="about-text">
                <p>${content.about?.text || 'Hier steht ein Text über das Unternehmen und seine Geschichte.'}</p>
              </div>
              ${content.about?.image ? `
                <div class="about-image">
                  <img src="${content.about.image}" alt="Über uns">
                </div>
              ` : ''}
            </div>
          </div>
        </section>
      ` : ''}

      ${layoutStructure.services ? `
        <section class="services">
          <div class="container">
            <h2>Unsere Leistungen</h2>
            <div class="services-grid">
              ${content.services && content.services.length > 0 ?
                content.services.map(service => `
                  <div class="service-card">
                    <h3>${service.title}</h3>
                    <p>${service.description}</p>
                  </div>
                `).join('') :
                `
                  <div class="service-card">
                    <h3>Leistung 1</h3>
                    <p>Beschreibung der ersten Leistung.</p>
                  </div>
                  <div class="service-card">
                    <h3>Leistung 2</h3>
                    <p>Beschreibung der zweiten Leistung.</p>
                  </div>
                  <div class="service-card">
                    <h3>Leistung 3</h3>
                    <p>Beschreibung der dritten Leistung.</p>
                  </div>
                `
              }
            </div>
          </div>
        </section>
      ` : ''}

      ${layoutStructure.gallery && content.gallery && content.gallery.length > 0 ? `
        <section class="gallery">
          <div class="container">
            <h2>Galerie</h2>
            <div class="gallery-grid">
              ${content.gallery.map(item => `
                <div class="gallery-item">
                  <img src="${item.imageUrl}" alt="${item.title}">
                  <div class="gallery-caption">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </section>
      ` : ''}

      ${layoutStructure.contact ? `
        <section class="contact">
          <div class="container">
            <h2>Kontakt</h2>
            <div class="contact-info">
              <div class="contact-details">
                <p><strong>Email:</strong> ${content.contact?.email || 'info@example.com'}</p>
                <p><strong>Telefon:</strong> ${content.contact?.phone || '+49 123 456789'}</p>
                <p><strong>Adresse:</strong> ${content.contact?.address || 'Musterstraße 123, 12345 Musterstadt'}</p>
              </div>
              <div class="contact-form-container">
                ${generateContactForm(content.contact?.email || 'info@example.com')}
              </div>
            </div>
          </div>
        </section>
      ` : ''}

      ${content.businessCard && content.businessCard.companyName ? `
        <section class="business-card">
          <div class="container">
            <h2>Digitale Visitenkarte</h2>
            <div class="card-container">
              <div class="card-info">
                <h3>${content.businessCard.companyName}</h3>
                <p>${content.businessCard.contactPerson}</p>
                <p>${content.businessCard.position}</p>
                <p>${content.businessCard.address}</p>
                <p>Tel: ${content.businessCard.phone}</p>
                <p>Email: ${content.businessCard.email}</p>
                <p>Web: ${content.businessCard.website || 'www.example.com'}</p>
              </div>
              ${content.businessCard.qrCodeUrl ? `
                <div class="card-qr">
                  <img src="${content.businessCard.qrCodeUrl}" alt="QR-Code">
                  <p>Scannen Sie den QR-Code für meine Kontaktdaten</p>
                </div>
              ` : ''}
            </div>
          </div>
        </section>
      ` : ''}

      ${layoutStructure.footer ? `
        <footer>
          <div class="container">
            <p>&copy; ${new Date().getFullYear()} ${content.title || 'Meine Website'}. Alle Rechte vorbehalten.</p>

            ${content.socialMedia ? `
            <div class="social-links">
              ${content.socialMedia.facebook ? `<a href="${content.socialMedia.facebook}" target="_blank" class="social-icon">Facebook</a>` : ''}
              ${content.socialMedia.instagram ? `<a href="${content.socialMedia.instagram}" target="_blank" class="social-icon">Instagram</a>` : ''}
              ${content.socialMedia.linkedin ? `<a href="${content.socialMedia.linkedin}" target="_blank" class="social-icon">LinkedIn</a>` : ''}
              ${content.socialMedia.xing ? `<a href="${content.socialMedia.xing}" target="_blank" class="social-icon">Xing</a>` : ''}
              ${content.socialMedia.youtube ? `<a href="${content.socialMedia.youtube}" target="_blank" class="social-icon">YouTube</a>` : ''}
              ${content.socialMedia.twitter ? `<a href="${content.socialMedia.twitter}" target="_blank" class="social-icon">Twitter</a>` : ''}
            </div>
            ` : ''}
          </div>
        </footer>
      ` : ''}

      <script>
        ${designJS}
      </script>
    </body>
    </html>
  `;
}

// Bild-Upload-Route
app.post('/api/upload-image', authenticate, upload.single('image'), processImage);

// Bildauflösungs-Route
app.get('/api/image-resolutions/:layoutType/:imageType', (req, res) => {
  const { layoutType, imageType } = req.params;
  const imageResolutions = require('./config/imageResolutions');

  if (imageResolutions[layoutType] && imageResolutions[layoutType][imageType]) {
    res.json(imageResolutions[layoutType][imageType]);
  } else {
    res.status(404).json({ message: 'Bildauflösung nicht gefunden' });
  }
});

// Kontaktformular-Route
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, message, recipient } = req.body;

    // Validiere die Eingaben
    if (!name || !email || !message || !recipient) {
      return res.status(400).json({
        success: false,
        message: 'Unvollständige Daten. Name, E-Mail, Nachricht und Empfänger sind erforderlich.'
      });
    }

    // Validiere E-Mail-Format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Ungültige E-Mail-Adresse.'
      });
    }

    // Sende die E-Mail
    const result = await sendContactEmail({ name, email, phone, message, recipient });

    if (result.success) {
      res.json({ success: true, message: 'Nachricht erfolgreich gesendet.' });
    } else {
      res.status(500).json({
        success: false,
        message: 'Fehler beim Senden der Nachricht.',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Verarbeiten des Kontaktformulars.'
    });
  }
});

// Live-Vorschau-Route
app.post('/api/preview', async (req, res) => {
  try {
    const { content, layout: layoutId, design: designId, colorScheme: colorSchemeId } = req.body;

    // Lade die ausgewählten Komponenten
    let layout, design, colorScheme;

    if (layoutId) {
      layout = await Layout.findById(layoutId);
    }

    if (designId) {
      design = await Design.findById(designId);
    }

    if (colorSchemeId) {
      colorScheme = await ColorScheme.findById(colorSchemeId);
    }

    // Generiere das HTML für die Vorschau
    const html = generatePreviewHTML(content, layout, design, colorScheme);

    res.json({ success: true, html });
  } catch (error) {
    console.error('Error generating preview:', error);
    res.status(500).json({ success: false, message: 'Fehler bei der Generierung der Vorschau' });
  }
});

// Website-Routen
app.get('/api/websites', authenticate, async (req, res) => {
  try {
    let websites;

    // Wenn der Benutzer ein Admin ist, alle Websites anzeigen
    // Wenn der Benutzer ein Kunde ist, nur seine eigenen Websites anzeigen
    if (req.user.role === 'admin') {
      websites = await Website.find()
        .populate('layout')
        .populate('design')
        .populate('colorScheme')
        .populate('owner', 'firstName lastName email');
    } else {
      websites = await Website.find({ owner: req.user.id })
        .populate('layout')
        .populate('design')
        .populate('colorScheme');
    }

    res.json(websites);
  } catch (error) {
    console.error('Error fetching websites:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/websites/:id', authenticate, async (req, res) => {
  try {
    const website = await Website.findById(req.params.id)
      .populate('layout')
      .populate('design')
      .populate('colorScheme');

    if (!website) {
      return res.status(404).json({ message: 'Website not found' });
    }

    // Prüfen, ob der Benutzer Zugriff auf die Website hat
    if (req.user.role !== 'admin' && website.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    res.json(website);
  } catch (error) {
    console.error('Error fetching website:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/websites', authenticate, async (req, res) => {
  try {
    // Prüfen, ob die neue Website eine Demo-Website ist
    const isDemo = req.body.isDemo || false;
    const isPublished = req.body.published || false;

    // Wenn es eine veröffentlichte Website sein soll (nicht Demo)
    if (isPublished && !isDemo) {
      // Prüfen, ob bereits eine veröffentlichte Website existiert
      const publishedWebsites = await Website.find({
        owner: req.user.id,
        published: true,
        isDemo: { $ne: true }
      });

      if (publishedWebsites.length >= 1) {
        return res.status(403).json({
          message: 'Sie können nur eine veröffentlichte Website haben. Bitte bearbeiten oder löschen Sie Ihre bestehende Website.'
        });
      }
    }

    // Wenn es eine Demo-Website sein soll
    if (isDemo) {
      // Prüfen, ob bereits eine Demo-Website existiert
      const demoWebsites = await Website.find({
        owner: req.user.id,
        isDemo: true
      });

      if (demoWebsites.length >= 1) {
        return res.status(403).json({
          message: 'Sie können nur eine Demo-Website haben. Bitte bearbeiten oder löschen Sie Ihre bestehende Demo-Website.'
        });
      }
    }

    const website = new Website({
      ...req.body,
      owner: req.user.id, // Besitzer setzen
      isDemo: isDemo
    });

    // Wenn eine digitale Visitenkarte vorhanden ist, generiere einen QR-Code
    // (Bei der Erstellung gibt es noch keinen existierenden QR-Code)
    if (website.content.businessCard && website.content.businessCard.companyName) {
      try {
        console.log('Generiere QR-Code für neue Website:', website._id);
        const qrCodeUrl = await generateQRCode(
          website._id,
          website.subdomain,
          website.content.businessCard
        );
        website.content.businessCard.qrCodeUrl = qrCodeUrl;
        console.log('QR-Code generiert:', qrCodeUrl);
      } catch (qrError) {
        console.error('Error generating QR code:', qrError);
        // Fahre fort, auch wenn der QR-Code nicht generiert werden konnte
      }
    }

    await website.save();

    // Website zum Benutzer hinzufügen
    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { websites: website._id } }
    );

    // Aktualisiere die Sitemap
    updateSitemap();

    res.status(201).json(website);
  } catch (error) {
    console.error('Error creating website:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/websites/:id', authenticate, async (req, res) => {
  try {
    const website = await Website.findById(req.params.id);

    if (!website) {
      return res.status(404).json({ message: 'Website not found' });
    }

    // Prüfen, ob der Benutzer Zugriff auf die Website hat
    if (req.user.role !== 'admin' && website.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Prüfen, ob der Status (Demo/Veröffentlicht) geändert wurde
    const isChangingToDemo = !website.isDemo && req.body.isDemo;
    const isChangingFromDemo = website.isDemo && !req.body.isDemo;
    const isChangingToPublished = !website.published && req.body.published;

    // Wenn der Veröffentlichungsstatus geändert wird oder die Website bereits veröffentlicht ist
    if (isChangingToPublished || req.body.published) {
      const existingWebsites = await Website.find({
        owner: req.user.id,
        _id: { $ne: req.params.id }, // Alle Websites außer der aktuellen
        published: true,
        isDemo: { $ne: true } // Keine Demo-Websites
      });

      // Wenn bereits eine veröffentlichte Website existiert
      if (existingWebsites.length >= 1) {
        return res.status(403).json({
          message: 'Sie können nur eine veröffentlichte Website haben. Bitte bearbeiten oder löschen Sie Ihre bestehende Website.'
        });
      }
    }

    // Wenn der Demo-Status geändert wird
    if (isChangingToDemo) {
      const existingDemoWebsites = await Website.find({
        owner: req.user.id,
        _id: { $ne: req.params.id }, // Alle Websites außer der aktuellen
        isDemo: true
      });

      // Wenn bereits eine Demo-Website existiert
      if (existingDemoWebsites.length >= 1) {
        return res.status(403).json({
          message: 'Sie können nur eine Demo-Website haben. Bitte bearbeiten oder löschen Sie Ihre bestehende Demo-Website.'
        });
      }
    }

    // Wenn eine digitale Visitenkarte vorhanden ist
    if (req.body.content && req.body.content.businessCard && req.body.content.businessCard.companyName) {
      // Prüfe, ob bereits ein QR-Code existiert
      const existingQrCode = website.content?.businessCard?.qrCodeUrl;

      if (existingQrCode) {
        // Behalte den existierenden QR-Code bei
        console.log('Bestehender QR-Code wird beibehalten:', existingQrCode);
        req.body.content.businessCard.qrCodeUrl = existingQrCode;
      } else {
        // Nur wenn noch kein QR-Code existiert, generiere einen neuen
        try {
          console.log('Generiere neuen QR-Code für Website:', req.params.id);
          const qrCodeUrl = await generateQRCode(
            req.params.id,
            req.body.subdomain,
            req.body.content.businessCard
          );
          req.body.content.businessCard.qrCodeUrl = qrCodeUrl;
          console.log('Neuer QR-Code generiert:', qrCodeUrl);
        } catch (qrError) {
          console.error('Error generating QR code:', qrError);
          // Fahre fort, auch wenn der QR-Code nicht generiert werden konnte
        }
      }
    }

    const updatedWebsite = await Website.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    // Aktualisiere die Sitemap
    updateSitemap();

    res.json(updatedWebsite);
  } catch (error) {
    console.error('Error updating website:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/websites/:id', authenticate, async (req, res) => {
  try {
    const website = await Website.findById(req.params.id);

    if (!website) {
      return res.status(404).json({ message: 'Website not found' });
    }

    // Prüfen, ob der Benutzer Zugriff auf die Website hat
    if (req.user.role !== 'admin' && website.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await Website.findByIdAndDelete(req.params.id);

    // Aktualisiere die Sitemap
    updateSitemap();

    // Website aus der Liste des Benutzers entfernen
    await User.findByIdAndUpdate(
      website.owner,
      { $pull: { websites: website._id } }
    );

    res.json({ message: 'Website deleted successfully' });
  } catch (error) {
    console.error('Error deleting website:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Endpunkt zum expliziten Neuerstellen des QR-Codes
app.post('/api/websites/:id/regenerate-qrcode', authenticate, async (req, res) => {
  try {
    const website = await Website.findById(req.params.id);

    if (!website) {
      return res.status(404).json({ message: 'Website nicht gefunden' });
    }

    // Prüfen, ob der Benutzer Zugriff auf die Website hat
    if (req.user.role !== 'admin' && website.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Zugriff verweigert' });
    }

    // Prüfen, ob eine Visitenkarte existiert
    if (!website.content.businessCard || !website.content.businessCard.companyName) {
      return res.status(400).json({
        success: false,
        message: 'Keine Visitenkarte gefunden. Bitte erstellen Sie zuerst eine Visitenkarte.'
      });
    }

    // Speichere den alten QR-Code für die Dokumentation
    const oldQrCodeUrl = website.content.businessCard.qrCodeUrl;
    let documentationPath = '';

    // Wenn der alte QR-Code existiert und Dokumentation angefordert wurde
    if (oldQrCodeUrl && req.body.documentOldQrCode) {
      try {
        // Erstelle einen Dateinamen für die Dokumentation
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `qrcode-${website._id}-${timestamp}.pdf`;
        documentationPath = path.join(__dirname, 'public', 'qrcodes', fileName);

        // Stelle sicher, dass das Verzeichnis existiert
        await fs.promises.mkdir(path.join(__dirname, 'public', 'qrcodes'), { recursive: true });

        // Erstelle ein einfaches PDF mit dem alten QR-Code
        // Hier würde normalerweise eine PDF-Generierung stattfinden
        // Für dieses Beispiel speichern wir einfach die URL in einer Textdatei
        await fs.promises.writeFile(
          documentationPath,
          `Alter QR-Code für Website ${website._id}\nGespeichert am: ${new Date().toLocaleString()}\nURL: ${oldQrCodeUrl}`
        );

        console.log('Alter QR-Code dokumentiert:', documentationPath);

        // Sende eine E-Mail mit dem alten QR-Code
        const user = await User.findById(website.owner);
        if (user && user.email) {
          try {
            await sendEmail({
              to: user.email,
              subject: 'Ihr QR-Code wurde neu generiert',
              text: `Sehr geehrte(r) ${user.firstName} ${user.lastName},\n\nSie haben soeben einen neuen QR-Code für Ihre Website "${website.title}" generiert.\n\nZur Ihrer Dokumentation haben wir eine Kopie Ihres alten QR-Codes gespeichert.\n\nMit freundlichen Grüßen,\nIhr 247Vitrine-Team`,
              html: `
                <h2>QR-Code neu generiert</h2>
                <p>Sehr geehrte(r) ${user.firstName} ${user.lastName},</p>
                <p>Sie haben soeben einen neuen QR-Code für Ihre Website "${website.title}" generiert.</p>
                <p>Zur Ihrer Dokumentation haben wir eine Kopie Ihres alten QR-Codes gespeichert.</p>
                <div style="margin: 20px 0;">
                  <p><strong>Alter QR-Code:</strong></p>
                  <img src="${oldQrCodeUrl}" alt="Alter QR-Code" style="max-width: 200px; border: 1px solid #ccc; padding: 10px;">
                </div>
                <p>Mit freundlichen Grüßen,<br>Ihr 247Vitrine-Team</p>
              `
            });
            console.log('Dokumentations-E-Mail gesendet an:', user.email);
          } catch (emailError) {
            console.error('Fehler beim Senden der Dokumentations-E-Mail:', emailError);
            // Wir fahren trotzdem fort, auch wenn die E-Mail nicht gesendet werden konnte
          }
        }
      } catch (docError) {
        console.error('Fehler bei der Dokumentation des alten QR-Codes:', docError);
        // Wir fahren trotzdem fort, auch wenn die Dokumentation fehlgeschlagen ist
      }
    }

    // Generiere einen neuen QR-Code
    try {
      console.log('Generiere neuen QR-Code auf Anfrage für Website:', website._id);
      const qrCodeUrl = await generateQRCode(
        website._id,
        website.subdomain,
        website.content.businessCard
      );

      // Aktualisiere den QR-Code in der Datenbank
      website.content.businessCard.qrCodeUrl = qrCodeUrl;
      await website.save();

      console.log('Neuer QR-Code generiert:', qrCodeUrl);

      // Sende eine E-Mail mit dem neuen QR-Code
      const user = await User.findById(website.owner);
      if (user && user.email && oldQrCodeUrl) {
        try {
          await sendEmail({
            to: user.email,
            subject: 'Ihr neuer QR-Code ist verfügbar',
            text: `Sehr geehrte(r) ${user.firstName} ${user.lastName},\n\nIhr neuer QR-Code für die Website "${website.title}" wurde erfolgreich generiert.\n\nMit freundlichen Grüßen,\nIhr 247Vitrine-Team`,
            html: `
              <h2>Ihr neuer QR-Code ist verfügbar</h2>
              <p>Sehr geehrte(r) ${user.firstName} ${user.lastName},</p>
              <p>Ihr neuer QR-Code für die Website "${website.title}" wurde erfolgreich generiert.</p>
              <div style="margin: 20px 0;">
                <p><strong>Neuer QR-Code:</strong></p>
                <img src="${qrCodeUrl}" alt="Neuer QR-Code" style="max-width: 200px; border: 1px solid #ccc; padding: 10px;">
              </div>
              <p>Bitte aktualisieren Sie alle Ihre Marketingmaterialien mit diesem neuen QR-Code.</p>
              <p>Mit freundlichen Grüßen,<br>Ihr 247Vitrine-Team</p>
            `
          });
          console.log('E-Mail mit neuem QR-Code gesendet an:', user.email);
        } catch (emailError) {
          console.error('Fehler beim Senden der E-Mail mit neuem QR-Code:', emailError);
          // Wir fahren trotzdem fort, auch wenn die E-Mail nicht gesendet werden konnte
        }
      }

      res.json({
        success: true,
        message: 'QR-Code wurde erfolgreich neu generiert.',
        qrCodeUrl,
        documentationPath: documentationPath ? `/qrcodes/${path.basename(documentationPath)}` : null
      });
    } catch (qrError) {
      console.error('Error generating QR code:', qrError);
      res.status(500).json({
        success: false,
        message: 'Fehler bei der Generierung des QR-Codes.',
        error: qrError.message
      });
    }
  } catch (error) {
    console.error('Error regenerating QR code:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler bei der Verarbeitung der Anfrage.',
      error: error.message
    });
  }
});

// Website-Vorschau-Route
app.get('/preview/:websiteId', async (req, res) => {
  try {
    const website = await Website.findById(req.params.websiteId)
      .populate('layout')
      .populate('design')
      .populate('colorScheme');

    if (!website) {
      return res.status(404).send('Website nicht gefunden');
    }

    // Generiere HTML basierend auf Website-Daten
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${website.content.title}</title>
        <style>
          :root {
            --primary-color: ${website.colorScheme.primary};
            --secondary-color: ${website.colorScheme.secondary};
            --accent-color: ${website.colorScheme.accent};
            --text-color: ${website.colorScheme.text};
            --background-color: ${website.colorScheme.background};
          }
          ${website.design.css}

          /* Zusätzliche Styles für die Vorschau */
          body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            color: var(--text-color);
            background-color: var(--background-color);
          }

          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
          }

          header {
            background-color: var(--primary-color);
            color: white;
            padding: 40px 0;
            text-align: center;
          }

          section {
            padding: 60px 0;
          }

          .hero {
            background-color: var(--secondary-color);
            color: white;
            text-align: center;
            padding: 80px 0;
          }

          .hero img {
            max-width: 100%;
            margin-top: 20px;
          }

          .about {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
          }

          .about-content {
            flex: 1;
            min-width: 300px;
            padding-right: 40px;
          }

          .about img {
            max-width: 100%;
            max-height: 400px;
          }

          .services-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 30px;
            margin-top: 40px;
          }

          .service-card {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            padding: 30px;
            text-align: center;
          }

          .service-icon {
            font-size: 48px;
            margin-bottom: 20px;
          }

          .contact {
            background-color: var(--primary-color);
            color: white;
            text-align: center;
          }

          footer {
            background-color: #333;
            color: white;
            text-align: center;
            padding: 20px 0;
          }

          /* Styles für Galerie */
          .gallery-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 30px;
          }

          .gallery-item {
            position: relative;
            overflow: hidden;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }

          .gallery-item img {
            width: 100%;
            height: 200px;
            object-fit: cover;
            transition: transform 0.3s ease;
          }

          .gallery-item:hover img {
            transform: scale(1.05);
          }

          .gallery-caption {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: rgba(0,0,0,0.7);
            color: white;
            padding: 10px;
            transform: translateY(100%);
            transition: transform 0.3s ease;
          }

          .gallery-item:hover .gallery-caption {
            transform: translateY(0);
          }

          /* Styles für digitale Visitenkarte */
          .business-card {
            background-color: var(--secondary-color);
            color: white;
            padding: 40px 0;
          }

          .card-container {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
            background-color: white;
            color: var(--text-color);
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            padding: 30px;
            margin-top: 30px;
          }

          .card-info {
            flex: 1;
            min-width: 250px;
            padding-right: 20px;
          }

          .card-qr {
            text-align: center;
            padding: 20px;
          }

          .card-qr img {
            max-width: 150px;
            margin-bottom: 10px;
          }

          /* Styles für Social Media Links */
          .social-links {
            margin-top: 20px;
            display: flex;
            justify-content: center;
            gap: 15px;
          }

          .social-icon {
            display: inline-block;
            color: white;
            text-decoration: none;
            padding: 8px 15px;
            border-radius: 4px;
            background-color: var(--accent-color);
            transition: background-color 0.3s ease;
          }

          .social-icon:hover {
            background-color: var(--primary-color);
          }
        </style>
      </head>
      <body>
        <header>
          <div class="container">
            <h1>${website.content.title}</h1>
            <p>${website.content.description}</p>
          </div>
        </header>

        <section class="hero">
          <div class="container">
            <h2>${website.content.hero.title}</h2>
            <p>${website.content.hero.subtitle}</p>
            ${website.content.hero.image ? `<img src="${website.content.hero.image}" alt="Hero Image">` : ''}
          </div>
        </section>

        <section class="about">
          <div class="container">
            <div class="about-content">
              <h2>${website.content.about.title}</h2>
              <p>${website.content.about.text}</p>
            </div>
            ${website.content.about.image ? `<img src="${website.content.about.image}" alt="About Image">` : ''}
          </div>
        </section>

        <section class="services">
          <div class="container">
            <h2>Unsere Leistungen</h2>
            <div class="services-grid">
              ${website.content.services.map(service => `
                <div class="service-card">
                  <div class="service-icon">${service.icon}</div>
                  <h3>${service.title}</h3>
                  <p>${service.description}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </section>

        <section class="contact">
          <div class="container">
            <h2>Kontakt</h2>
            <p>Email: ${website.content.contact.email}</p>
            <p>Telefon: ${website.content.contact.phone}</p>
            <p>Adresse: ${website.content.contact.address}</p>
          </div>
        </section>

        ${website.content.gallery && website.content.gallery.length > 0 ? `
        <section class="gallery">
          <div class="container">
            <h2>Galerie</h2>
            <div class="gallery-grid">
              ${website.content.gallery.map(item => `
                <div class="gallery-item">
                  <img src="${item.imageUrl}" alt="${item.title}">
                  <div class="gallery-caption">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </section>
      ` : ''}
      </body>
      </html>
    `;

    res.send(html);
  } catch (error) {
    console.error('Error fetching website preview:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Backup-Routen
app.post('/api/backup', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { performBackup } = require('./scripts/backup');
    const result = await performBackup();
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Backup erfolgreich erstellt',
        mongoBackupPath: result.mongoBackupPath,
        fileBackupPath: result.fileBackupPath
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Backup fehlgeschlagen',
        error: result.error
      });
    }
  } catch (error) {
    logger.error('Fehler beim Backup:', error);
    res.status(500).json({
      success: false,
      message: 'Interner Server-Fehler beim Backup',
      error: error.message
    });
  }
});

app.get('/api/backups', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { getAvailableBackups } = require('./scripts/restore');
    const backups = await getAvailableBackups();
    
    res.json({
      success: true,
      backups: Object.entries(backups).map(([timestamp, files]) => ({
        timestamp,
        files
      }))
    });
  } catch (error) {
    logger.error('Fehler beim Abrufen der Backups:', error);
    res.status(500).json({
      success: false,
      message: 'Fehler beim Abrufen der Backups',
      error: error.message
    });
  }
});

app.post('/api/restore/:timestamp', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { performRestore } = require('./scripts/restore');
    const result = await performRestore(req.params.timestamp);
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Wiederherstellung erfolgreich',
        timestamp: result.timestamp,
        mongoBackup: result.mongoBackup,
        fileBackup: result.fileBackup
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Wiederherstellung fehlgeschlagen',
        error: result.error
      });
    }
  } catch (error) {
    logger.error('Fehler bei der Wiederherstellung:', error);
    res.status(500).json({
      success: false,
      message: 'Interner Server-Fehler bei der Wiederherstellung',
      error: error.message
    });
  }
});

// SPA Fallback: Alle unbekannten Routen auf index.html umleiten
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled Error:', err);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Server starten
app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info('Server ist erreichbar unter:');
  logger.info(`- Lokal: http://localhost:${PORT}`);
  logger.info(`- Im Netzwerk: http://<deine-lokale-IP>:${PORT}`);
});