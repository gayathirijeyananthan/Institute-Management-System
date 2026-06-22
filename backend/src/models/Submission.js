import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    notes: { type: String, default: '', trim: true },
    fileUrl: { type: String, required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', default: null },
    activityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity', default: null },
    cohortId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cohort', required: true, index: true },
    centerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Center', required: true, index: true },
    instituteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true, index: true },
    status: { type: String, enum: ['Submitted', 'Reviewed'], default: 'Submitted' }
  },
  { timestamps: true }
);

export default mongoose.model('Submission', submissionSchema);
