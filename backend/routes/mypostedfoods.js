import express from 'express';
import Food from '../models/Food.js';

const router = express.Router();

// GET posted foods by doner email
router.get('/', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: 'Email query parameter is required' });
    }
    const foods = await Food.find({ email: email }).sort({ createdAt: -1 });
    res.json(foods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
