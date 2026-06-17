import jwt from 'jsonwebtoken';
import Institute from '../models/Institute.js';

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
    const institute = await Institute.findById(decoded.id).select('-password');

    if (!institute) {
      res.status(401);
      throw new Error('Not authorized, account missing');
    }

    req.user = institute;
    req.instituteId = institute._id;
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
