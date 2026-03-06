import express from 'express';
import Food from '../models/Food.js';
import User from '../models/User.js';

const router = express.Router();

/**
 * GET /insights/recipient/:email
 * Calculates expected leftover food within a 10km radius for the next 7 days,
 * based on the historical availability of food donations from nearby donors.
 */
router.get('/recipient/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    // Find the recipient to get their coordinates
    const recipient = await User.findOne({ email, role: 'recipient' });
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }

    if (!recipient.location || !recipient.location.coordinates || recipient.location.coordinates.length !== 2) {
       return res.status(400).json({ message: 'Recipient location coordinates missing' });
    }

    const [lng, lat] = recipient.location.coordinates;
    const radiusInKm = 10;
    const radiusInRadians = radiusInKm / 6378.1;

    // We'll look at the last 30 days of food donations to build an active prediction
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Find all food donations generated within 10km in the last 30 days
    // Food schema stores [longitude, latitude] in the "coordinates" field natively
    const recentLocalDonations = await Food.find({
      createdAt: { $gte: thirtyDaysAgo },
      "coordinates": {
         $geoWithin: {
           $centerSphere: [[lng, lat], radiusInRadians]
         }
      }
    });

    // 1. Calculate Expected Food Volume (Naive Rolling Average)
    const totalVolumePast30Days = recentLocalDonations.reduce((acc, food) => acc + (food.quantity || 1), 0);
    const avgDailyVolume = totalVolumePast30Days / 30;
    const expectedWeeklyVolume = Math.round(avgDailyVolume * 7);

    // 2. Determine Peak Donation Days
    const dayCounts = {
      0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 // Sun - Sat
    };
    recentLocalDonations.forEach(food => {
      const dayOfWeek = new Date(food.createdAt).getDay();
      dayCounts[dayOfWeek] += 1;
    });

    const daysOfWeekNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let peakDayIndex = 0;
    let maxCount = -1;
    for (let i = 0; i < 7; i++) {
        if (dayCounts[i] > maxCount) {
            maxCount = dayCounts[i];
            peakDayIndex = i;
        }
    }
    const peakDayName = maxCount > 0 ? daysOfWeekNames[peakDayIndex] : "Weekends";


    // 3. Simple Top Contributors List (Donors who posted recently)
    // Map donorEmail to count of donations
    const donorFrequency = {};
    recentLocalDonations.forEach(food => {
      const e = food.email;
      if (e) {
         donorFrequency[e] = (donorFrequency[e] || 0) + 1;
      }
    });

    const sortedDonors = Object.entries(donorFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(entry => entry[0]);

    // Fetch the donor names
    const topDonors = await User.find({ email: { $in: sortedDonors } }, 'name orgName businessName');
    
    const topDonorNames = topDonors.map(d => d.orgName || d.businessName || d.name || 'Local Donor');

    res.json({
      expectedWeeklyVolume,
      peakDayName,
      topDonorNames,
      radiusInKm,
      totalPastMonth: totalVolumePast30Days
    });

  } catch (error) {
    console.error("Error generating recipient insights:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
