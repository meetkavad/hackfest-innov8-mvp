import mongoose from 'mongoose';

const FoodReviewSchema = new mongoose.Schema({
  donorEmail: { type: String, required: true },
  recipientEmail: { type: String, required: true },
  foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
  ratings: {
    freshness: { type: Number, required: true, min: 1, max: 5 },
    packaging: { type: Number, required: true, min: 1, max: 5 },
    amount: { type: Number, required: true, min: 1, max: 5 },
    overall: { type: Number, required: true, min: 1, max: 5 }
  },
  comment: { type: String }
}, { timestamps: true });

export default mongoose.model('FoodReview', FoodReviewSchema);
