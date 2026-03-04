import express from 'express';
import Food from '../models/Food.js';

const router = express.Router();

// GET featured foods (foods with highest quantity)
router.get('/', async (req, res) => {
  try {
    // Return top 6 foods with the highest quantity, currently available
    const foods = await Food.find({ status: 'available' })
                            .sort({ quantity: -1 })
                            .limit(6);
    res.json(foods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
