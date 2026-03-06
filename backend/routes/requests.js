import express from 'express';
import Request from '../models/Request.js';
import Food from '../models/Food.js';
import Notification from '../models/Notification.js';

const router = express.Router();

import User from '../models/User.js';

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

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

    let requests = await Request.find({ [queryField]: email }).sort({ createdAt: -1 }).lean();
    
    if (roleField === 'donor') {
        const donor = await User.findOne({ email });
        const donorCoords = donor?.location?.coordinates;
        
        const requesterEmails = [...new Set(requests.map(r => r.requesterEmail))];
        const requesters = await User.find({ email: { $in: requesterEmails } });
        const requesterMap = {};
        requesters.forEach(r => { requesterMap[r.email] = r; });
        
        for (let req of requests) {
            const recipient = requesterMap[req.requesterEmail];
            if (recipient) {
                req.requesterDetails = {
                    name: recipient.name || recipient.orgName || recipient.businessName,
                    email: recipient.email
                };
                
                const recCoords = recipient.location?.coordinates;
                if (donorCoords && recCoords && donorCoords.length === 2 && recCoords.length === 2) {
                    req.distanceKm = getDistanceFromLatLonInKm(donorCoords[1], donorCoords[0], recCoords[1], recCoords[0]);
                }
            }
        }
        
        // Sort by distance (closest first), if distance is missing, put them at the end
        requests.sort((a, b) => {
            const distA = a.distanceKm !== undefined ? a.distanceKm : Infinity;
            const distB = b.distanceKm !== undefined ? b.distanceKm : Infinity;
            return distA - distB;
        });
    }

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
       
       // Create a notification for the recipient
       const notification = new Notification({
           recipientEmail: updatedRequest.requesterEmail,
           foodId: updatedRequest.foodId,
           message: `Your request for ${updatedRequest.foodName} has been accepted by ${updatedRequest.donnerName || 'the donor'}.`
       });
       await notification.save();
    } else if (updatedRequest && (status === 'canceled' || status === 'rejected')) {
        // If the request is canceled or rejected, make the food available again
        await Food.findByIdAndUpdate(updatedRequest.foodId, { status: 'available' });
    }
    
    res.json(updatedRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
