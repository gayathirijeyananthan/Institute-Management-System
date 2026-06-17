import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    cohortId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cohort', required: true },
    centerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Center', required: true },
    instituteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true, index: true }
  },
  { timestamps: true }
);

export default mongoose.model('Activity', activitySchema);
