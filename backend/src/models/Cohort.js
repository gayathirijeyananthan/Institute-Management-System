import mongoose from 'mongoose';

const cohortSchema = new mongoose.Schema(
  {
    cohortName: { type: String, required: true, trim: true },
    centerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Center', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ['Active', 'Completed', 'Upcoming'], default: 'Upcoming' },
    instituteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true, index: true }
  },
  { timestamps: true }
);

export default mongoose.model('Cohort', cohortSchema);
