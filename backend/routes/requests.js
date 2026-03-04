import express from 'express';
import Request from '../models/Request.js';
import Food from '../models/Food.js';

const router = express.Router();

// GET requests by requester email OR donner email
router.get('/', async (req, res) => {
  try {
    const { email, roleField } = req.query;
    if (!email) {
      return res.status(400).json({ message: 'Email query parameter is required' });
    }
    
    // allow querying by either requesting user or donating user
    let queryField = 'requesterEmail';
    if (roleField === 'donor') {
        queryField = 'donnerEmail';
    }

    const requests = await Request.find({ [queryField]: email }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST a new request
router.post('/', async (req, res) => {
  try {
    const newRequest = new Request(req.body);
    const savedRequest = await newRequest.save();

    res.json({ insertedId: savedRequest._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE a request (if frontend has cancel request option)
router.delete('/:id', async (req, res) => {
  try {
    const deletedRequest = await Request.findByIdAndDelete(req.params.id);
    res.json({ deletedCount: deletedRequest ? 1 : 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH (update status) a request
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
        return res.status(400).json({ message: 'Status property is required to patch.' });
    }
    const updatedRequest = await Request.findByIdAndUpdate(req.params.id, { status }, { new: true });
    
    // Optionally update the overarching Food status if requested -> accepted 
    if (updatedRequest && status === 'accepted') {
       await Food.findByIdAndUpdate(updatedRequest.foodId, { status: 'unavailable' });
    }
    
    res.json(updatedRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
