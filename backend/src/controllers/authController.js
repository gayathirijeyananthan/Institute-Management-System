import Institute from '../models/Institute.js';
import { sendAuthCookie, signToken } from '../utils/tokens.js';

const authPayload = (institute) => ({
  id: institute._id,
  instituteName: institute.instituteName,
  email: institute.email,
  phone: institute.phone,
  address: institute.address,
  logo: institute.logo,
  role: institute.role
});

export const register = async (req, res, next) => {
  try {
    const existing = await Institute.findOne({ email: req.body.email });
    if (existing) {
      res.status(409);
      throw new Error('Email is already registered');
    }

    const institute = await Institute.create({
      ...req.body,
      logo: req.file ? `/uploads/${req.file.filename}` : req.body.logo
    });
    const token = signToken({ id: institute._id, role: institute.role });
    sendAuthCookie(res, token);
    res.status(201).json({ token, user: authPayload(institute) });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const institute = await Institute.findOne({ email: req.body.email }).select('+password');
    if (!institute || !(await institute.matchPassword(req.body.password))) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    const token = signToken({ id: institute._id, role: institute.role });
    sendAuthCookie(res, token);
    res.json({ token, user: authPayload(institute) });
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
