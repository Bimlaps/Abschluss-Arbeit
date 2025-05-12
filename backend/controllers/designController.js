const Design = require('../models/Design');
const Layout = require('../models/Layout');
const { validationResult } = require('express-validator');

/**
 * @route   GET /api/designs
 * @desc    Alle Designs abrufen
 * @access  Public/Private
 */
exports.getDesigns = async (req, res) => {
  try {
    const designs = await Design.find().populate('layout');
    res.json(designs);
  } catch (error) {
    console.error('Error fetching designs:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @route   GET /api/designs/:id
 * @desc    Ein Design nach ID abrufen
 * @access  Public/Private
 */
exports.getDesignById = async (req, res) => {
  try {
    const design = await Design.findById(req.params.id).populate('layout');
    
    if (!design) {
      return res.status(404).json({ message: 'Design nicht gefunden' });
    }
    
    res.json(design);
  } catch (error) {
    console.error('Error fetching design:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Design nicht gefunden' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @route   GET /api/designs/by-layout/:layoutId
 * @desc    Designs nach Layout-ID abrufen
 * @access  Public/Private
 */
exports.getDesignsByLayout = async (req, res) => {
  try {
    const designs = await Design.find({ layout: req.params.layoutId }).populate('layout');
    res.json(designs);
  } catch (error) {
    console.error('Error fetching designs by layout:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @route   GET /api/designs/by-category/:category
 * @desc    Designs nach Layout-Kategorie abrufen
 * @access  Public/Private
 */
exports.getDesignsByCategory = async (req, res) => {
  try {
    // Finde zuerst alle Layouts mit der angegebenen Kategorie
    const layouts = await Layout.find({ category: req.params.category });

    // Sammle alle Layout-IDs
    const layoutIds = layouts.map(layout => layout._id);

    // Finde alle Designs, die zu diesen Layouts gehören
    const designs = await Design.find({ layout: { $in: layoutIds } }).populate('layout');

    res.json(designs);
  } catch (error) {
    console.error('Error fetching designs by layout category:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @route   POST /api/designs
 * @desc    Neues Design erstellen
 * @access  Private/Admin
 */
exports.createDesign = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description, layout, css, js, previewImage, isActive } = req.body;

  try {
    // Prüfen, ob das Layout existiert
    const layoutExists = await Layout.findById(layout);
    if (!layoutExists) {
      return res.status(404).json({ message: 'Layout nicht gefunden' });
    }
    
    // Neues Design erstellen
    const design = new Design({
      name,
      description,
      layout,
      css,
      js,
      previewImage,
      isActive: isActive !== undefined ? isActive : true
    });
    
    await design.save();
    
    // Design mit Layout-Informationen zurückgeben
    const populatedDesign = await Design.findById(design._id).populate('layout');
    res.status(201).json(populatedDesign);
  } catch (error) {
    console.error('Error creating design:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @route   PUT /api/designs/:id
 * @desc    Design aktualisieren
 * @access  Private/Admin
 */
exports.updateDesign = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description, layout, css, js, previewImage, isActive } = req.body;

  try {
    let design = await Design.findById(req.params.id);
    
    if (!design) {
      return res.status(404).json({ message: 'Design nicht gefunden' });
    }
    
    // Wenn ein neues Layout angegeben wurde, prüfen, ob es existiert
    if (layout && layout !== design.layout.toString()) {
      const layoutExists = await Layout.findById(layout);
      if (!layoutExists) {
        return res.status(404).json({ message: 'Layout nicht gefunden' });
      }
    }
    
    // Design aktualisieren
    if (name) design.name = name;
    if (description) design.description = description;
    if (layout) design.layout = layout;
    if (css) design.css = css;
    if (js) design.js = js;
    if (previewImage) design.previewImage = previewImage;
    if (isActive !== undefined) design.isActive = isActive;
    
    await design.save();
    
    // Design mit Layout-Informationen zurückgeben
    const populatedDesign = await Design.findById(design._id).populate('layout');
    res.json(populatedDesign);
  } catch (error) {
    console.error('Error updating design:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Design nicht gefunden' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @route   DELETE /api/designs/:id
 * @desc    Design löschen
 * @access  Private/Admin
 */
exports.deleteDesign = async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);
    
    if (!design) {
      return res.status(404).json({ message: 'Design nicht gefunden' });
    }
    
    await design.remove();
    res.json({ message: 'Design erfolgreich gelöscht' });
  } catch (error) {
    console.error('Error deleting design:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Design nicht gefunden' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @route   GET /api/designs/stats
 * @desc    Design-Statistiken abrufen
 * @access  Private/Admin
 */
exports.getDesignStats = async (req, res) => {
  try {
    const totalDesigns = await Design.countDocuments();
    const activeDesigns = await Design.countDocuments({ isActive: true });
    const inactiveDesigns = await Design.countDocuments({ isActive: false });
    
    // Designs nach Layout gruppieren
    const designsByLayout = await Design.aggregate([
      {
        $group: {
          _id: '$layout',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'layouts',
          localField: '_id',
          foreignField: '_id',
          as: 'layoutInfo'
        }
      },
      {
        $project: {
          layout: { $arrayElemAt: ['$layoutInfo', 0] },
          count: 1
        }
      }
    ]);
    
    res.json({
      totalDesigns,
      activeDesigns,
      inactiveDesigns,
      designsByLayout
    });
  } catch (error) {
    console.error('Error fetching design stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
