import express from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/auth';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Validation middleware
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name ist erforderlich'),
  body('email').isEmail().normalizeEmail().withMessage('Gültige E-Mail-Adresse erforderlich'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Passwort muss mindestens 6 Zeichen lang sein'),
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Gültige E-Mail-Adresse erforderlich'),
  body('password').notEmpty().withMessage('Passwort ist erforderlich'),
];

// Routes
router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);
router.get('/profile', authenticate, authController.getProfile);

export default router;
