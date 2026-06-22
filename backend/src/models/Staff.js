import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    role: { type: String, enum: ['Super Admin', 'Institute Admin', 'Teacher', 'Student'], default: 'Teacher' },
    centerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Center', required: true },
    instituteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true, index: true }
  },
  { timestamps: true }
);

export default mongoose.model('Staff', staffSchema);
