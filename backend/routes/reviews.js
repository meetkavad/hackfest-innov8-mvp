import express from 'express';
import Sentiment from 'sentiment';
import Review from '../models/Review.js';
import FoodReview from '../models/FoodReview.js';
import User from '../models/User.js';

const router = express.Router();
const sentiment = new Sentiment();

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

// GET review sentiment and keywords for a donor
router.get('/food-reviews/donor/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const reviews = await FoodReview.find({ donorEmail: email });
    
    if (!reviews || reviews.length === 0) {
      return res.json({
        totalReviews: 0,
        averageScore: 0,
        sentimentLabel: "Neutral",
        topKeywords: []
      });
    }

    let totalScore = 0;
    let commentsAnalyzed = 0;
    const wordCounts = {};

    reviews.forEach(review => {
      if (review.comment && review.comment.trim() !== '') {
        const result = sentiment.analyze(review.comment);
        totalScore += result.score;
        commentsAnalyzed++;
        
        // Count positive and negative words
        const allWords = [...result.positive, ...result.negative];
        allWords.forEach(word => {
            // keep words lowercase
          const lowercaseWord = word.toLowerCase();
          wordCounts[lowercaseWord] = (wordCounts[lowercaseWord] || 0) + 1;
        });
      }
    });

    const averageScore = commentsAnalyzed > 0 ? totalScore / commentsAnalyzed : 0;
    
    let sentimentLabel = "Neutral";
    if (averageScore > 1.5) sentimentLabel = "Highly Positive";
    else if (averageScore > 0) sentimentLabel = "Positive";
    else if (averageScore < -1.5) sentimentLabel = "Highly Negative";
    else if (averageScore < 0) sentimentLabel = "Negative";

    // Sort keywords by frequency
    const topKeywords = Object.entries(wordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5) // Top 5 keywords
      .map(([word]) => word);

    res.json({
      totalReviews: reviews.length,
      averageScore,
      sentimentLabel,
      topKeywords
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
