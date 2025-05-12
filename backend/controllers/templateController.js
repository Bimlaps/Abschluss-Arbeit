const Template = require('../models/Template');
const { validationResult } = require('express-validator');

/**
 * @route   GET /api/templates
 * @desc    Alle Templates abrufen
 * @access  Public/Private
 */
exports.getTemplates = async (req, res) => {
  try {
    const user = req.user;
    let query = {};

    // Wenn der Benutzer ein Kunde ist, nur öffentliche Templates anzeigen
    if (user && user.role === 'customer') {
      query.isPublic = true;
    }

    const templates = await Template.find(query);
    res.json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @route   GET /api/templates/:id
 * @desc    Ein Template nach ID abrufen
 * @access  Public/Private
 */
exports.getTemplateById = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    
    if (!template) {
      return res.status(404).json({ message: 'Template nicht gefunden' });
    }
    
    // Prüfen, ob der Benutzer Zugriff auf das Template hat
    const user = req.user;
    if (user && user.role === 'customer' && !template.isPublic) {
      return res.status(403).json({ message: 'Keine Berechtigung für dieses Template' });
    }
    
    res.json(template);
  } catch (error) {
    console.error('Error fetching template:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Template nicht gefunden' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @route   POST /api/templates
 * @desc    Neues Template erstellen
 * @access  Private/Admin
 */
exports.createTemplate = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description, layout, html, css, js, isPublic } = req.body;

  try {
    // Neues Template erstellen
    const template = new Template({
      name,
      description,
      layout,
      html,
      css,
      js,
      isPublic: isPublic !== undefined ? isPublic : true
    });
    
    await template.save();
    res.status(201).json(template);
  } catch (error) {
    console.error('Error creating template:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @route   PUT /api/templates/:id
 * @desc    Template aktualisieren
 * @access  Private/Admin
 */
exports.updateTemplate = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description, layout, html, css, js, isPublic } = req.body;

  try {
    let template = await Template.findById(req.params.id);
    
    if (!template) {
      return res.status(404).json({ message: 'Template nicht gefunden' });
    }
    
    // Template aktualisieren
    if (name) template.name = name;
    if (description) template.description = description;
    if (layout) template.layout = layout;
    if (html) template.html = html;
    if (css) template.css = css;
    if (js) template.js = js;
    if (isPublic !== undefined) template.isPublic = isPublic;
    
    await template.save();
    res.json(template);
  } catch (error) {
    console.error('Error updating template:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Template nicht gefunden' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @route   DELETE /api/templates/:id
 * @desc    Template löschen
 * @access  Private/Admin
 */
exports.deleteTemplate = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    
    if (!template) {
      return res.status(404).json({ message: 'Template nicht gefunden' });
    }
    
    await template.remove();
    res.json({ message: 'Template erfolgreich gelöscht' });
  } catch (error) {
    console.error('Error deleting template:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Template nicht gefunden' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @route   GET /api/templates/stats
 * @desc    Template-Statistiken abrufen
 * @access  Private/Admin
 */
exports.getTemplateStats = async (req, res) => {
  try {
    const totalTemplates = await Template.countDocuments();
    const publicTemplates = await Template.countDocuments({ isPublic: true });
    const privateTemplates = await Template.countDocuments({ isPublic: false });
    
    // Templates nach Layout gruppieren
    const templatesByLayout = await Template.aggregate([
      {
        $group: {
          _id: '$layout',
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.json({
      totalTemplates,
      publicTemplates,
      privateTemplates,
      templatesByLayout
    });
  } catch (error) {
    console.error('Error fetching template stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
