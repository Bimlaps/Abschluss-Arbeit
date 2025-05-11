const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { authenticate } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Konfiguration für Multer (Datei-Upload)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'public', 'uploads', 'blog'));
  },
  filename: (req, file, cb) => {
    const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Ungültiger Dateityp. Nur JPEG, PNG, GIF und WebP sind erlaubt.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB
  }
});

// Blog-Beiträge erstellen, aktualisieren und löschen (erfordert Authentifizierung)
router.post('/', authenticate, blogController.createBlogPost);
router.put('/:id', authenticate, blogController.updateBlogPost);
router.delete('/:id', authenticate, blogController.deleteBlogPost);

// Einzelnen Blog-Beitrag abrufen (öffentlich)
router.get('/:id', blogController.getBlogPost);

// Blog-Beiträge für eine Website abrufen (öffentlich)
router.get('/website/:websiteId', blogController.getBlogPostsByWebsite);

// Kommentar hinzufügen (öffentlich, aber Authentifizierung optional)
router.post('/:id/comments', blogController.addComment);

// Bild für Blog-Beitrag hochladen (erfordert Authentifizierung)
router.post('/upload', authenticate, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Keine Datei hochgeladen' });
    }
    
    const imageUrl = `/uploads/blog/${req.file.filename}`;
    res.json({ imageUrl });
  } catch (error) {
    console.error('Fehler beim Hochladen des Bildes:', error);
    res.status(500).json({ message: 'Serverfehler beim Hochladen des Bildes' });
  }
});

module.exports = router;
