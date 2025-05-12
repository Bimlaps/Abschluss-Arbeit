const express = require('express');
const path = require('path');

// Express-App erstellen
const app = express();
const PORT = 3001;

// Middleware für JSON-Verarbeitung
app.use(express.json());

// CORS-Middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
});

// Statische Dateien aus dem public-Verzeichnis bereitstellen
app.use(express.static(path.join(__dirname, 'backend/public')));

// Admin-Portal bereitstellen
app.use('/admin', express.static(path.join(__dirname, 'frontend/admin')));

// Mock-API für Templates
app.get('/api/admin/templates', (req, res) => {
  res.json([
    {
      _id: '1',
      name: 'Handwerker Basic',
      description: 'Einfaches Template für Handwerker mit allen wichtigen Sektionen.',
      layout: 'one-page',
      isPublic: true,
      createdAt: new Date('2023-05-01')
    },
    {
      _id: '2',
      name: 'Handwerker Pro',
      description: 'Professionelles Template mit mehreren Seiten für umfangreiche Inhalte.',
      layout: 'multi-page',
      isPublic: true,
      createdAt: new Date('2023-04-15')
    },
    {
      _id: '3',
      name: 'Handwerker Premium',
      description: 'Premium-Template mit Sidebar-Navigation und erweiterten Funktionen.',
      layout: 'sidebar',
      isPublic: false,
      createdAt: new Date('2023-03-10')
    }
  ]);
});

// Mock-API für Template-Statistiken
app.get('/api/admin/templates/stats', (req, res) => {
  res.json({
    totalTemplates: 3,
    publicTemplates: 2,
    privateTemplates: 1,
    templatesByLayout: [
      { _id: 'one-page', count: 1 },
      { _id: 'multi-page', count: 1 },
      { _id: 'sidebar', count: 1 }
    ]
  });
});

// Mock-API für einzelnes Template
app.get('/api/admin/templates/:id', (req, res) => {
  const templates = {
    '1': {
      _id: '1',
      name: 'Handwerker Basic',
      description: 'Einfaches Template für Handwerker mit allen wichtigen Sektionen.',
      layout: 'one-page',
      isPublic: true,
      createdAt: new Date('2023-05-01')
    },
    '2': {
      _id: '2',
      name: 'Handwerker Pro',
      description: 'Professionelles Template mit mehreren Seiten für umfangreiche Inhalte.',
      layout: 'multi-page',
      isPublic: true,
      createdAt: new Date('2023-04-15')
    },
    '3': {
      _id: '3',
      name: 'Handwerker Premium',
      description: 'Premium-Template mit Sidebar-Navigation und erweiterten Funktionen.',
      layout: 'sidebar',
      isPublic: false,
      createdAt: new Date('2023-03-10')
    }
  };

  const template = templates[req.params.id];

  if (!template) {
    return res.status(404).json({ message: 'Template nicht gefunden' });
  }

  res.json(template);
});

// Mock-API für Benutzer
app.get('/api/admin/users', (req, res) => {
  res.json([
    {
      _id: '1',
      firstName: 'Max',
      lastName: 'Mustermann',
      email: 'max.mustermann@example.com',
      role: 'customer',
      status: 'active',
      createdAt: new Date('2023-05-01'),
      websites: []
    },
    {
      _id: '2',
      firstName: 'Anna',
      lastName: 'Schmidt',
      email: 'anna.schmidt@example.com',
      role: 'admin',
      status: 'active',
      createdAt: new Date('2023-04-15'),
      websites: []
    },
    {
      _id: '3',
      firstName: 'Peter',
      lastName: 'Müller',
      email: 'peter.mueller@example.com',
      role: 'customer',
      status: 'inactive',
      createdAt: new Date('2023-03-10'),
      websites: ['1', '2']
    }
  ]);
});

// Mock-API für Benutzerstatistiken
app.get('/api/admin/users/stats', (req, res) => {
  res.json({
    totalUsers: 3,
    activeUsers: 2,
    inactiveUsers: 1,
    adminUsers: 1,
    customerUsers: 2
  });
});

