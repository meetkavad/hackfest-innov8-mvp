import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String },
  content: { type: String, required: true },
  date: { type: String }
}, { timestamps: true });

export default mongoose.model('Blog', BlogSchema);
