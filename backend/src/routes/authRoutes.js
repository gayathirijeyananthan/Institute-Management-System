import express from 'express';
import { body } from 'express-validator';
import { login, logout, me, register } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.post(
  '/register',
  upload.single('logo'),
  [
    body('instituteName').notEmpty().withMessage('Institute name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('address').notEmpty().withMessage('Address is required')
  ],
  validate,
  register
);

router.post(
  '/login',
  [body('email').isEmail().withMessage('Valid email is required'), body('password').notEmpty().withMessage('Password is required')],
  validate,
  login
);

router.get('/me', protect, me);
router.post('/logout', protect, logout);

export default router;
