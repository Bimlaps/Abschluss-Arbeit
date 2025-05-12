const express = require('express');
const path = require('path');

// Express-App erstellen
const app = express();
const PORT = 3001;

// Middleware für JSON-Verarbeitung
app.use(express.json());

// Statische Dateien aus dem public-Verzeichnis bereitstellen
app.use(express.static(path.join(__dirname, 'backend/public')));

// Admin-Portal bereitstellen
app.use('/admin', express.static(path.join(__dirname, 'frontend/admin')));

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
