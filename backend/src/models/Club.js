import mongoose from 'mongoose';

const clubSchema = new mongoose.Schema(
  {
    clubName: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    centerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Center', required: true, index: true },
    coordinatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', default: null },
    instituteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true, index: true }
  },
  { timestamps: true }
);

export default mongoose.model('Club', clubSchema);
