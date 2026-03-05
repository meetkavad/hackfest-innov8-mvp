import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipientEmail: { type: String, required: true },
  foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);
