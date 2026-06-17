import express from 'express';
import { body } from 'express-validator';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { validate } from '../middleware/validate.js';
import {
  activityController,
  announcementController,
  attendanceController,
  centerController,
  cohortController,
  staffController,
  studentController
} from '../controllers/resourceControllers.js';

const adminRoles = ['Super Admin', 'Institute Admin'];

const crudRoutes = (controller, validators = [], uploadField = null) => {
  const router = express.Router();
  const uploader = uploadField ? upload.single(uploadField) : (req, res, next) => next();
  router.use(protect);
  router.get('/', controller.list);
  router.get('/:id', controller.get);
  router.post('/', authorize(...adminRoles), uploader, validators, validate, controller.create);
  router.put('/:id', authorize(...adminRoles), uploader, validators, validate, controller.update);
  router.delete('/:id', authorize(...adminRoles), controller.remove);
  return router;
};

export const centerRoutes = crudRoutes(centerController, [
  body('centerName').notEmpty().withMessage('Center name is required'),
  body('location').notEmpty().withMessage('Location is required')
]);

export const cohortRoutes = crudRoutes(cohortController, [
  body('cohortName').notEmpty().withMessage('Cohort name is required'),
  body('centerId').isMongoId().withMessage('Valid center is required'),
  body('startDate').isISO8601().withMessage('Start date is required'),
  body('endDate').isISO8601().withMessage('End date is required'),
  body('status').optional().isIn(['Active', 'Completed', 'Upcoming'])
]);

export const studentRoutes = crudRoutes(
  studentController,
  [
    body('studentId').notEmpty().withMessage('Student ID is required'),
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').notEmpty().withMessage('Phone is required'),
    body('gender').isIn(['Male', 'Female', 'Other']),
    body('dateOfBirth').isISO8601(),
    body('address').notEmpty(),
    body('cohortId').isMongoId(),
    body('centerId').isMongoId()
  ],
  'profileImage'
);

export const staffRoutes = crudRoutes(staffController, [
  body('firstName').notEmpty(),
  body('lastName').notEmpty(),
  body('email').isEmail(),
  body('phone').notEmpty(),
  body('role').isIn(['Super Admin', 'Institute Admin', 'Teacher', 'Student']),
  body('centerId').isMongoId()
]);

export const activityRoutes = crudRoutes(activityController, [
  body('title').notEmpty(),
  body('description').notEmpty(),
  body('date').isISO8601(),
  body('cohortId').isMongoId(),
  body('centerId').isMongoId()
]);

export const attendanceRoutes = crudRoutes(attendanceController, [
  body('studentId').isMongoId(),
  body('cohortId').isMongoId(),
  body('date').isISO8601(),
  body('status').isIn(['Present', 'Absent', 'Late'])
]);

export const announcementRoutes = crudRoutes(announcementController, [
  body('title').notEmpty(),
  body('message').notEmpty()
]);
