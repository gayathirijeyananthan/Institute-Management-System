import Activity from '../models/Activity.js';
import Announcement from '../models/Announcement.js';
import Attendance from '../models/Attendance.js';
import Center from '../models/Center.js';
import Cohort from '../models/Cohort.js';
import Staff from '../models/Staff.js';
import Student from '../models/Student.js';
import { createCrudController } from './crudFactory.js';

export const centerController = createCrudController(Center, {
  searchFields: ['centerName', 'location']
});

export const cohortController = createCrudController(Cohort, {
  searchFields: ['cohortName', 'status'],
  filterFields: ['centerId', 'status'],
  populate: 'centerId'
});

export const studentController = createCrudController(Student, {
  searchFields: ['studentId', 'firstName', 'lastName', 'email', 'phone'],
  filterFields: ['cohortId', 'centerId'],
  letterField: 'firstName',
  populate: 'cohortId centerId',
  fileField: 'profileImage'
});

export const staffController = createCrudController(Staff, {
  searchFields: ['firstName', 'lastName', 'email', 'phone', 'role'],
  filterFields: ['centerId', 'role'],
  populate: 'centerId'
});

export const activityController = createCrudController(Activity, {
  searchFields: ['title', 'description'],
  filterFields: ['cohortId', 'centerId'],
  populate: 'cohortId centerId'
});

export const attendanceController = createCrudController(Attendance, {
  filterFields: ['cohortId', 'studentId', 'status'],
  populate: 'studentId cohortId'
});

export const announcementController = createCrudController(Announcement, {
  searchFields: ['title', 'message']
});
