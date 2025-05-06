// Gemeinsame Konfigurationen für alle Dienste

export const API_VERSION = 'v1';

export const DEFAULT_PORT = 3000;

export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/247vitrine';

export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
export const JWT_EXPIRES_IN = '7d';

export const CORS_OPTIONS = {
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

export const TEMPLATES_BASE_PATH = process.env.TEMPLATES_PATH || './templates';

export const SITE_DOMAIN = process.env.SITE_DOMAIN || '247vitrine.ma';
