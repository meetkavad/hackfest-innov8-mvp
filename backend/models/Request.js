import mongoose from 'mongoose';

const RequestSchema = new mongoose.Schema({
  foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
  foodName: { type: String, required: true },
  foodImage: { type: String, required: true },
  donnerName: { type: String },
  donnerEmail: { type: String },
  requesterEmail: { type: String, required: true },
  requesterName: { type: String },
  requesterImage: { type: String },
  requestDate: { type: String, required: true },
  requestNotes: { type: String },
  status: { type: String, default: 'requested' }
}, { timestamps: true });

export default mongoose.model('Request', RequestSchema);
