const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Layout = require('./models/Layout');
const Design = require('./models/Design');
const ColorScheme = require('./models/ColorScheme');

// Umgebungsvariablen laden
dotenv.config();

// MongoDB-Verbindung
mongoose.connect(process.env.MONGODB_URI || 'mongodb://247vitrine-db:l9dyz9HhhejrP23ztH7LsVetUjNJuT6duzLoVwqhhRZMZWHA85vhcQWUYtOFt9iAj0tZY5IMfLxRACDbDfZgcA==@247vitrine-db.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@247vitrine-db@', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected for seeding'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Seed-Daten
const layouts = [
  {
    name: 'One-Page',
    description: 'Alle Inhalte auf einer scrollbaren Seite - ideal für die schnelle Präsentation',
    thumbnail: 'https://via.placeholder.com/300x200?text=One-Page+Layout',
    category: 'one-page',
    structure: JSON.stringify({
      header: true,
      hero: true,
      about: true,
      services: true,
      contact: true,
      footer: true
    })
  },
  {
    name: 'Multi-Page',
    description: 'Klassische Website-Struktur mit separaten Unterseiten für mehr Struktur',
    thumbnail: 'https://via.placeholder.com/300x200?text=Multi-Page+Layout',
    category: 'multi-page',
    structure: JSON.stringify({
      header: true,
      pages: ['home', 'about', 'services', 'contact'],
      footer: true
    })
  },
  {
    name: 'Sidebar',
    description: 'Layout mit seitlicher Navigation für eine gute Übersicht über alle Inhalte',
    thumbnail: 'https://via.placeholder.com/300x200?text=Sidebar+Layout',
    category: 'sidebar',
    structure: JSON.stringify({
      header: true,
      sidebar: true,
      content: true,
      footer: true
    })
  }
];

// 9 Designs (3 pro Layout-Kategorie)
const designs = [
  // One-Page Designs
  {
    name: 'One-Page Modern',
    description: 'Ein modernes, klares Design für One-Page Layouts',
    thumbnail: 'https://via.placeholder.com/300x200?text=One-Page+Modern',
    category: 'Modern',
    layoutCategory: 'one-page',
    css: `
      /* One-Page Modern Design CSS */
      body {
        font-family: 'Roboto', sans-serif;
        line-height: 1.6;
      }

      h1, h2, h3 {
        font-weight: 300;
      }

      section {
        padding: 80px 0;
      }

      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
      }
    `,
    js: `
      // One-Page Modern Design JS
      document.addEventListener('DOMContentLoaded', function() {
        console.log('One-Page Modern Design loaded');
      });
    `
  },
  {
    name: 'One-Page Klassisch',
    description: 'Ein klassisches, zeitloses Design für One-Page Layouts',
    thumbnail: 'https://via.placeholder.com/300x200?text=One-Page+Klassisch',
    category: 'Klassisch',
    layoutCategory: 'one-page',
    css: `
      /* One-Page Klassisches Design CSS */
      body {
        font-family: 'Georgia', serif;
        line-height: 1.6;
      }

      h1, h2, h3 {
        font-weight: bold;
      }

      section {
        padding: 60px 0;
        border-bottom: 1px solid #eee;
      }

      .container {
        max-width: 1000px;
        margin: 0 auto;
        padding: 0 20px;
      }
    `,
    js: `
      // One-Page Klassisches Design JS
      document.addEventListener('DOMContentLoaded', function() {
        console.log('One-Page Klassisches Design loaded');
      });
    `
  },
  {
    name: 'One-Page Handwerk',
    description: 'Ein Design speziell für Handwerker mit One-Page Layout',
    thumbnail: 'https://via.placeholder.com/300x200?text=One-Page+Handwerk',
    category: 'Handwerk',
    layoutCategory: 'one-page',
    css: `
      /* One-Page Handwerk Design CSS */
      body {
        font-family: 'Open Sans', sans-serif;
        line-height: 1.6;
      }

      h1, h2, h3 {
        font-weight: 600;
      }

      section {
        padding: 70px 0;
      }

      .container {
        max-width: 1100px;
        margin: 0 auto;
        padding: 0 20px;
      }
    `,
    js: `
      // One-Page Handwerk Design JS
      document.addEventListener('DOMContentLoaded', function() {
        console.log('One-Page Handwerk Design loaded');
      });
    `
  },

  // Multi-Page Designs
  {
    name: 'Multi-Page Modern',
    description: 'Ein modernes, klares Design für Multi-Page Layouts',
    thumbnail: 'https://via.placeholder.com/300x200?text=Multi-Page+Modern',
    category: 'Modern',
    layoutCategory: 'multi-page',
    css: `
      /* Multi-Page Modern Design CSS */
      body {
        font-family: 'Roboto', sans-serif;
        line-height: 1.6;
      }

      h1, h2, h3 {
        font-weight: 300;
      }

      .page-content {
        padding: 40px 0;
      }

      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
      }
    `,
    js: `
      // Multi-Page Modern Design JS
      document.addEventListener('DOMContentLoaded', function() {
        console.log('Multi-Page Modern Design loaded');
      });
    `
  },
  {
    name: 'Multi-Page Klassisch',
    description: 'Ein klassisches, zeitloses Design für Multi-Page Layouts',
    thumbnail: 'https://via.placeholder.com/300x200?text=Multi-Page+Klassisch',
    category: 'Klassisch',
    layoutCategory: 'multi-page',
    css: `
      /* Multi-Page Klassisches Design CSS */
      body {
        font-family: 'Georgia', serif;
        line-height: 1.6;
      }

      h1, h2, h3 {
        font-weight: bold;
      }

      .page-content {
        padding: 30px 0;
        border-bottom: 1px solid #eee;
      }

      .container {
        max-width: 1000px;
        margin: 0 auto;
        padding: 0 20px;
      }
    `,
    js: `
      // Multi-Page Klassisches Design JS
      document.addEventListener('DOMContentLoaded', function() {
        console.log('Multi-Page Klassisches Design loaded');
      });
    `
  },
  {
    name: 'Multi-Page Handwerk',
    description: 'Ein Design speziell für Handwerker mit Multi-Page Layout',
    thumbnail: 'https://via.placeholder.com/300x200?text=Multi-Page+Handwerk',
    category: 'Handwerk',
    layoutCategory: 'multi-page',
    css: `
      /* Multi-Page Handwerk Design CSS */
      body {
        font-family: 'Open Sans', sans-serif;
        line-height: 1.6;
      }

      h1, h2, h3 {
        font-weight: 600;
      }

      .page-content {
        padding: 50px 0;
      }

      .container {
        max-width: 1100px;
        margin: 0 auto;
        padding: 0 20px;
      }
    `,
    js: `
      // Multi-Page Handwerk Design JS
      document.addEventListener('DOMContentLoaded', function() {
        console.log('Multi-Page Handwerk Design loaded');
      });
    `
  },

  // Sidebar Designs
  {
    name: 'Sidebar Modern',
    description: 'Ein modernes, klares Design für Sidebar Layouts',
    thumbnail: 'https://via.placeholder.com/300x200?text=Sidebar+Modern',
    category: 'Modern',
    layoutCategory: 'sidebar',
    css: `
      /* Sidebar Modern Design CSS */
      body {
        font-family: 'Roboto', sans-serif;
        line-height: 1.6;
      }

      h1, h2, h3 {
        font-weight: 300;
      }

      .sidebar {
        width: 250px;
        position: fixed;
        height: 100%;
        background-color: #f8f9fa;
      }

      .main-content {
        margin-left: 250px;
        padding: 20px;
      }

      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
      }
    `,
    js: `
      // Sidebar Modern Design JS
      document.addEventListener('DOMContentLoaded', function() {
        console.log('Sidebar Modern Design loaded');
      });
    `
  },
  {
    name: 'Sidebar Klassisch',
    description: 'Ein klassisches, zeitloses Design für Sidebar Layouts',
    thumbnail: 'https://via.placeholder.com/300x200?text=Sidebar+Klassisch',
    category: 'Klassisch',
    layoutCategory: 'sidebar',
    css: `
      /* Sidebar Klassisches Design CSS */
      body {
        font-family: 'Georgia', serif;
        line-height: 1.6;
      }

      h1, h2, h3 {
        font-weight: bold;
      }

      .sidebar {
        width: 220px;
        position: fixed;
        height: 100%;
        background-color: #f0f0f0;
        border-right: 1px solid #ddd;
      }

      .main-content {
        margin-left: 220px;
        padding: 30px;
      }

      .container {
        max-width: 1000px;
        margin: 0 auto;
        padding: 0 20px;
      }
    `,
    js: `
      // Sidebar Klassisches Design JS
      document.addEventListener('DOMContentLoaded', function() {
        console.log('Sidebar Klassisches Design loaded');
      });
    `
  },
  {
    name: 'Sidebar Handwerk',
    description: 'Ein Design speziell für Handwerker mit Sidebar Layout',
    thumbnail: 'https://via.placeholder.com/300x200?text=Sidebar+Handwerk',
    category: 'Handwerk',
    layoutCategory: 'sidebar',
    css: `
      /* Sidebar Handwerk Design CSS */
      body {
        font-family: 'Open Sans', sans-serif;
        line-height: 1.6;
      }

      h1, h2, h3 {
        font-weight: 600;
      }

      .sidebar {
        width: 240px;
        position: fixed;
        height: 100%;
        background-color: #f5f5f5;
      }

      .main-content {
        margin-left: 240px;
        padding: 25px;
      }

      .container {
        max-width: 1100px;
        margin: 0 auto;
        padding: 0 20px;
      }
    `,
    js: `
      // Sidebar Handwerk Design JS
      document.addEventListener('DOMContentLoaded', function() {
        console.log('Sidebar Handwerk Design loaded');
      });
    `
  }
];

// 3 Farbschemata für alle Designs
const colorSchemes = [
  {
    name: 'Blau & Weiß',
    description: 'Ein frisches, professionelles Farbschema',
    thumbnail: 'https://via.placeholder.com/300x200?text=Blau+Weiss',
    primary: '#0284c7',
    secondary: '#0ea5e9',
    accent: '#38bdf8',
    text: '#333333',
    background: '#ffffff'
  },
  {
    name: 'Grün & Beige',
    description: 'Ein natürliches, erdiges Farbschema',
    thumbnail: 'https://via.placeholder.com/300x200?text=Gruen+Beige',
    primary: '#16a34a',
    secondary: '#22c55e',
    accent: '#4ade80',
    text: '#333333',
    background: '#f5f5dc'
  },
  {
    name: 'Dunkel & Gold',
    description: 'Ein elegantes, luxuriöses Farbschema',
    thumbnail: 'https://via.placeholder.com/300x200?text=Dunkel+Gold',
    primary: '#1e293b',
    secondary: '#334155',
    accent: '#eab308',
    text: '#f8fafc',
    background: '#0f172a'
  }
];

// Daten in die Datenbank einfügen
const seedDatabase = async () => {
  try {
    // Bestehende Daten löschen
    await Layout.deleteMany({});
    await Design.deleteMany({});
    await ColorScheme.deleteMany({});

    console.log('Bestehende Daten gelöscht');

    // Layouts einfügen
    const createdLayouts = await Layout.insertMany(layouts);
    console.log(`${createdLayouts.length} Layouts eingefügt`);

    // Designs mit Referenzen zu Layouts einfügen
    const designsWithLayouts = designs.map(design => {
      // Finde das passende Layout basierend auf der layoutCategory
      const matchingLayout = createdLayouts.find(layout =>
        layout.category === design.layoutCategory
      );

      // Entferne die layoutCategory-Eigenschaft, da sie nicht im Modell definiert ist
      const { layoutCategory, ...designWithoutCategory } = design;

      return {
        ...designWithoutCategory,
        layout: matchingLayout._id
      };
    });

    const createdDesigns = await Design.insertMany(designsWithLayouts);
    console.log(`${createdDesigns.length} Designs eingefügt`);

    // Farbschemata einfügen
    const createdColorSchemes = await ColorScheme.insertMany(colorSchemes);
    console.log(`${createdColorSchemes.length} Farbschemata eingefügt`);

    console.log('Seed-Vorgang abgeschlossen');

    // Verbindung schließen
    mongoose.connection.close();
  } catch (error) {
    console.error('Fehler beim Seeding:', error);
    process.exit(1);
  }
};

// Seed-Funktion ausführen
seedDatabase();
