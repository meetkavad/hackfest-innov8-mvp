import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  userImage: { type: String },
  rating: { type: Number, required: true },
  comment: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Review', ReviewSchema);
