import Institute from '../models/Institute.js';
import User from '../models/User.js';
import { sendAuthCookie, signToken } from '../utils/tokens.js';

const authPayload = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  instituteId: user.instituteId?._id || user.instituteId || null,
  instituteName: user.instituteId?.instituteName || 'Platform Administration',
  centerId: user.centerId?._id || user.centerId || null,
  centerName: user.centerId?.centerName || null,
  studentId: user.studentId?._id || user.studentId || null,
  staffId: user.staffId?._id || user.staffId || null
});

export const register = async (req, res, next) => {
  try {
    const existing = await User.findOne({ email: req.body.email });
    const existingInstitute = await Institute.findOne({ email: req.body.email });
    if (existing || existingInstitute) {
      res.status(409);
      throw new Error('Email is already registered');
    }

    const institute = await Institute.create({
      ...req.body,
      logo: req.file ? `/uploads/${req.file.filename}` : req.body.logo
    });

    const user = await User.create({
      name: institute.instituteName,
      email: institute.email,
      password: req.body.password,
      role: 'Institute Admin',
      instituteId: institute._id
    });

    await user.populate('instituteId');
    const token = signToken({ id: user._id, role: user.role });
    sendAuthCookie(res, token);
    res.status(201).json({ token, user: authPayload(user) });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email })
      .select('+password')
      .populate('instituteId centerId studentId staffId');
    if (!user || !(await user.matchPassword(req.body.password))) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    const token = signToken({ id: user._id, role: user.role });
    sendAuthCookie(res, token);
    res.json({ token, user: authPayload(user) });
  } catch (error) {
    next(error);
  }
};

export const me = async (req, res) => {
  res.json({ user: authPayload(req.user) });
};

export const logout = async (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
};
