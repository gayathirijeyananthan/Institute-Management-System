import Institute from '../models/Institute.js';
import Center from '../models/Center.js';
import Cohort from '../models/Cohort.js';
import Staff from '../models/Staff.js';
import Student from '../models/Student.js';

export const listInstitutes = async (req, res, next) => {
  try {
    const institutes = await Institute.find({}).select('-password').sort({ createdAt: -1 });
    const rows = await Promise.all(
      institutes.map(async (institute) => {
        const [centers, cohorts, students, staff] = await Promise.all([
          Center.countDocuments({ instituteId: institute._id }),
          Cohort.countDocuments({ instituteId: institute._id }),
          Student.countDocuments({ instituteId: institute._id }),
          Staff.countDocuments({ instituteId: institute._id })
        ]);
        return { ...institute.toObject(), totals: { centers, cohorts, students, staff } };
      })
    );
    res.json({ items: rows, total: rows.length, page: 1, pages: 1 });
  } catch (error) {
    next(error);
  }
};

export const getInstituteProfile = async (req, res, next) => {
  try {
    const id = req.user.role === 'Platform Admin' ? req.params.id : req.instituteId;
    const institute = await Institute.findById(id).select('-password');
    if (!institute) {
      res.status(404);
      throw new Error('Institute not found');
    }
    res.json(institute);
  } catch (error) {
    next(error);
  }
};

export const updateInstituteProfile = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    delete payload.password;
    delete payload.role;
    if (req.file) payload.logo = `/uploads/${req.file.filename}`;

    const institute = await Institute.findByIdAndUpdate(req.instituteId, payload, {
      new: true,
      runValidators: true
    }).select('-password');

    if (!institute) {
      res.status(404);
      throw new Error('Institute not found');
    }

    res.json(institute);
  } catch (error) {
    next(error);
  }
};
