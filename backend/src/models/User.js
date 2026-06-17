import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: {
      type: String,
      enum: ['Platform Admin', 'Institute Admin', 'Center Admin', 'Lecturer', 'Student'],
      required: true
    },
    instituteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', default: null, index: true },
    centerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Center', default: null, index: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', default: null, index: true },
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', default: null, index: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = function matchPassword(password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model('User', userSchema);
