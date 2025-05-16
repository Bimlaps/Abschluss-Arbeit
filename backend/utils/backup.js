const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs').promises;
const { logInfo, logError } = require('./logger');

class BackupSystem {
  constructor() {
    this.backupDir = path.join(__dirname, '../backups');
    this.initialize();
  }

  async initialize() {
    try {
      await fs.mkdir(this.backupDir, { recursive: true });
    } catch (error) {
      logError('Fehler beim Erstellen des Backup-Verzeichnisses', error);
    }
  }

  /**
   * MongoDB Backup erstellen
   */
  async createMongoBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `mongodb-backup-${timestamp}.gz`;
    const outputPath = path.join(this.backupDir, filename);

    return new Promise((resolve, reject) => {
      const mongodump = spawn('mongodump', [
        '--uri', process.env.MONGODB_URI,
        '--gzip',
        '--archive=' + outputPath
      ]);

      mongodump.stdout.on('data', (data) => {
        logInfo('Mongodump Output:', data.toString());
      });

      mongodump.stderr.on('data', (data) => {
        logError('Mongodump Error:', data.toString());
      });

      mongodump.on('close', (code) => {
        if (code === 0) {
          logInfo('MongoDB Backup erfolgreich erstellt', { filename });
          resolve(outputPath);
        } else {
          reject(new Error(`MongoDB Backup fehlgeschlagen mit Code ${code}`));
        }
      });
    });
  }

  /**
   * Datei-Backup erstellen
   */
  async createFileBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `files-backup-${timestamp}.tar.gz`;
    const outputPath = path.join(this.backupDir, filename);
    const sourcePath = path.join(__dirname, '../public');

    return new Promise((resolve, reject) => {
      const tar = spawn('tar', [
        '-czf',
        outputPath,
        '-C',
        path.dirname(sourcePath),
        path.basename(sourcePath)
      ]);

      tar.stdout.on('data', (data) => {
        logInfo('Tar Output:', data.toString());
      });

      tar.stderr.on('data', (data) => {
        logError('Tar Error:', data.toString());
      });

      tar.on('close', (code) => {
        if (code === 0) {
          logInfo('Datei-Backup erfolgreich erstellt', { filename });
          resolve(outputPath);
        } else {
          reject(new Error(`Datei-Backup fehlgeschlagen mit Code ${code}`));
        }
      });
    });
  }

  /**
   * Alte Backups bereinigen
   */
  async cleanupOldBackups(maxAge = 30) { // maxAge in Tagen
    try {
      const files = await fs.readdir(this.backupDir);
      const now = Date.now();

      for (const file of files) {
        const filePath = path.join(this.backupDir, file);
        const stats = await fs.stat(filePath);
        const age = (now - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);

        if (age > maxAge) {
          await fs.unlink(filePath);
          logInfo('Altes Backup gelöscht', { file });
        }
      }
    } catch (error) {
      logError('Fehler beim Bereinigen alter Backups', error);
    }
  }

  /**
   * Vollständiges Backup erstellen
   */
  async createFullBackup() {
    try {
      const mongoBackup = await this.createMongoBackup();
      const fileBackup = await this.createFileBackup();
      await this.cleanupOldBackups();

      return {
        mongodb: mongoBackup,
        files: fileBackup,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logError('Fehler beim Erstellen des vollständigen Backups', error);
      throw error;
    }
  }

  /**
   * MongoDB Backup wiederherstellen
   */
  async restoreMongoBackup(backupPath) {
    return new Promise((resolve, reject) => {
      const mongorestore = spawn('mongorestore', [
        '--uri', process.env.MONGODB_URI,
        '--gzip',
        '--archive=' + backupPath,
        '--drop'
      ]);

      mongorestore.stdout.on('data', (data) => {
        logInfo('Mongorestore Output:', data.toString());
      });

      mongorestore.stderr.on('data', (data) => {
        logError('Mongorestore Error:', data.toString());
      });

      mongorestore.on('close', (code) => {
        if (code === 0) {
          logInfo('MongoDB Backup erfolgreich wiederhergestellt');
          resolve();
        } else {
          reject(new Error(`MongoDB Restore fehlgeschlagen mit Code ${code}`));
        }
      });
    });
  }

  /**
   * Datei-Backup wiederherstellen
   */
  async restoreFileBackup(backupPath) {
    const targetPath = path.join(__dirname, '../public');

    return new Promise((resolve, reject) => {
      const tar = spawn('tar', [
        '-xzf',
        backupPath,
        '-C',
        path.dirname(targetPath)
      ]);

      tar.stdout.on('data', (data) => {
        logInfo('Tar Extract Output:', data.toString());
      });

      tar.stderr.on('data', (data) => {
        logError('Tar Extract Error:', data.toString());
      });

      tar.on('close', (code) => {
        if (code === 0) {
          logInfo('Datei-Backup erfolgreich wiederhergestellt');
          resolve();
        } else {
          reject(new Error(`Datei-Restore fehlgeschlagen mit Code ${code}`));
        }
      });
    });
  }
}

module.exports = new BackupSystem(); 