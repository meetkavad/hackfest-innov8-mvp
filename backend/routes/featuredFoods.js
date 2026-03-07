import express from 'express';
import Food from '../models/Food.js';

const router = express.Router();

// GET featured foods (foods with highest quantity)
router.get('/', async (req, res) => {
  try {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayString = `${yyyy}-${mm}-${dd}`;

    // Return top 6 foods with the highest quantity, currently available and not expired
    const foods = await Food.find({ 
      status: 'available',
      expiredDate: { $gte: todayString }
    })
    .sort({ quantity: -1 })
    .limit(6);
    res.json(foods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
