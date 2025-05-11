const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const imageResolutions = require('../config/imageResolutions');

// Konfiguration für Multer (temporärer Speicher)
const storage = multer.memoryStorage();

// Dateifilter für Bildtypen
const fileFilter = (req, file, cb) => {
  // Akzeptierte Bildtypen
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Ungültiger Dateityp. Nur JPEG, PNG, WebP und GIF sind erlaubt.'), false);
  }
};

// Multer-Upload-Konfiguration
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB maximale Dateigröße
  },
  fileFilter,
});

// Stellt sicher, dass der Upload-Ordner existiert
const ensureUploadDir = () => {
  const uploadDir = path.join(__dirname, '../public/uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  return uploadDir;
};

// Verarbeitet das hochgeladene Bild basierend auf Layout und Bildtyp
const processImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Keine Datei hochgeladen' });
    }

    const { layoutType, imageType } = req.body;
    
    // Überprüfe, ob Layout und Bildtyp gültig sind
    if (!layoutType || !imageType || !imageResolutions[layoutType] || !imageResolutions[layoutType][imageType]) {
      return res.status(400).json({ message: 'Ungültiger Layout-Typ oder Bild-Typ' });
    }
    
    // Hole die Auflösung für den Bildtyp
    const resolution = imageResolutions[layoutType][imageType];
    
    // Erstelle einen eindeutigen Dateinamen
    const fileName = `${uuidv4()}.webp`;
    
    // Erstelle den Pfad für das Bild
    const uploadDir = ensureUploadDir();
    const filePath = path.join(uploadDir, fileName);
    
    // Verarbeite das Bild mit Sharp
    await sharp(req.file.buffer)
      .resize(resolution.width, resolution.height, {
        fit: 'cover',
        position: 'center'
      })
      .toFormat('webp', { quality: 85 })
      .toFile(filePath);
    
    // Erstelle die öffentliche URL
    const imageUrl = `/uploads/${fileName}`;
    
    // Sende die Antwort
    res.json({
      success: true,
      imageUrl,
      width: resolution.width,
      height: resolution.height,
      aspectRatio: resolution.aspectRatio
    });
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ message: 'Fehler bei der Bildverarbeitung' });
  }
};

module.exports = {
  upload,
  processImage
};
