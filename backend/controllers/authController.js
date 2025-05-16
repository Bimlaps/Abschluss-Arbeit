const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT Secret Key (sollte in .env-Datei sein)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Registrierung
exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Prüfe ob Benutzer bereits existiert
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'E-Mail ist bereits registriert' });
    }

    // Erstelle neuen Benutzer
    const user = new User({
      email,
      password,
      name
    });

    await user.save();

    // Generiere JWT Token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Benutzer erfolgreich registriert',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Fehler bei der Registrierung', error: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Finde Benutzer
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Ungültige E-Mail oder Passwort' });
    }

    // Überprüfe Passwort
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Ungültige E-Mail oder Passwort' });
    }

    // Generiere JWT Token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Erfolgreich eingeloggt',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Login', error: error.message });
  }
};

// Benutzerinfo abrufen
exports.getMe = async (req, res) => {
  try {
    console.log('getMe API called for user ID:', req.user.id);

    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      console.log('getMe failed: User not found with ID:', req.user.id);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('getMe successful for user:', user.email);
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error during getMe' });
  }
};
