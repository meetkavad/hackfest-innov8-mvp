import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const user = await User.findOne({ email: 'bad_donor@example.com' });
    console.log("Found User:", JSON.stringify(user, null, 2));
    
    const queryTest = await User.find({
      role: 'donor',
      'trustScore.totalReviews': { $gte: 5 },
      'trustScore.overall': { $lt: 1.5 }
    });
    console.log("Query Test Length:", queryTest.length);
  })
  .finally(() => mongoose.connection.close());
