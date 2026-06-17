import express from 'express';
import { body } from 'express-validator';
import { getInstituteProfile, listInstitutes, updateInstituteProfile } from '../controllers/instituteController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.use(protect);
router.get('/', authorize('Platform Admin'), listInstitutes);
router.get('/profile', authorize('Institute Admin'), getInstituteProfile);
router.put(
  '/profile',
  authorize('Institute Admin'),
  upload.single('logo'),
  [
    body('instituteName').optional().notEmpty(),
    body('email').optional().isEmail(),
    body('phone').optional().notEmpty(),
    body('address').optional().notEmpty()
  ],
  validate,
  updateInstituteProfile
);
router.get('/:id', authorize('Platform Admin'), getInstituteProfile);

export default router;
