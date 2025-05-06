const jwt = require('jsonwebtoken');

// JWT Secret Key (sollte in .env-Datei sein)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware zur Authentifizierung
exports.authenticate = (req, res, next) => {
  // Token aus Header holen
  const token = req.header('x-auth-token');
  
  // Prüfen, ob Token vorhanden ist
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  
  try {
    // Token verifizieren
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Benutzerinfo an Request anhängen
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Middleware zur Rollenprüfung
exports.authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    
    next();
  };
};
