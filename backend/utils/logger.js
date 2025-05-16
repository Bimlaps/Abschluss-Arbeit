const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Erstelle Logs-Verzeichnis, falls es nicht existiert
const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Logger-Konfiguration
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: '247vitrine' },
  transports: [
    // Fehler-Logs
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Kombinierte Logs
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  ]
});

// Entwicklungs-Logging
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// Logger-Funktionen
const logInfo = (message, meta = {}) => {
  logger.info(message, { ...meta, timestamp: new Date().toISOString() });
};

const logError = (message, error = null, meta = {}) => {
  logger.error(message, {
    ...meta,
    error: error ? {
      message: error.message,
      stack: error.stack,
      ...error
    } : null,
    timestamp: new Date().toISOString()
  });
};

const logWarning = (message, meta = {}) => {
  logger.warn(message, { ...meta, timestamp: new Date().toISOString() });
};

const logDebug = (message, meta = {}) => {
  logger.debug(message, { ...meta, timestamp: new Date().toISOString() });
};

// Performance-Logging
const logPerformance = (action, duration, meta = {}) => {
  logger.info('Performance Metric', {
    action,
    duration,
    ...meta,
    type: 'performance',
    timestamp: new Date().toISOString()
  });
};

// Security-Logging
const logSecurity = (event, meta = {}) => {
  logger.warn('Security Event', {
    event,
    ...meta,
    type: 'security',
    timestamp: new Date().toISOString()
  });
};

// API-Logging
const logAPICall = (method, endpoint, duration, status, meta = {}) => {
  logger.info('API Call', {
    method,
    endpoint,
    duration,
    status,
    ...meta,
    type: 'api',
    timestamp: new Date().toISOString()
  });
};

// User-Activity-Logging
const logUserActivity = (userId, action, meta = {}) => {
  logger.info('User Activity', {
    userId,
    action,
    ...meta,
    type: 'user_activity',
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  logger,
  logInfo,
  logError,
  logWarning,
  logDebug,
  logPerformance,
  logSecurity,
  logAPICall,
  logUserActivity
}; 