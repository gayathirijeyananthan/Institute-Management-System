import mongoose from 'mongoose';

const centerSchema = new mongoose.Schema(
  {
    centerName: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    instituteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true, index: true }
  },
  { timestamps: true }
);

export default mongoose.model('Center', centerSchema);
