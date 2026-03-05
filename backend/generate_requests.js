import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Food from './models/Food.js';
import User from './models/User.js';
import Request from './models/Request.js';

dotenv.config();

const uri = process.env.MONGODB_URI;

const generateRequests = async () => {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    // Get all available foods
    const foods = await Food.find({ status: 'available' });
    console.log(`Found ${foods.length} available foods`);

    // Get all recipient users
    const recipients = await User.find({ role: 'recipient' });
    console.log(`Found ${recipients.length} recipients`);

    if (foods.length === 0 || recipients.length === 0) {
      console.log('Not enough foods or recipients to generate requests.');
      process.exit(0);
    }

    let createdCount = 0;

    // Create a request for each food item
    for (const food of foods) {
      // Pick a random recipient
      const randomRecipient = recipients[Math.floor(Math.random() * recipients.length)];

      // Check if a request already exists to avoid duplicates
      const existingRequest = await Request.findOne({
        foodId: food._id,
        requesterEmail: randomRecipient.email
      });

      if (!existingRequest) {
        const newRequest = new Request({
          foodId: food._id,
          foodName: food.foodName,
          foodImage: food.foodImage,
          donnerName: food.donnerName,
          donnerEmail: food.email,
          requesterEmail: randomRecipient.email,
          requesterName: randomRecipient.name,
          requesterImage: randomRecipient.photoUrl || 'https://via.placeholder.com/150',
          requestDate: new Date().toISOString(),
          requestNotes: 'I would like to request this food.',
          status: 'requested'
        });

        await newRequest.save();
        createdCount++;
        console.log(`Created request for ${food.foodName} by ${randomRecipient.name}`);
      }
    }

    console.log(`Successfully generated ${createdCount} new requests.`);
    process.exit(0);
  } catch (error) {
    console.error('Error generating requests:', error);
    process.exit(1);
  }
};

generateRequests();
