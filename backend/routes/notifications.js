import express from 'express';
import Notification from '../models/Notification.js';

const router = express.Router();

// GET all notifications for a specific user email
router.get('/:email', async (req, res) => {
  try {
    const notifications = await Notification.find({ recipientEmail: req.params.email })
      .sort({ createdAt: -1 })
      .populate('foodId');
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET unread notifications count
router.get('/:email/unread-count', async (req, res) => {
  try {
    const count = await Notification.countDocuments({ 
      recipientEmail: req.params.email, 
      isRead: false 
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH (mark as read) a notification
router.patch('/:id/read', async (req, res) => {
  try {
    const updatedNotification = await Notification.findByIdAndUpdate(
      req.params.id, 
      { isRead: true }, 
      { new: true }
    );
    res.json(updatedNotification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
