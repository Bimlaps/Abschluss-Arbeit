const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Layout = require('./models/Layout');
const Design = require('./models/Design');
const ColorScheme = require('./models/ColorScheme');
const Website = require('./models/Website');
const User = require('./models/User'); // User-Modell importieren

// Umgebungsvariablen laden
dotenv.config();

// MongoDB-Verbindung
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/247vitrine', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected for seeding wizard data'))
.catch(err => console.error('MongoDB connection error:', err));

// Beispiel-Layouts
const layoutsData = [
  {
    name: 'Einseitig',
    description: 'Ein einseitiges Layout mit allen Inhalten auf einer Seite',
    thumbnail: 'https://via.placeholder.com/300x200?text=Einseitig',
    structure: 'one-page'
  },
  {
    name: 'Mehrseitig',
    description: 'Ein mehrseitiges Layout mit separaten Seiten für verschiedene Inhalte',
    thumbnail: 'https://via.placeholder.com/300x200?text=Mehrseitig',
    structure: 'multi-page'
  },
  {
    name: 'Mit Sidebar',
    description: 'Ein Layout mit einer Seitenleiste für zusätzliche Informationen',
    thumbnail: 'https://via.placeholder.com/300x200?text=Mit+Sidebar',
    structure: 'with-sidebar'
  }
];

// Beispiel-Farbschemata
const colorSchemesData = [
  {
    name: 'Blau & Orange',
    description: 'Ein frisches Farbschema mit Blau als Primärfarbe und Orange als Akzentfarbe',
    thumbnail: 'https://via.placeholder.com/300x200?text=Blau+%26+Orange',
    primary: '#0284c7',
    secondary: '#f59e0b',
    accent: '#10b981',
    text: '#333333',
    background: '#ffffff'
  },
  {
    name: 'Grün & Lila',
    description: 'Ein natürliches Farbschema mit Grün als Primärfarbe und Lila als Akzentfarbe',
    thumbnail: 'https://via.placeholder.com/300x200?text=Grün+%26+Lila',
    primary: '#10b981',
    secondary: '#8b5cf6',
    accent: '#f59e0b',
    text: '#333333',
    background: '#f8f9fa'
  },
  {
    name: 'Dunkel & Elegant',
    description: 'Ein elegantes dunkles Farbschema mit hellen Akzenten',
    thumbnail: 'https://via.placeholder.com/300x200?text=Dunkel+%26+Elegant',
    primary: '#1e293b',
    secondary: '#475569',
    accent: '#f59e0b',
    text: '#f8fafc',
    background: '#0f172a'
  }
];

// Datenbank mit Beispieldaten initialisieren
async function seedDatabase() {
  try {
    // Datenbank leeren
    await Layout.deleteMany({});
    await Design.deleteMany({});
    await ColorScheme.deleteMany({});
    await Website.deleteMany({});
    
    // Layouts erstellen
    const layouts = await Layout.insertMany(layoutsData);
    console.log('Layouts created:', layouts.map(layout => layout._id));
    
    // Designs erstellen (für jedes Layout ein Design)
    const designsData = [
      {
        name: 'Modern Handwerker',
        description: 'Ein modernes Template für Handwerker',
        category: 'Handwerk',
        thumbnail: 'https://via.placeholder.com/300x200?text=Modern',
        layout: layouts[0]._id, // Einseitig
        css: `
          body {
            font-family: 'Open Sans', sans-serif;
            color: var(--text-color);
            margin: 0;
            padding: 0;
            background-color: var(--background-color);
          }

          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
          }

          header {
            background-color: var(--primary-color);
            color: white;
            padding: 20px 0;
            text-align: center;
          }
        `,
        js: `
          console.log('Modern Template loaded!');
        `
      },
      {
        name: 'Eleganter Handwerker',
        description: 'Ein elegantes, minimalistisches Template für Handwerker',
        category: 'Handwerk',
        thumbnail: 'https://via.placeholder.com/300x200?text=Elegant',
        layout: layouts[1]._id, // Mehrseitig
        css: `
          body {
            font-family: 'Playfair Display', serif;
            color: var(--text-color);
            line-height: 1.6;
            background-color: var(--background-color);
          }

          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
          }
        `,
        js: `
          console.log('Elegant Template loaded!');
        `
      },
      {
        name: 'Moderner Bauunternehmer',
        description: 'Ein modernes, robustes Template für Bauunternehmen',
        category: 'Baugewerbe',
        thumbnail: 'https://via.placeholder.com/300x200?text=Bauunternehmer',
        layout: layouts[2]._id, // Mit Sidebar
        css: `
          body {
            font-family: 'Roboto', sans-serif;
            color: var(--text-color);
            margin: 0;
            padding: 0;
            background-color: var(--background-color);
          }

          .site-wrapper {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
          }
        `,
        js: `
          console.log('Construction Template loaded!');
        `
      }
    ];
    
    const designs = await Design.insertMany(designsData);
    console.log('Designs created:', designs.map(design => design._id));
    
    // Farbschemata erstellen
    const colorSchemes = await ColorScheme.insertMany(colorSchemesData);
    console.log('Color schemes created:', colorSchemes.map(scheme => scheme._id));
    
    // Finde einen Benutzer (Admin oder Customer)
    const user = await User.findOne({ role: 'admin' });
    
    if (!user) {
      throw new Error('No user found. Please run seed-users.js first.');
    }
    
    // Beispiel-Website erstellen
    const website = await Website.create({
      name: 'Meine Handwerker-Website',
      subdomain: 'musterhandwerker',
      layout: layouts[0]._id, // Einseitig
      design: designs[0]._id, // Modern Handwerker
      colorScheme: colorSchemes[0]._id, // Blau & Orange
      owner: user._id, // Besitzer setzen
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
      published: true
    });
    console.log('Website created:', website._id);
    
    // Website zum Benutzer hinzufügen
    await User.findByIdAndUpdate(
      user._id,
      { $push: { websites: website._id } }
    );
    
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
