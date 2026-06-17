import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true, trim: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    dateOfBirth: { type: Date, required: true },
    address: { type: String, required: true, trim: true },
    cohortId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cohort', required: true },
    centerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Center', required: true },
    instituteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true, index: true },
    profileImage: { type: String, default: '' }
  },
  { timestamps: true }
);

studentSchema.index({ instituteId: 1, studentId: 1 }, { unique: true });

export default mongoose.model('Student', studentSchema);
