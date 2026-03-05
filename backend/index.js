import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dns from 'dns';

// Workaround for Nodemailer ENETUNREACH on systems with partial IPv6 support
dns.setDefaultResultOrder('ipv4first');
import foodRoutes from './routes/foods.js';
import requestRoutes from './routes/requests.js';
import myPostedFoodRoutes from './routes/mypostedfoods.js';
import featuredFoodRoutes from './routes/featuredFoods.js';
import blogRoutes from './routes/blogs.js';
import reviewRoutes from './routes/reviews.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import adminRoutes from './routes/admin.js';
import notificationRoutes from './routes/notifications.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const uri = process.env.MONGODB_URI;

mongoose.connect(uri)
  .then(() => console.log('Successfully connected to MongoDB!'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Routes
app.use('/foods', foodRoutes);
app.use('/myrequest', requestRoutes);
app.use('/mypostedfoods', myPostedFoodRoutes);
app.use('/featuredFoods', featuredFoodRoutes);
app.use('/blogs', blogRoutes);
app.use('/reviews', reviewRoutes);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/admin', adminRoutes);
app.use('/notifications', notificationRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.send('ShareBite Backend Server is running...');
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
