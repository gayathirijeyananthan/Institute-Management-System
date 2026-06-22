import './config/env.js';
import { connectDB } from './config/db.js';
import Activity from './models/Activity.js';
import Announcement from './models/Announcement.js';
import Attendance from './models/Attendance.js';
import Center from './models/Center.js';
import Cohort from './models/Cohort.js';
import Institute from './models/Institute.js';
import Staff from './models/Staff.js';
import Student from './models/Student.js';

await connectDB();

await Promise.all([
  Activity.deleteMany({}),
  Announcement.deleteMany({}),
  Attendance.deleteMany({}),
  Center.deleteMany({}),
  Cohort.deleteMany({}),
  Staff.deleteMany({}),
  Student.deleteMany({}),
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

await Staff.create({
  firstName: 'Maya',
  lastName: 'Fernando',
  email: 'maya@northstar.edu',
  phone: '+94770000003',
  role: 'Teacher',
  centerId: center._id,
  instituteId: institute._id
});

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
    date: '2026-06-17',
    status: index === 0 ? 'Present' : 'Late',
    instituteId: institute._id
  }))
);

await Announcement.create({
  title: 'Welcome to the portal',
  message: 'Use this dashboard to manage centers, cohorts, students, staff, attendance, and activities.',
  instituteId: institute._id
});

console.log('Seed complete. Login: admin@northstar.edu / Password123');
process.exit(0);
