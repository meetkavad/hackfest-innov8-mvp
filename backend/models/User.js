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
  },
  status: {
    type: String,
    enum: ['unverified', 'pending', 'approved', 'rejected'],
    default: 'unverified'
  },
  otp: {
    type: String
  },
  otpExpires: {
    type: Date
  },
  // --- Donor Specific Fields ---
  businessName: { type: String },
  ownerName: { type: String },
  businessRegNo: { type: String },
  phone: { type: String },
  address: { type: String },
  foodType: { type: String },
  operatingHours: { type: String },
  govRegCertUrl: { type: String },
  fssaiCertUrl: { type: String },
  gstCertUrl: { type: String },
  addressProofUrl: { type: String },
  idProofUrl: { type: String },
  trustScore: {
    totalReviews: { type: Number, default: 0 },
    freshness: { type: Number, default: 0 },
    packaging: { type: Number, default: 0 },
    amount: { type: Number, default: 0 },
    overall: { type: Number, default: 0 },
  },
  
  // --- Recipient Specific Fields ---
  orgName: { type: String },
  contactPerson: { type: String },
  pickupAddress: { type: String },
  recipientType: { type: String },
  estimatedPeople: { type: String },
  ngoRegCertUrl: { type: String },
  authLetterUrl: { type: String },
  
  // --- Common Geolocation Field ---
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: false } // [longitude, latitude]
  },
  
  // --- Badges & Awards ---
  badges: [{ type: String }]
}, { timestamps: true });

userSchema.index({ location: "2dsphere" });

export default mongoose.model('User', userSchema);
