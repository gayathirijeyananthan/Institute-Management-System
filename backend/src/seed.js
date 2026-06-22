import './config/env.js';
import { connectDB } from './config/db.js';
import Activity from './models/Activity.js';
import Announcement from './models/Announcement.js';
import Attendance from './models/Attendance.js';
import Center from './models/Center.js';
import Club from './models/Club.js';
import Cohort from './models/Cohort.js';
import Institute from './models/Institute.js';
import Module from './models/Module.js';
import Staff from './models/Staff.js';
import Student from './models/Student.js';
import Submission from './models/Submission.js';
import User from './models/User.js';

await connectDB();

await Promise.all([
  Activity.deleteMany({}),
  Announcement.deleteMany({}),
  Attendance.deleteMany({}),
  Center.deleteMany({}),
  Club.deleteMany({}),
  Cohort.deleteMany({}),
  Module.deleteMany({}),
  Staff.deleteMany({}),
  Student.deleteMany({}),
  Submission.deleteMany({}),
  User.deleteMany({}),
  Institute.deleteMany({})
]);

const institute = await Institute.create({
  instituteName: 'Northstar Technical Institute',
  email: 'admin@northstar.edu',
  phone: '+1555000111',
  password: 'Password123',
  address: '42 Learning Avenue, Colombo',
  role: 'Institute Admin'
});

const center = await Center.create({
  centerName: 'Main Campus',
  location: 'Colombo',
  instituteId: institute._id
});

const cohort = await Cohort.create({
  cohortName: 'MERN Bootcamp 2026',
  centerId: center._id,
  startDate: '2026-01-15',
  endDate: '2026-09-15',
  status: 'Active',
  instituteId: institute._id
});

const lecturer = await Staff.create({
  firstName: 'Maya',
  lastName: 'Fernando',
  email: 'maya@northstar.edu',
  phone: '+94770000003',
  role: 'Lecturer',
  centerId: center._id,
  instituteId: institute._id
});

const centerAdmin = await Staff.create({
  firstName: 'Nimal',
  lastName: 'Jayawardena',
  email: 'center@northstar.edu',
  phone: '+94770000004',
  role: 'Center Admin',
  centerId: center._id,
  instituteId: institute._id
});

const module = await Module.create({
  moduleName: 'Full Stack Application Development',
  code: 'MERN-501',
  description: 'Build production-ready MERN applications.',
  cohortId: cohort._id,
  centerId: center._id,
  lecturerId: lecturer._id,
  instituteId: institute._id
});

await Club.create({
  clubName: 'Innovation Club',
  description: 'Student-led product and startup practice group.',
  centerId: center._id,
  coordinatorId: lecturer._id,
  instituteId: institute._id
});

const students = await Student.insertMany([
  {
    studentId: 'NST-001',
    firstName: 'Asha',
    lastName: 'Perera',
    email: 'asha@example.com',
    phone: '+94770000001',
    gender: 'Female',
    dateOfBirth: '2003-05-03',
    address: 'Colombo',
    cohortId: cohort._id,
    centerId: center._id,
    instituteId: institute._id
  },
  {
    studentId: 'NST-002',
    firstName: 'Ravi',
    lastName: 'Silva',
    email: 'ravi@example.com',
    phone: '+94770000002',
    gender: 'Male',
    dateOfBirth: '2002-10-12',
    address: 'Kandy',
    cohortId: cohort._id,
    centerId: center._id,
    instituteId: institute._id
  }
]);

await Activity.create({
  title: 'Capstone Planning',
  description: 'Student teams finalize capstone topics.',
  date: '2026-06-20',
  cohortId: cohort._id,
  centerId: center._id,
  instituteId: institute._id
});

await Attendance.insertMany(
  students.map((student, index) => ({
    studentId: student._id,
    cohortId: cohort._id,
    centerId: center._id,
    date: '2026-06-17',
    status: index === 0 ? 'Present' : 'Late',
    instituteId: institute._id
  }))
);

await Announcement.create({
  title: 'Welcome to the portal',
  message: 'Use this dashboard to manage centers, cohorts, students, staff, attendance, modules, clubs, and submissions.',
  instituteId: institute._id
});

await User.create([
  {
    name: 'Platform Admin',
    email: 'platform@ims.com',
    password: 'Password123',
    role: 'Platform Admin'
  },
  {
    name: institute.instituteName,
    email: institute.email,
    password: 'Password123',
    role: 'Institute Admin',
    instituteId: institute._id
  },
  {
    name: `${centerAdmin.firstName} ${centerAdmin.lastName}`,
    email: centerAdmin.email,
    password: 'Password123',
    role: 'Center Admin',
    instituteId: institute._id,
    centerId: center._id,
    staffId: centerAdmin._id
  },
  {
    name: `${lecturer.firstName} ${lecturer.lastName}`,
    email: lecturer.email,
    password: 'Password123',
    role: 'Lecturer',
    instituteId: institute._id,
    centerId: center._id,
    staffId: lecturer._id
  },
  {
    name: `${students[0].firstName} ${students[0].lastName}`,
    email: students[0].email,
    password: 'Password123',
    role: 'Student',
    instituteId: institute._id,
    centerId: center._id,
    studentId: students[0]._id
  }
]);

console.log('Seed complete.');
console.log('Platform Admin: platform@ims.com / Password123');
console.log('Institute Admin: admin@northstar.edu / Password123');
console.log('Center Admin: center@northstar.edu / Password123');
console.log('Lecturer: maya@northstar.edu / Password123');
console.log('Student: asha@example.com / Password123');
process.exit(0);
