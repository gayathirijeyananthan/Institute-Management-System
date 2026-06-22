import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const instituteSchema = new mongoose.Schema(
  {
    instituteName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    address: { type: String, required: true, trim: true },
    logo: { type: String, default: '' },
    role: {
      type: String,
      enum: ['Super Admin', 'Institute Admin', 'Teacher', 'Student'],
      default: 'Institute Admin'
    }
  },
  { timestamps: true }
);

instituteSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

instituteSchema.methods.matchPassword = function matchPassword(password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model('Institute', instituteSchema);
