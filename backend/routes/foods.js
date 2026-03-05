import express from 'express';
import Food from '../models/Food.js';
import Request from '../models/Request.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

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

    // Notification Logic
    if (savedFood.notifyRecipients && savedFood.coordinates && savedFood.coordinates.length === 2) {
      const radiusInKm = savedFood.notifyRange || 5;
      const radiusInRadians = radiusInKm / 6378.1; // Earth's equatorial radius in km

      // Find nearby recipients
      const nearbyRecipients = await User.find({
        role: 'recipient',
        status: 'approved', // Only notify approved recipients
        location: {
          $geoWithin: {
            $centerSphere: [[savedFood.coordinates[0], savedFood.coordinates[1]], radiusInRadians]
          }
        }
      });

      // Create notifications
      const notifications = nearbyRecipients.map(recipient => ({
        recipientEmail: recipient.email,
        foodId: savedFood._id,
        message: `New food available within ${radiusInKm}km: ${savedFood.foodName} at ${savedFood.location}`
      }));

      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
      }
    }

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
