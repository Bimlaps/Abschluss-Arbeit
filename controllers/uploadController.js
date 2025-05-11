const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');

// Konfiguration für Multer (Datei-Upload)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
    
    // Stelle sicher, dass das Verzeichnis existiert
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generiere einen eindeutigen Dateinamen
    const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  }
});

// Dateifilter für Multer
const fileFilter = (req, file, cb) => {
  // Erlaubte Dateitypen
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Ungültiger Dateityp. Nur JPEG, PNG, GIF und WebP sind erlaubt.'), false);
  }
};

// Multer-Upload-Middleware
exports.upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB
  }
});

/**
 * Verarbeitet ein hochgeladenes Bild (Größenanpassung, Optimierung)
 * @param {Object} req - Express-Request
 * @param {Object} res - Express-Response
 */
exports.processImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Keine Datei hochgeladen'
      });
    }

    const { width, height, quality } = req.body;
    const inputPath = req.file.path;
    const filename = path.basename(inputPath);
    const outputDir = path.join(__dirname, '..', 'public', 'uploads', 'processed');
    
    // Stelle sicher, dass das Ausgabeverzeichnis existiert
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const outputPath = path.join(outputDir, filename);
    
    // Bild verarbeiten
    let sharpInstance = sharp(inputPath);
    
    // Größe anpassen, wenn angegeben
    if (width || height) {
      sharpInstance = sharpInstance.resize({
        width: width ? parseInt(width) : undefined,
        height: height ? parseInt(height) : undefined,
        fit: 'inside',
        withoutEnlargement: true
      });
    }
    
    // Qualität anpassen, wenn angegeben
    const outputOptions = {};
    if (quality) {
      outputOptions.quality = parseInt(quality);
    }
    
    // Ausgabeformat basierend auf der Eingabedatei
    const ext = path.extname(filename).toLowerCase();
    if (ext === '.jpg' || ext === '.jpeg') {
      await sharpInstance.jpeg(outputOptions).toFile(outputPath);
    } else if (ext === '.png') {
      await sharpInstance.png(outputOptions).toFile(outputPath);
    } else if (ext === '.webp') {
      await sharpInstance.webp(outputOptions).toFile(outputPath);
    } else if (ext === '.gif') {
      // GIFs werden ohne Verarbeitung kopiert, da sharp keine GIF-Animation unterstützt
      fs.copyFileSync(inputPath, outputPath);
    }
    
    // Originaldatei löschen
    fs.unlinkSync(inputPath);
    
    // URL für das verarbeitete Bild
    const imageUrl = `/uploads/processed/${filename}`;
    
    res.json({
      success: true,
      message: 'Bild erfolgreich verarbeitet',
      imageUrl
    });
  } catch (error) {
    console.error('Fehler bei der Bildverarbeitung:', error);
    
    // Lösche die hochgeladene Datei im Fehlerfall
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: 'Fehler bei der Bildverarbeitung',
      error: error.message
    });
  }
};
