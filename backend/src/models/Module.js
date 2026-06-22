import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema(
  {
    moduleName: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    cohortId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cohort', required: true },
    centerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Center', required: true, index: true },
    lecturerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', default: null },
    instituteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true, index: true }
  },
  { timestamps: true }
);

export default mongoose.model('Module', moduleSchema);
