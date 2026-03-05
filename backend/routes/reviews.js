import express from 'express';
import Review from '../models/Review.js';
import FoodReview from '../models/FoodReview.js';
import User from '../models/User.js';

const router = express.Router();

// GET all reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST a new food review and update donor trust score
router.post('/food-reviews', async (req, res) => {
  try {
    const newReview = new FoodReview(req.body);
    await newReview.save();

    // Update Donor's trust score
    const donor = await User.findOne({ email: newReview.donorEmail });
    if (donor) {
      if (!donor.trustScore) {
        donor.trustScore = { totalReviews: 0, freshness: 0, packaging: 0, amount: 0, overall: 0 };
      }
      const ts = donor.trustScore;
      const total = ts.totalReviews;
      const ratings = newReview.ratings;

      // Calculate new averages
      ts.freshness = (ts.freshness * total + ratings.freshness) / (total + 1);
      ts.packaging = (ts.packaging * total + ratings.packaging) / (total + 1);
      ts.amount = (ts.amount * total + ratings.amount) / (total + 1);
      ts.overall = (ts.overall * total + ratings.overall) / (total + 1);
      ts.totalReviews = total + 1;

      // Make sure mongoose sees it as modified
      donor.markModified('trustScore');
      await donor.save();
    }

    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
