import express from 'express';
import { body } from 'express-validator';
import * as templateController from '../controllers/template';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = express.Router();

// Validation middleware
const templateValidation = [
  body('name').trim().notEmpty().withMessage('Name ist erforderlich'),
  body('description').trim().notEmpty().withMessage('Beschreibung ist erforderlich'),
  body('thumbnail').trim().notEmpty().withMessage('Thumbnail-URL ist erforderlich'),
  body('htmlStructure').trim().notEmpty().withMessage('HTML-Struktur ist erforderlich'),
  body('cssStructure').trim().notEmpty().withMessage('CSS-Struktur ist erforderlich'),
];

// Public routes
router.get('/', templateController.getAllTemplates);
router.get('/:id', templateController.getTemplateById);

// Admin-only routes
router.post('/', authenticate, requireAdmin, templateValidation, templateController.createTemplate);
router.put('/:id', authenticate, requireAdmin, templateController.updateTemplate);
router.delete('/:id', authenticate, requireAdmin, templateController.deleteTemplate);

export default router;
