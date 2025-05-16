const promClient = require('prom-client');
const { logger } = require('./logger');

// Erstelle Registry
const register = new promClient.Registry();

// Dummy-Middleware für Request Monitoring
const metricsMiddleware = (req, res, next) => {
  next();
};

// Dummy-Metrics Endpoint
const getMetrics = async (req, res) => {
  res.status(200).json({ status: 'metrics disabled for MVP' });
};

module.exports = {
  metricsMiddleware,
  getMetrics,
  register,
  metrics: {}
}; 