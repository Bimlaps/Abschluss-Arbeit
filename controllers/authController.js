const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT Secret Key (sollte in .env-Datei sein)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Benutzerregistrierung
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    // Prüfen, ob der Benutzer bereits existiert
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Neuen Benutzer erstellen
    user = new User({
      firstName,
      lastName,
      email,
      password,
      role: role || 'customer' // Standardrolle ist 'customer'
    });

    // Benutzer speichern (Passwort wird in der save-Methode gehasht)
    await user.save();

    // JWT-Token erstellen
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Benutzeranmeldung
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Benutzer in der Datenbank suchen
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Passwort überprüfen
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // JWT-Token erstellen
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
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
