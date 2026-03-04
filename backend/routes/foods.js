import express from 'express';
import Food from '../models/Food.js';
import Request from '../models/Request.js';

const router = express.Router();

// GET all foods (or available foods)
router.get('/', async (req, res) => {
  try {
    const query = {};
    if (req.query.status) {
      query.status = req.query.status;
    }
    const foods = await Food.find(query).sort({ createdAt: -1 });
    res.json(foods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single food by ID
router.get('/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: 'Food not found' });
    res.json(food);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST a new food
router.post('/', async (req, res) => {
  try {
    const newFood = new Food(req.body);
    const savedFood = await newFood.save();
    res.json({ insertedId: savedFood._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT (update) a food item
router.put('/:id', async (req, res) => {
  try {
    const updatedFood = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedFood);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH (update status) a food item
router.patch('/:id', async (req, res) => {
  try {
    const updatedFood = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedFood);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE a food item
router.delete('/:id', async (req, res) => {
  try {
    const deletedFood = await Food.findByIdAndDelete(req.params.id);
    
    // Cascading Delete: if the food item was deleted, also delete any of its pending/approved requests
    if (deletedFood) {
      await Request.deleteMany({ foodId: req.params.id });
    }

    res.json({ deletedCount: deletedFood ? 1 : 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
