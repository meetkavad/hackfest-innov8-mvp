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

    // Grouping foods by status
    const foodsByStatus = await Food.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    // Grouping requests by status
    const requestsByStatus = await Request.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    // Aggregate to find total people fed and people fed by month based on food quantity
    const peopleFedAggregation = await Request.aggregate([
      { $match: { status: 'delivered' } },
      {
        $lookup: {
          from: 'foods',
          localField: 'foodId',
          foreignField: '_id',
          as: 'foodDetails'
        }
      },
      { $unwind: '$foodDetails' },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          peopleFed: { $sum: '$foodDetails.quantity' }
        }
      },
      { $sort: { _id: 1 } } // Sort by month ascending
    ]);

    // Compute grand total and format daily/month array
    let totalPeopleFed = 0;
    const peopleFedByMonth = peopleFedAggregation.map(item => {
        totalPeopleFed += item.peopleFed;
        return {
           month: item._id, // e.g., "2026-01"
           peopleFed: item.peopleFed
        };
    });

    res.json({
      totalDonations,
      totalMealsSaved,
      totalDonors,
      totalRecipients,
      foodsByStatus,
      requestsByStatus,
      totalPeopleFed,
      peopleFedByMonth
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all poor performing donors
router.get('/poor-performers', async (req, res) => {
  try {
    const poorDonors = await User.find({
      role: 'donor',
      'trustScore.totalReviews': { $gte: 5 },
      'trustScore.overall': { $lt: 1.5 }
    }).sort({ 'trustScore.overall': 1 }); // Lowest scores first
    res.json(poorDonors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET Top Performing Donors (by number of foods donated)
router.get('/top-performers', async (req, res) => {
  try {
    const topPerformers = await Food.aggregate([
      // Group by donor email and count foods
      { $group: { _id: "$email", totalFoodsDonated: { $sum: 1 } } },
      // Sort in descending order
      { $sort: { totalFoodsDonated: -1 } },
      // Lookup to get donor details from users collection
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: 'email',
          as: 'donorInfo'
        }
      },
      // Unwind the array
      { $unwind: "$donorInfo" },
      // Project only necessary fields
      {
        $project: {
          email: "$_id",
          totalFoodsDonated: 1,
          name: "$donorInfo.name",
          businessName: "$donorInfo.businessName",
          photoUrl: "$donorInfo.photoUrl",
          trustScore: "$donorInfo.trustScore",
          badges: "$donorInfo.badges"
        }
      }
    ]);

    res.json(topPerformers);
  } catch (error) {
    console.error("Error fetching top performers:", error);
    res.status(500).json({ error: error.message });
  }
});

// POST Award a badge to a specific user
router.post('/award-badge', async (req, res) => {
  try {
    const { email, badge } = req.body;
    if (!email || !badge) {
        return res.status(400).json({ message: "Email and badge are required."});
    }

    const user = await User.findOneAndUpdate(
       { email },
       { $addToSet: { badges: badge } }, // Prevents duplicates
       { new: true }
    );

    if (!user) {
        return res.status(404).json({ message: "User not found." });
    }

    res.json({ message: "Badge awarded successfully.", user });
  } catch(error) {
      console.error("Error awarding badge:", error);
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
