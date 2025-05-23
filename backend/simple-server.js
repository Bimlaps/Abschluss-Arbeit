const express = require('express');
const path = require('path');

// Express-App erstellen
const app = express();
const PORT = 3001;

// Middleware für JSON-Verarbeitung
app.use(express.json());

// Statische Dateien aus dem public-Verzeichnis bereitstellen
app.use(express.static(path.join(__dirname, 'public')));

// Explizite Routen für HTML-Dateien
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/preview', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'preview.html'));
});

app.get('/website-builder', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'website-builder.html'));
});

app.get('/simple', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'simple.html'));
});

// Server starten
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Server ist erreichbar unter:`);
  console.log(`- Lokal: http://localhost:${PORT}`);
  console.log(`- Im Netzwerk: http://<deine-lokale-IP>:${PORT}`);
});
