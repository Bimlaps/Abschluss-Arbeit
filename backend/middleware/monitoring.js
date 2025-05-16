const { logAPICall, logPerformance, logError } = require('../utils/logger');

/**
 * API-Monitoring Middleware
 */
const apiMonitoring = (req, res, next) => {
  // Startzeit der Anfrage
  const start = Date.now();
  
  // Original end-Funktion speichern
  const originalEnd = res.end;
  
  // Response end überschreiben
  res.end = function(...args) {
    // Dauer berechnen
    const duration = Date.now() - start;
    
    // API-Call loggen
    logAPICall(
      req.method,
      req.originalUrl,
      duration,
      res.statusCode,
      {
        userAgent: req.get('user-agent'),
        ip: req.ip,
        userId: req.user ? req.user.id : null
      }
    );

    // Performance-Metrik loggen wenn Anfrage länger als 1 Sekunde dauert
    if (duration > 1000) {
      logPerformance('slow-api-call', duration, {
        method: req.method,
        endpoint: req.originalUrl,
        status: res.statusCode
      });
    }

    // Original end aufrufen
    originalEnd.apply(res, args);
  };

  next();
};

/**
 * Error-Monitoring Middleware
 */
const errorMonitoring = (err, req, res, next) => {
  // Error loggen
  logError('API Error', err, {
    method: req.method,
    url: req.originalUrl,
    userId: req.user ? req.user.id : null,
    body: req.body,
    query: req.query,
    params: req.params
  });

  // Error an Client senden
  res.status(err.status || 500).json({
    error: {
      message: process.env.NODE_ENV === 'production' 
        ? 'Ein Fehler ist aufgetreten.'
        : err.message
    }
  });
};

/**
 * Performance-Monitoring Middleware
 */
const performanceMonitoring = (req, res, next) => {
  // Performance-Timing starten
  const start = process.hrtime();

  // Response finish Event
  res.on('finish', () => {
    // Performance-Timing beenden
    const [seconds, nanoseconds] = process.hrtime(start);
    const duration = seconds * 1000 + nanoseconds / 1000000;

    // Performance-Metrik loggen
    logPerformance('request', duration, {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode
    });
  });

  next();
};

/**
 * Memory-Usage-Monitoring
 */
const memoryMonitoring = (req, res, next) => {
  const memoryUsage = process.memoryUsage();
  
  // Wenn Speichernutzung über 80%
  if (memoryUsage.heapUsed / memoryUsage.heapTotal > 0.8) {
    logPerformance('high-memory-usage', memoryUsage.heapUsed, {
      heapTotal: memoryUsage.heapTotal,
      external: memoryUsage.external,
      rss: memoryUsage.rss
    });
  }

  next();
};

module.exports = {
  apiMonitoring,
  errorMonitoring,
  performanceMonitoring,
  memoryMonitoring
}; 