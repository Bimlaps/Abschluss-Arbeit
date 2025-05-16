const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);
const { logger } = require('../config/logger');
const dotenv = require('dotenv');

dotenv.config();

const BACKUP_DIR = path.join(__dirname, '../backups');
const MAX_BACKUPS = 7; // Maximale Anzahl der Backups die aufbewahrt werden

async function createBackupDirectory() {
  try {
    await fs.mkdir(BACKUP_DIR, { recursive: true });
    logger.info('Backup-Verzeichnis erstellt oder bereits vorhanden');
  } catch (error) {
    logger.error('Fehler beim Erstellen des Backup-Verzeichnisses:', error);
    throw error;
  }
}

async function createMongoBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(BACKUP_DIR, `mongodb-${timestamp}`);
  
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/247vitrine';
    const cmd = `mongodump --uri="${mongoUri}" --out="${backupPath}"`;
    
    await execAsync(cmd);
    logger.info(`MongoDB Backup erstellt in: ${backupPath}`);
    return backupPath;
  } catch (error) {
    logger.error('Fehler beim Erstellen des MongoDB Backups:', error);
    throw error;
  }
}

async function createFileBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(BACKUP_DIR, `files-${timestamp}`);
  
  try {
    await fs.mkdir(backupPath, { recursive: true });
    
    // Backup der wichtigen Verzeichnisse
    const dirsToBackup = ['public', 'uploads', 'logs'];
    
    for (const dir of dirsToBackup) {
      const sourcePath = path.join(__dirname, '..', dir);
      const targetPath = path.join(backupPath, dir);
      
      try {
        await fs.access(sourcePath);
        await execAsync(`xcopy "${sourcePath}" "${targetPath}" /E /I /H /Y`);
        logger.info(`Backup von ${dir} erstellt in: ${targetPath}`);
      } catch (error) {
        if (error.code === 'ENOENT') {
          logger.warn(`Verzeichnis ${dir} existiert nicht, überspringe...`);
        } else {
          throw error;
        }
      }
    }
    
    return backupPath;
  } catch (error) {
    logger.error('Fehler beim Erstellen des Datei-Backups:', error);
    throw error;
  }
}

async function cleanupOldBackups() {
  try {
    const files = await fs.readdir(BACKUP_DIR);
    
    // Sortiere Backups nach Datum (neueste zuerst)
    const backups = files
      .filter(f => f.startsWith('mongodb-') || f.startsWith('files-'))
      .sort()
      .reverse();
    
    // Lösche alte Backups
    if (backups.length > MAX_BACKUPS) {
      const toDelete = backups.slice(MAX_BACKUPS);
      for (const backup of toDelete) {
        const backupPath = path.join(BACKUP_DIR, backup);
        await fs.rm(backupPath, { recursive: true, force: true });
        logger.info(`Altes Backup gelöscht: ${backup}`);
      }
    }
  } catch (error) {
    logger.error('Fehler beim Aufräumen alter Backups:', error);
    throw error;
  }
}

async function performBackup() {
  try {
    logger.info('Starte Backup-Prozess...');
    
    await createBackupDirectory();
    
    // Führe Backups parallel aus
    const [mongoBackupPath, fileBackupPath] = await Promise.all([
      createMongoBackup(),
      createFileBackup()
    ]);
    
    await cleanupOldBackups();
    
    logger.info('Backup erfolgreich abgeschlossen');
    logger.info(`MongoDB Backup: ${mongoBackupPath}`);
    logger.info(`Datei Backup: ${fileBackupPath}`);
    
    return {
      success: true,
      mongoBackupPath,
      fileBackupPath
    };
  } catch (error) {
    logger.error('Backup fehlgeschlagen:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Wenn das Script direkt ausgeführt wird
if (require.main === module) {
  performBackup()
    .then(result => {
      if (result.success) {
        process.exit(0);
      } else {
        process.exit(1);
      }
    })
    .catch(() => process.exit(1));
}

module.exports = { performBackup }; 