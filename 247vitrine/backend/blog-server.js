const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const blogRoutes = require('./routes/blogRoutes');

// Umgebungsvariablen laden
dotenv.config();

// Express-App erstellen
const app = express();
const PORT = 3002;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB-Verbindung
console.log('Connecting to MongoDB with URI:', process.env.MONGODB_URI ? 'URI from .env file' : 'Fallback URI');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://247vitrine-db:l9dyz9HhhejrP23ztH7LsVetUjNJuT6duzLoVwqhhRZMZWHA85vhcQWUYtOFt9iAj0tZY5IMfLxRACDbDfZgcA==@247vitrine-db.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@247vitrine-db@', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => {
  console.error('MongoDB connection error:', err);

  // Versuche, mit lokaler MongoDB zu verbinden, wenn die Azure-Verbindung fehlschlägt
  console.log('Attempting to connect to local MongoDB...');
  return mongoose.connect('mongodb://localhost:27017/247vitrine', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connected to local MongoDB successfully'))
  .catch(localErr => console.error('Local MongoDB connection error:', localErr));
});

// Debug-Middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Blog-Routen registrieren
app.use('/api/blog', blogRoutes);

// Einfache Test-Route
app.get('/test', (req, res) => {
  console.log('Test-Route aufgerufen');
  res.json({ message: 'Blog-Server läuft' });
});

// Server starten
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Blog-Server running on port ${PORT}`);
  console.log(`Blog-Server ist erreichbar unter:`);
  console.log(`- Lokal: http://localhost:${PORT}`);
  console.log(`- Im Netzwerk: http://<deine-lokale-IP>:${PORT}`);
});
