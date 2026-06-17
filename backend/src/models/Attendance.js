import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    cohortId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cohort', required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['Present', 'Absent', 'Late'], required: true },
    instituteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true, index: true }
  },
  { timestamps: true }
);

attendanceSchema.index({ instituteId: 1, studentId: 1, date: 1 }, { unique: true });

export default mongoose.model('Attendance', attendanceSchema);
