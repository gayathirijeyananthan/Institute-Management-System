import Attendance from '../models/Attendance.js';
import Center from '../models/Center.js';
import Cohort from '../models/Cohort.js';
import Institute from '../models/Institute.js';
import Module from '../models/Module.js';
import Staff from '../models/Staff.js';
import Student from '../models/Student.js';
import Submission from '../models/Submission.js';

export const getDashboard = async (req, res, next) => {
  try {
    if (req.user.role === 'Platform Admin') {
      const [institutes, students, centers, staff] = await Promise.all([
        Institute.countDocuments({}),
        Student.countDocuments({}),
        Center.countDocuments({}),
        Staff.countDocuments({})
      ]);
      return res.json({
        scope: 'platform',
        totals: { institutes, students, centers, staff },
        attendanceSummary: [],
        studentGrowth: []
      });
    }

    const instituteId = req.instituteId;
    const baseFilter = { instituteId };
    if (['Center Admin', 'Lecturer'].includes(req.user.role)) baseFilter.centerId = req.centerId;
    if (req.user.role === 'Student') baseFilter.studentId = req.studentId;

    const [students, cohorts, centers, staff, attendanceSummary, growth] = await Promise.all([
      Student.countDocuments(req.user.role === 'Student' ? { _id: req.studentId } : baseFilter),
      Cohort.countDocuments({ instituteId, ...(req.centerId ? { centerId: req.centerId } : {}) }),
      Center.countDocuments(req.centerId ? { _id: req.centerId } : { instituteId }),
      Staff.countDocuments(baseFilter),
      Attendance.aggregate([
        { $match: baseFilter },
        { $group: { _id: '$status', value: { $sum: 1 } } }
      ]),
      Student.aggregate([
        { $match: req.user.role === 'Student' ? { _id: req.studentId } : baseFilter },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
            students: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } },
        { $limit: 12 }
      ])
    ]);

    const [modules, submissions] = await Promise.all([
      Module.countDocuments({ instituteId, ...(req.centerId ? { centerId: req.centerId } : {}) }),
      Submission.countDocuments(baseFilter)
    ]);

    res.json({
      scope: req.user.role,
      totals: { students, cohorts, centers, staff, modules, submissions },
      attendanceSummary: attendanceSummary.map((item) => ({ name: item._id, value: item.value })),
      studentGrowth: growth.map((item) => ({ month: item._id, students: item.students }))
    });
  } catch (error) {
    next(error);
  }
};
