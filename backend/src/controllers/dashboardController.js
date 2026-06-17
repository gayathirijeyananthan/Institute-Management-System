import Attendance from '../models/Attendance.js';
import Center from '../models/Center.js';
import Cohort from '../models/Cohort.js';
import Staff from '../models/Staff.js';
import Student from '../models/Student.js';

export const getDashboard = async (req, res, next) => {
  try {
    const instituteId = req.instituteId;
    const [students, cohorts, centers, staff, attendanceSummary, growth] = await Promise.all([
      Student.countDocuments({ instituteId }),
      Cohort.countDocuments({ instituteId }),
      Center.countDocuments({ instituteId }),
      Staff.countDocuments({ instituteId }),
      Attendance.aggregate([
        { $match: { instituteId } },
        { $group: { _id: '$status', value: { $sum: 1 } } }
      ]),
      Student.aggregate([
        { $match: { instituteId } },
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

    res.json({
      totals: { students, cohorts, centers, staff },
      attendanceSummary: attendanceSummary.map((item) => ({ name: item._id, value: item.value })),
      studentGrowth: growth.map((item) => ({ month: item._id, students: item.students }))
    });
  } catch (error) {
    next(error);
  }
};
