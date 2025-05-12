const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

/**
 * @route   GET /api/users
 * @desc    Alle Benutzer abrufen
 * @access  Private/Admin
 */
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @route   GET /api/users/:id
 * @desc    Einen Benutzer nach ID abrufen
 * @access  Private/Admin
 */
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Benutzer nicht gefunden' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @route   POST /api/users
 * @desc    Neuen Benutzer erstellen
 * @access  Private/Admin
 */
exports.createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstName, lastName, email, password, role, status } = req.body;

  try {
    // Prüfen, ob Benutzer bereits existiert
    let user = await User.findOne({ email });
    
    if (user) {
      return res.status(400).json({ message: 'Benutzer existiert bereits' });
    }
    
    // Neuen Benutzer erstellen
    user = new User({
      firstName,
      lastName,
      email,
      password,
      role: role || 'customer',
      status: status || 'active'
    });
    
    // Passwort hashen
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    
    // Benutzer speichern
    await user.save();
    
    // Passwort aus der Antwort entfernen
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.status(201).json(userResponse);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @route   PUT /api/users/:id
 * @desc    Benutzer aktualisieren
 * @access  Private/Admin
 */
exports.updateUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstName, lastName, email, password, role, status } = req.body;

  try {
    let user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden' });
    }
    
    // Benutzer aktualisieren
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (role) user.role = role;
    if (status) user.status = status;
    
    // Passwort aktualisieren, wenn angegeben
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }
    
    await user.save();
    
    // Passwort aus der Antwort entfernen
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.json(userResponse);
  } catch (error) {
    console.error('Error updating user:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Benutzer nicht gefunden' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @route   DELETE /api/users/:id
 * @desc    Benutzer löschen
 * @access  Private/Admin
 */
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden' });
    }
    
    // Prüfen, ob der Benutzer sich selbst löschen möchte
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ message: 'Sie können Ihren eigenen Account nicht löschen' });
    }
    
    await user.remove();
    
    res.json({ message: 'Benutzer erfolgreich gelöscht' });
  } catch (error) {
    console.error('Error deleting user:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Benutzer nicht gefunden' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @route   GET /api/users/stats
 * @desc    Benutzerstatistiken abrufen
 * @access  Private/Admin
 */
exports.getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const customerCount = await User.countDocuments({ role: 'customer' });
    const adminCount = await User.countDocuments({ role: 'admin' });
    const activeUsers = await User.countDocuments({ status: 'active' });
    const inactiveUsers = await User.countDocuments({ status: 'inactive' });
    
    // Neue Benutzer in den letzten 30 Tagen
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const newUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    res.json({
      totalUsers,
      customerCount,
      adminCount,
      activeUsers,
      inactiveUsers,
      newUsers
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
