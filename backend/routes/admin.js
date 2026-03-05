import express from 'express';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Request from '../models/Request.js';
import Food from '../models/Food.js';

const router = express.Router();

// GET admin statistics
router.get('/stats', async (req, res) => {
  try {
    const totalDonations = await Food.countDocuments({});
    
    // Meals saved are requests that are strictly delivered
    const totalMealsSaved = await Request.countDocuments({ status: 'delivered' });
    
    const totalDonors = await User.countDocuments({ role: 'donor' });
    const totalRecipients = await User.countDocuments({ role: 'recipient' });

    res.json({
      totalDonations,
      totalMealsSaved,
      totalDonors,
      totalRecipients
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all requests for admin
router.get('/requests', async (req, res) => {
  try {
    const requests = await Request.find({}).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// PATCH verify user (Approve/Reject)
router.patch('/users/:id/verify', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected', 'pending'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status.' });
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.params.id, 
        { status }, 
        { new: true }
    );

    if (!updatedUser) {
        return res.status(404).json({ message: 'User not found.' });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE user
router.delete('/users/:id', async (req, res) => {
  try {
    const { reason } = req.body;
    const userToDelete = await User.findById(req.params.id);

    if (!userToDelete) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const userEmail = userToDelete.email;
    const userName = userToDelete.name || userToDelete.businessName || userToDelete.orgName || 'User';

    // Delete the user from the database
    await User.findByIdAndDelete(req.params.id);

    // Send email notification about deletion
    if (reason && userEmail) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: 'ShareBite - Account Deleted by Admin',
        text: `Hello ${userName},\n\nYour account on ShareBite has been deleted by an administrator.\n\nReason for deletion:\n"${reason}"\n\nIf you have any questions, please contact our support team.\n\nBest,\nThe ShareBite Team`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('Deletion email failed:', error.message);
          return res.status(500).json({ message: 'User deleted, but email failed to send: ' + error.message });
        } else {
          console.log(`Deletion email sent to ${userEmail}: ` + info.response);
          return res.json({ message: 'User deleted successfully.' });
        }
      });
    } else {
      res.json({ message: 'User deleted successfully.' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST Add Admin
router.post('/add-admin', async (req, res) => {
  try {
    const { name, email, password, photoUrl } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new User({
      name,
      email,
      password: hashedPassword,
      photoUrl,
      role: 'admin',
      status: 'approved'
    });

    await newAdmin.save();

    res.status(201).json({ message: 'Admin created successfully.', user: { id: newAdmin._id, name: newAdmin.name, email: newAdmin.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
