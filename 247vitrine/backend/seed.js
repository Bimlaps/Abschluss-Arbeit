const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Template = require('./models/Template');
const Website = require('./models/Website');

// Umgebungsvariablen laden
dotenv.config();

// MongoDB-Verbindung
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/247vitrine', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected for seeding'))
.catch(err => console.error('MongoDB connection error:', err));

// Beispiel-Template
const templateData = {
  name: 'Modern Handwerker',
  description: 'Ein modernes Template für Handwerker',
  category: 'Handwerk',
  thumbnail: 'https://via.placeholder.com/300x200',
  html: `
    <div class="container">
      <header>
        <h1>{{TITLE}}</h1>
        <p>{{DESCRIPTION}}</p>
      </header>
      <section class="hero">
        <h2>{{HERO_TITLE}}</h2>
        <p>{{HERO_SUBTITLE}}</p>
        <img src="{{HERO_IMAGE}}" alt="Hero">
      </section>
      <section class="about">
        <h2>{{ABOUT_TITLE}}</h2>
        <p>{{ABOUT_TEXT}}</p>
        <img src="{{ABOUT_IMAGE}}" alt="About">
      </section>
      <section class="services">
        <h2>Unsere Dienstleistungen</h2>
        <div class="services-container">
          {{SERVICES}}
        </div>
      </section>
      <section class="contact">
        <h2>Kontakt</h2>
        <p>Email: {{CONTACT_EMAIL}}</p>
        <p>Telefon: {{CONTACT_PHONE}}</p>
        <p>Adresse: {{CONTACT_ADDRESS}}</p>
      </section>
      <footer>
        <p>&copy; 2025 {{TITLE}} - Erstellt mit 247Vitrine</p>
      </footer>
    </div>
  `,
  css: `
    body {
      font-family: 'Open Sans', sans-serif;
      color: #333;
      margin: 0;
      padding: 0;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    
    header {
      background-color: #0284c7;
      color: white;
      padding: 20px 0;
      text-align: center;
    }
  `,
  js: `
    console.log('Template loaded!');
  `
};

// Datenbank mit Beispieldaten initialisieren
async function seedDatabase() {
  try {
    // Datenbank leeren
    await Template.deleteMany({});
    await Website.deleteMany({});
    
    // Template erstellen
    const template = await Template.create(templateData);
    console.log('Template created:', template._id);
    
    // Website erstellen
    const website = await Website.create({
      name: 'Meine Handwerker-Website',
      subdomain: 'musterhandwerker',
      template: template._id,
      content: {
        title: 'Muster Handwerker GmbH',
        description: 'Ihr zuverlässiger Partner für alle Handwerksarbeiten',
        logo: 'https://via.placeholder.com/150x50',
        hero: {
          title: 'Willkommen bei Muster Handwerker',
          subtitle: 'Qualität und Zuverlässigkeit seit 1995',
          image: 'https://via.placeholder.com/1200x600'
        },
        about: {
          title: 'Über uns',
          text: 'Wir sind ein Familienunternehmen mit über 25 Jahren Erfahrung...',
          image: 'https://via.placeholder.com/600x400'
        },
        services: [
          {
            title: 'Sanitärinstallation',
            description: 'Professionelle Installation und Reparatur von Sanitäranlagen',
            icon: '🔧'
          },
          {
            title: 'Heizungsbau',
            description: 'Moderne und energieeffiziente Heizungssysteme',
            icon: '🔥'
          },
          {
            title: 'Elektroinstallation',
            description: 'Sichere und zuverlässige Elektroinstallationen',
            icon: '⚡'
          }
        ],
        contact: {
          email: 'info@musterhandwerker.de',
          phone: '+49 123 456789',
          address: 'Musterstraße 123, 12345 Musterstadt'
        }
      },
      colors: {
        primary: '#0284c7',
        secondary: '#f59e0b',
        accent: '#10b981',
        text: '#333333',
        background: '#ffffff'
      },
      fonts: {
        heading: 'Roboto',
        body: 'Open Sans'
      },
      published: true
    });
    console.log('Website created:', website._id);
    
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