// Mock-API für einzelnen Benutzer
app.get('/api/admin/users/:id', (req, res) => {
  const users = {
    '1': {
      _id: '1',
      firstName: 'Max',
      lastName: 'Mustermann',
      email: 'max.mustermann@example.com',
      role: 'customer',
      status: 'active',
      createdAt: new Date('2023-05-01'),
      websites: []
    },
    '2': {
      _id: '2',
      firstName: 'Anna',
      lastName: 'Schmidt',
      email: 'anna.schmidt@example.com',
      role: 'admin',
      status: 'active',
      createdAt: new Date('2023-04-15'),
      websites: []
    },
    '3': {
      _id: '3',
      firstName: 'Peter',
      lastName: 'Müller',
      email: 'peter.mueller@example.com',
      role: 'customer',
      status: 'inactive',
      createdAt: new Date('2023-03-10'),
      websites: ['1', '2']
    }
  };

  const user = users[req.params.id];

  if (!user) {
    return res.status(404).json({ message: 'Benutzer nicht gefunden' });
  }

  res.json(user);
});

// POST-Methode für Templates
app.post('/api/admin/templates', (req, res) => {
  const newTemplate = {
    _id: Date.now().toString(),
    ...req.body,
    createdAt: new Date()
  };

  res.status(201).json(newTemplate);
});

// PUT-Methode für Templates
app.put('/api/admin/templates/:id', (req, res) => {
  const templates = {
    '1': {
      _id: '1',
      name: 'Handwerker Basic',
      description: 'Einfaches Template für Handwerker mit allen wichtigen Sektionen.',
      layout: 'one-page',
      isPublic: true,
      createdAt: new Date('2023-05-01')
    },
    '2': {
      _id: '2',
      name: 'Handwerker Pro',
      description: 'Professionelles Template mit mehreren Seiten für umfangreiche Inhalte.',
      layout: 'multi-page',
      isPublic: true,
      createdAt: new Date('2023-04-15')
    },
    '3': {
      _id: '3',
      name: 'Handwerker Premium',
      description: 'Premium-Template mit Sidebar-Navigation und erweiterten Funktionen.',
      layout: 'sidebar',
      isPublic: false,
      createdAt: new Date('2023-03-10')
    }
  };

  const template = templates[req.params.id];

  if (!template) {
    return res.status(404).json({ message: 'Template nicht gefunden' });
  }

  const updatedTemplate = {
    ...template,
    ...req.body,
    _id: req.params.id
  };

  res.json(updatedTemplate);
});

// DELETE-Methode für Templates
app.delete('/api/admin/templates/:id', (req, res) => {
  res.json({ message: 'Template erfolgreich gelöscht' });
});

// POST-Methode für Benutzer
app.post('/api/admin/users', (req, res) => {
  const newUser = {
    _id: Date.now().toString(),
    ...req.body,
    createdAt: new Date(),
    websites: []
  };

  res.status(201).json(newUser);
});

// PUT-Methode für Benutzer
app.put('/api/admin/users/:id', (req, res) => {
  const users = {
    '1': {
      _id: '1',
      firstName: 'Max',
      lastName: 'Mustermann',
      email: 'max.mustermann@example.com',
      role: 'customer',
      status: 'active',
      createdAt: new Date('2023-05-01'),
      websites: []
    },
    '2': {
      _id: '2',
      firstName: 'Anna',
      lastName: 'Schmidt',
      email: 'anna.schmidt@example.com',
      role: 'admin',
      status: 'active',
      createdAt: new Date('2023-04-15'),
      websites: []
    },
    '3': {
      _id: '3',
      firstName: 'Peter',
      lastName: 'Müller',
      email: 'peter.mueller@example.com',
      role: 'customer',
      status: 'inactive',
      createdAt: new Date('2023-03-10'),
      websites: ['1', '2']
    }
  };

  const user = users[req.params.id];

  if (!user) {
    return res.status(404).json({ message: 'Benutzer nicht gefunden' });
  }

  const updatedUser = {
    ...user,
    ...req.body,
    _id: req.params.id
  };

  res.json(updatedUser);
});

// DELETE-Methode für Benutzer
app.delete('/api/admin/users/:id', (req, res) => {
  res.json({ message: 'Benutzer erfolgreich gelöscht' });
});

// Explizite Routen für HTML-Dateien
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'backend/public', 'simple.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'backend/public', 'login-simple.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'backend/public', 'dashboard-simple.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'backend/public', 'register.html'));
});

app.get('/preview', (req, res) => {
  res.sendFile(path.join(__dirname, 'backend/public', 'preview.html'));
});

app.get('/website-builder', (req, res) => {
  res.sendFile(path.join(__dirname, 'backend/public', 'website-builder.html'));
});

// Admin-Portal-Routen
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/admin', 'index.html'));
});

// Server starten
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Server ist erreichbar unter:`);
  console.log(`- Lokal: http://localhost:${PORT}`);
  console.log(`- Im Netzwerk: http://<deine-lokale-IP>:${PORT}`);
});
