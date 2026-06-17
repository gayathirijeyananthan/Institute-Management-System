import Activity from '../models/Activity.js';
import Announcement from '../models/Announcement.js';
import Attendance from '../models/Attendance.js';
import Center from '../models/Center.js';
import Club from '../models/Club.js';
import Cohort from '../models/Cohort.js';
import Module from '../models/Module.js';
import Staff from '../models/Staff.js';
import Student from '../models/Student.js';
import Submission from '../models/Submission.js';
import User from '../models/User.js';
import { createCrudController } from './crudFactory.js';

const tempPassword = 'Password123';

const ensureUserAccount = async ({ email, name, role, instituteId, centerId = null, studentId = null, staffId = null }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    existing.name = name;
    existing.role = role;
    existing.instituteId = instituteId;
    existing.centerId = centerId;
    existing.studentId = studentId;
    existing.staffId = staffId;
    await existing.save();
    return existing;
  }

  return User.create({
    name,
    email,
    password: tempPassword,
    role,
    instituteId,
    centerId,
    studentId,
    staffId
  });
};

export const centerController = createCrudController(Center, {
  searchFields: ['centerName', 'location'],
  centerSelf: true
});

export const cohortController = createCrudController(Cohort, {
  searchFields: ['cohortName', 'status'],
  filterFields: ['centerId', 'status'],
  centerScoped: true,
  populate: 'centerId'
});

export const studentController = createCrudController(Student, {
  searchFields: ['studentId', 'firstName', 'lastName', 'email', 'phone'],
  filterFields: ['cohortId', 'centerId'],
  letterField: 'firstName',
  centerScoped: true,
  studentScoped: true,
  populate: 'cohortId centerId',
  fileField: 'profileImage',
  async afterCreate(student) {
    await ensureUserAccount({
      email: student.email,
      name: `${student.firstName} ${student.lastName}`,
      role: 'Student',
      instituteId: student.instituteId,
      centerId: student.centerId,
      studentId: student._id
    });
  }
});

export const staffController = createCrudController(Staff, {
  searchFields: ['firstName', 'lastName', 'email', 'phone', 'role'],
  filterFields: ['centerId', 'role'],
  centerScoped: true,
  populate: 'centerId',
  async afterCreate(staff) {
    await ensureUserAccount({
      email: staff.email,
      name: `${staff.firstName} ${staff.lastName}`,
      role: staff.role,
      instituteId: staff.instituteId,
      centerId: staff.centerId,
      staffId: staff._id
    });
  }
});

export const activityController = createCrudController(Activity, {
  searchFields: ['title', 'description'],
  filterFields: ['cohortId', 'centerId'],
  centerScoped: true,
  populate: 'cohortId centerId'
});

export const attendanceController = createCrudController(Attendance, {
  filterFields: ['cohortId', 'studentId', 'status'],
  centerScoped: true,
  studentScoped: true,
  populate: 'studentId cohortId'
});

export const announcementController = createCrudController(Announcement, {
  searchFields: ['title', 'message']
});

export const moduleController = createCrudController(Module, {
  searchFields: ['moduleName', 'code', 'description'],
  filterFields: ['cohortId', 'centerId', 'lecturerId'],
  centerScoped: true,
  populate: 'cohortId centerId lecturerId'
});

export const clubController = createCrudController(Club, {
  searchFields: ['clubName', 'description'],
  filterFields: ['centerId', 'coordinatorId'],
  centerScoped: true,
  populate: 'centerId coordinatorId'
});

export const submissionController = createCrudController(Submission, {
  searchFields: ['title', 'notes', 'status'],
  filterFields: ['moduleId', 'activityId', 'cohortId', 'centerId', 'studentId', 'status'],
  centerScoped: true,
  studentScoped: true,
  populate: 'studentId moduleId activityId cohortId centerId',
  fileField: 'fileUrl'
});
