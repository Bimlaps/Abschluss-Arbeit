const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { authenticate, authorize } = require('../middleware/auth');

// Controller importieren
const userController = require('../controllers/userController');
const templateController = require('../controllers/templateController');
const designController = require('../controllers/designController');
const colorSchemeController = require('../controllers/colorSchemeController');

// Middleware für Admin-Routen
const adminAuth = [authenticate, authorize(['admin'])];

// Benutzer-Routen
router.get('/users/stats', adminAuth, userController.getUserStats);
router.get('/users', adminAuth, userController.getUsers);
router.get('/users/:id', adminAuth, userController.getUserById);
router.post(
  '/users',
  [
    adminAuth,
    [
      check('firstName', 'Vorname ist erforderlich').not().isEmpty(),
      check('lastName', 'Nachname ist erforderlich').not().isEmpty(),
      check('email', 'Bitte geben Sie eine gültige E-Mail-Adresse ein').isEmail(),
      check('password', 'Bitte geben Sie ein Passwort mit mindestens 6 Zeichen ein').isLength({ min: 6 })
    ]
  ],
  userController.createUser
);
router.put(
  '/users/:id',
  [
    adminAuth,
    [
      check('email', 'Bitte geben Sie eine gültige E-Mail-Adresse ein').optional().isEmail(),
      check('password', 'Passwort muss mindestens 6 Zeichen haben').optional().isLength({ min: 6 })
    ]
  ],
  userController.updateUser
);
router.delete('/users/:id', adminAuth, userController.deleteUser);

// Template-Routen
router.get('/templates/stats', adminAuth, templateController.getTemplateStats);
router.get('/templates', adminAuth, templateController.getTemplates);
router.get('/templates/:id', adminAuth, templateController.getTemplateById);
router.post(
  '/templates',
  [
    adminAuth,
    [
      check('name', 'Name ist erforderlich').not().isEmpty(),
      check('layout', 'Layout ist erforderlich').not().isEmpty()
    ]
  ],
  templateController.createTemplate
);
router.put(
  '/templates/:id',
  adminAuth,
  templateController.updateTemplate
);
router.delete('/templates/:id', adminAuth, templateController.deleteTemplate);

// Design-Routen
router.get('/designs/stats', adminAuth, designController.getDesignStats);
router.get('/designs/by-layout/:layoutId', adminAuth, designController.getDesignsByLayout);
router.get('/designs/by-category/:category', adminAuth, designController.getDesignsByCategory);
router.get('/designs', adminAuth, designController.getDesigns);
router.get('/designs/:id', adminAuth, designController.getDesignById);
router.post(
  '/designs',
  [
    adminAuth,
    [
      check('name', 'Name ist erforderlich').not().isEmpty(),
      check('layout', 'Layout ist erforderlich').not().isEmpty()
    ]
  ],
  designController.createDesign
);
router.put(
  '/designs/:id',
  adminAuth,
  designController.updateDesign
);
router.delete('/designs/:id', adminAuth, designController.deleteDesign);

// Farbschema-Routen
router.get('/color-schemes/stats', adminAuth, colorSchemeController.getColorSchemeStats);
router.get('/color-schemes', adminAuth, colorSchemeController.getColorSchemes);
router.get('/color-schemes/:id', adminAuth, colorSchemeController.getColorSchemeById);
router.post(
  '/color-schemes',
  [
    adminAuth,
    [
      check('name', 'Name ist erforderlich').not().isEmpty(),
      check('primary', 'Primärfarbe ist erforderlich').not().isEmpty(),
      check('secondary', 'Sekundärfarbe ist erforderlich').not().isEmpty(),
      check('text', 'Textfarbe ist erforderlich').not().isEmpty(),
      check('background', 'Hintergrundfarbe ist erforderlich').not().isEmpty()
    ]
  ],
  colorSchemeController.createColorScheme
);
router.put(
  '/color-schemes/:id',
  adminAuth,
  colorSchemeController.updateColorScheme
);
router.delete('/color-schemes/:id', adminAuth, colorSchemeController.deleteColorScheme);

// Dashboard-Statistiken
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    // Benutzerstatistiken
    const userStats = await userController.getUserStats(req, res);

    // Template-Statistiken
    const templateStats = await templateController.getTemplateStats(req, res);

    // Design-Statistiken
    const designStats = await designController.getDesignStats(req, res);

    // Farbschema-Statistiken
    const colorSchemeStats = await colorSchemeController.getColorSchemeStats(req, res);

    // Kombinierte Statistiken zurückgeben
    res.json({
      userStats,
      templateStats,
      designStats,
      colorSchemeStats
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
