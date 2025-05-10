const jwt = require('jsonwebtoken');

// JWT Secret Key (sollte in .env-Datei sein)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware zur Authentifizierung
exports.authenticate = (req, res, next) => {
  // Token aus Header holen (unterstützt sowohl x-auth-token als auch Authorization: Bearer)
  let token = req.header('x-auth-token');

  // Wenn kein x-auth-token vorhanden ist, versuche Authorization: Bearer
  if (!token) {
    const authHeader = req.header('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }

  // Prüfen, ob Token vorhanden ist
  if (!token) {
    console.log('Authentication failed: No token provided');
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Token verifizieren
    const decoded = jwt.verify(token, JWT_SECRET);

    // Benutzerinfo an Request anhängen
    req.user = decoded;
    console.log('Authentication successful for user:', decoded.email);
    next();
  } catch (error) {
    console.error('Authentication failed: Invalid token', error);
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
