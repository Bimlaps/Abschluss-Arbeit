const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT Secret Key (sollte in .env-Datei sein)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Registrierung
exports.register = async (req, res) => {
  try {
    console.log('Register API called with data:', { ...req.body, password: '***' });

    const { email, password, firstName, lastName, company } = req.body;

    // Prüfe, ob Benutzer bereits existiert
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Registration failed: User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Erstelle neuen Benutzer
    const user = new User({
      email,
      password,
      firstName,
      lastName,
      company,
      role: 'customer' // Standard-Rolle ist Kunde
    });

    await user.save();
    console.log('New user created with ID:', user._id);

    // Erstelle JWT Token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log('JWT token created for user:', email);

    const responseData = {
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    };

    console.log('Registration successful, sending response');
    res.status(201).json(responseData);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    console.log('Login API called with email:', req.body.email);

    const { email, password } = req.body;

    // Finde Benutzer
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Login failed: User not found:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Überprüfe Passwort
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Login failed: Invalid password for user:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('Login successful for user:', email);

    // Erstelle JWT Token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log('JWT token created for user:', email);

    const responseData = {
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    };

    console.log('Login successful, sending response');
    res.json(responseData);
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
