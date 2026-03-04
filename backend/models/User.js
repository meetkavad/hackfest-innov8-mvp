import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  photoUrl: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    enum: ['donor', 'recipient', 'admin'],
    required: true,
    default: 'donor'
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
