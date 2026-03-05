import mongoose from 'mongoose';

const FoodSchema = new mongoose.Schema({
  foodName: { type: String, required: true },
  foodImage: { type: String, required: true },
  quantity: { type: Number, required: true },
  location: { type: String, required: true },
  coordinates: { type: [Number], required: false }, // [longitude, latitude]
  notifyRecipients: { type: Boolean, default: false },
  notifyRange: { type: Number, default: 5 }, // in km
  expiredDate: { type: String, required: true },
  notes: { type: String },
  donnerName: { type: String },
  donnerimage: { type: String },
  email: { type: String, required: true },
  status: { type: String, default: 'available' }
}, { timestamps: true });

export default mongoose.model('Food', FoodSchema);
