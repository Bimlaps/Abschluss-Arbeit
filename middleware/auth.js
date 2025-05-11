const jwt = require('jsonwebtoken');

// JWT Secret Key (sollte in .env-Datei sein)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware zur Authentifizierung
exports.authenticate = (req, res, next) => {
  // Token aus dem Header holen
  const token = req.header('x-auth-token');

  // Prüfen, ob ein Token vorhanden ist
  if (!token) {
    console.log('Kein Token vorhanden, Authentifizierung fehlgeschlagen');
    return res.status(401).json({ message: 'Kein Token, Zugriff verweigert' });
  }

  try {
    // Token verifizieren
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Benutzer-ID zum Request hinzufügen
    req.user = decoded.user;
    console.log('Benutzer authentifiziert:', req.user.id);
    next();
  } catch (err) {
    console.error('Token ist ungültig:', err.message);
    res.status(401).json({ message: 'Token ist ungültig' });
  }
};

// Middleware zur Autorisierung basierend auf Rollen
exports.authorize = (roles = []) => {
  return (req, res, next) => {
    // Prüfen, ob der Benutzer authentifiziert ist
    if (!req.user) {
      console.log('Benutzer nicht authentifiziert, Autorisierung fehlgeschlagen');
      return res.status(401).json({ message: 'Nicht authentifiziert' });
    }

    // Prüfen, ob die Rolle des Benutzers in den erlaubten Rollen enthalten ist
    if (roles.length && !roles.includes(req.user.role)) {
      console.log('Benutzer hat nicht die erforderliche Rolle:', req.user.role, 'Benötigt:', roles);
      return res.status(403).json({ message: 'Nicht autorisiert' });
    }

    // Benutzer ist autorisiert
    console.log('Benutzer autorisiert mit Rolle:', req.user.role);
    next();
  };
};
