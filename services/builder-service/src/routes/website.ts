import express from 'express';
import { body } from 'express-validator';
import * as websiteController from '../controllers/website';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Validation middleware
const createWebsiteValidation = [
  body('subdomain')
    .trim()
    .notEmpty()
    .withMessage('Subdomain ist erforderlich')
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Subdomain darf nur Kleinbuchstaben, Zahlen und Bindestriche enthalten'),
  body('templateId').notEmpty().withMessage('Template-ID ist erforderlich'),
  body('colorSchemeId').notEmpty().withMessage('Farbschema-ID ist erforderlich'),
  body('content').isObject().withMessage('Inhalt muss ein Objekt sein'),
];

const updateWebsiteValidation = [
  body('customDomain')
    .optional()
    .trim()
    .matches(/^[a-z0-9-]+\.[a-z]+$/)
    .withMessage('Ungültiges Domain-Format'),
];

// Apply authentication middleware to all routes
router.use(authenticate);

// Routes
router.post('/', createWebsiteValidation, websiteController.createWebsite);
router.get('/', websiteController.getUserWebsites);
router.get('/:id', websiteController.getWebsiteById);
router.put('/:id', updateWebsiteValidation, websiteController.updateWebsite);
router.delete('/:id', websiteController.deleteWebsite);

export default router;
