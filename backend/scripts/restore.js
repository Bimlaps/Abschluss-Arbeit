const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);
const { logger } = require('../config/logger');
const dotenv = require('dotenv');

dotenv.config();

const BACKUP_DIR = path.join(__dirname, '../backups');

async function getAvailableBackups() {
  try {
    const files = await fs.readdir(BACKUP_DIR);
    
    // Gruppiere MongoDB und File Backups nach Timestamp
    const backups = {};
    
    files.forEach(file => {
      if (file.startsWith('mongodb-') || file.startsWith('files-')) {
        const timestamp = file.split('-').slice(1).join('-');
        if (!backups[timestamp]) {
          backups[timestamp] = {};
        }
        if (file.startsWith('mongodb-')) {
          backups[timestamp].mongodb = file;
        } else {
          backups[timestamp].files = file;
        }
      }
    });
    
    return backups;
  } catch (error) {
    logger.error('Fehler beim Abrufen der verfügbaren Backups:', error);
    throw error;
  }
}

async function restoreMongoBackup(backupName) {
  try {
    const backupPath = path.join(BACKUP_DIR, backupName);
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/247vitrine';
    
    // Führe mongorestore aus
    const cmd = `mongorestore --uri="${mongoUri}" --drop "${backupPath}"`;
    await execAsync(cmd);
    
    logger.info(`MongoDB Backup wiederhergestellt von: ${backupPath}`);
    return true;
  } catch (error) {
    logger.error('Fehler bei der MongoDB-Wiederherstellung:', error);
    throw error;
  }
}

async function restoreFileBackup(backupName) {
  try {
    const backupPath = path.join(BACKUP_DIR, backupName);
    const dirsToRestore = ['public', 'uploads', 'logs'];
    
    for (const dir of dirsToRestore) {
      const sourcePath = path.join(backupPath, dir);
      const targetPath = path.join(__dirname, '..', dir);
      
      try {
        // Prüfe ob das Backup-Verzeichnis existiert
        await fs.access(sourcePath);
        
        // Erstelle Zielverzeichnis falls es nicht existiert
        await fs.mkdir(targetPath, { recursive: true });
        
        // Kopiere Dateien
        await execAsync(`xcopy "${sourcePath}" "${targetPath}" /E /I /H /Y`);
        logger.info(`${dir} wiederhergestellt nach: ${targetPath}`);
      } catch (error) {
        if (error.code === 'ENOENT') {
          logger.warn(`Backup für ${dir} nicht gefunden, überspringe...`);
        } else {
          throw error;
        }
      }
    }
    
    return true;
  } catch (error) {
    logger.error('Fehler bei der Datei-Wiederherstellung:', error);
    throw error;
  }
}

async function performRestore(timestamp) {
  try {
    logger.info('Starte Wiederherstellungsprozess...');
    
    const backups = await getAvailableBackups();
    
    if (!backups[timestamp]) {
      throw new Error(`Kein Backup für Zeitstempel ${timestamp} gefunden`);
    }
    
    const { mongodb: mongoBackup, files: fileBackup } = backups[timestamp];
    
    if (!mongoBackup || !fileBackup) {
      throw new Error('Unvollständiges Backup gefunden');
    }
    
    // Führe Wiederherstellungen nacheinander aus
    await restoreMongoBackup(mongoBackup);
    await restoreFileBackup(fileBackup);
    
    logger.info('Wiederherstellung erfolgreich abgeschlossen');
    
    return {
      success: true,
      timestamp,
      mongoBackup,
      fileBackup
    };
  } catch (error) {
    logger.error('Wiederherstellung fehlgeschlagen:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Wenn das Script direkt ausgeführt wird
if (require.main === module) {
  const timestamp = process.argv[2];
  
  if (!timestamp) {
    console.error('Bitte geben Sie einen Zeitstempel an');
    process.exit(1);
  }
  
  performRestore(timestamp)
    .then(result => {
      if (result.success) {
        process.exit(0);
      } else {
        process.exit(1);
      }
    })
    .catch(() => process.exit(1));
}

module.exports = { performRestore, getAvailableBackups }; 