import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    const bearer = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : null;
    const token = bearer || req.cookies?.token;

    if (!token) {
      res.status(401);
      throw new Error('Not authorized, token missing');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password').populate('instituteId centerId studentId staffId');

    if (!user || !user.isActive) {
      res.status(401);
      throw new Error('Not authorized, account missing');
    }

    req.user = user;
    req.instituteId = user.instituteId?._id || null;
    req.centerId = user.centerId?._id || null;
    req.studentId = user.studentId?._id || null;
    req.staffId = user.staffId?._id || null;
    next();
  } catch (error) {
    res.status(401);
    next(error);
  }
};

export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    res.status(403);
    return next(new Error('Forbidden: insufficient role'));
  }
  next();
};

export const requireInstituteScope = (req, res, next) => {
  if (req.user.role !== 'Platform Admin' && !req.instituteId) {
    res.status(403);
    return next(new Error('Institute scope is required'));
  }
  next();
};
