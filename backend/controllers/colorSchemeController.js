const ColorScheme = require('../models/ColorScheme');
const { validationResult } = require('express-validator');

/**
 * @route   GET /api/color-schemes
 * @desc    Alle Farbschemata abrufen
 * @access  Public/Private
 */
exports.getColorSchemes = async (req, res) => {
  try {
    const colorSchemes = await ColorScheme.find();
    res.json(colorSchemes);
  } catch (error) {
    console.error('Error fetching color schemes:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @route   GET /api/color-schemes/:id
 * @desc    Ein Farbschema nach ID abrufen
 * @access  Public/Private
 */
exports.getColorSchemeById = async (req, res) => {
  try {
    const colorScheme = await ColorScheme.findById(req.params.id);
    
    if (!colorScheme) {
      return res.status(404).json({ message: 'Farbschema nicht gefunden' });
    }
    
    res.json(colorScheme);
  } catch (error) {
    console.error('Error fetching color scheme:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Farbschema nicht gefunden' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @route   POST /api/color-schemes
 * @desc    Neues Farbschema erstellen
 * @access  Private/Admin
 */
exports.createColorScheme = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description, primary, secondary, accent, text, background, isActive } = req.body;

  try {
    // Neues Farbschema erstellen
    const colorScheme = new ColorScheme({
      name,
      description,
      primary,
      secondary,
      accent,
      text,
      background,
      isActive: isActive !== undefined ? isActive : true
    });
    
    await colorScheme.save();
    res.status(201).json(colorScheme);
  } catch (error) {
    console.error('Error creating color scheme:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @route   PUT /api/color-schemes/:id
 * @desc    Farbschema aktualisieren
 * @access  Private/Admin
 */
exports.updateColorScheme = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description, primary, secondary, accent, text, background, isActive } = req.body;

  try {
    let colorScheme = await ColorScheme.findById(req.params.id);
    
    if (!colorScheme) {
      return res.status(404).json({ message: 'Farbschema nicht gefunden' });
    }
    
    // Farbschema aktualisieren
    if (name) colorScheme.name = name;
    if (description) colorScheme.description = description;
    if (primary) colorScheme.primary = primary;
    if (secondary) colorScheme.secondary = secondary;
    if (accent) colorScheme.accent = accent;
    if (text) colorScheme.text = text;
    if (background) colorScheme.background = background;
    if (isActive !== undefined) colorScheme.isActive = isActive;
    
    await colorScheme.save();
    res.json(colorScheme);
  } catch (error) {
    console.error('Error updating color scheme:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Farbschema nicht gefunden' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @route   DELETE /api/color-schemes/:id
 * @desc    Farbschema löschen
 * @access  Private/Admin
 */
exports.deleteColorScheme = async (req, res) => {
  try {
    const colorScheme = await ColorScheme.findById(req.params.id);
    
    if (!colorScheme) {
      return res.status(404).json({ message: 'Farbschema nicht gefunden' });
    }
    
    await colorScheme.remove();
    res.json({ message: 'Farbschema erfolgreich gelöscht' });
  } catch (error) {
    console.error('Error deleting color scheme:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Farbschema nicht gefunden' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @route   GET /api/color-schemes/stats
 * @desc    Farbschema-Statistiken abrufen
 * @access  Private/Admin
 */
exports.getColorSchemeStats = async (req, res) => {
  try {
    const totalColorSchemes = await ColorScheme.countDocuments();
    const activeColorSchemes = await ColorScheme.countDocuments({ isActive: true });
    const inactiveColorSchemes = await ColorScheme.countDocuments({ isActive: false });
    
    res.json({
      totalColorSchemes,
      activeColorSchemes,
      inactiveColorSchemes
    });
  } catch (error) {
    console.error('Error fetching color scheme stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
