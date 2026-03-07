import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';

const AddBlog = () => {
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    content: '',
    date: new Date().toISOString().split('T')[0] // Default to today
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.title || !formData.content) {
         toast.error("Title and Content are required fields.");
         setIsLoading(false);
         return;
      }

      await axios.post('http://localhost:5000/blogs', formData);
      toast.success('Blog created successfully!');
      navigate('/admin/impacts'); // Redirect after successful creation
    } catch (error) {
      console.error('Error creating blog:', error);
      toast.error(error.message || 'Failed to create blog block');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4">
      <motion.div 
         initial={{ opacity: 0, y: -20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.5 }}
         className="mb-8 border-b pb-4 flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Create New Blog Post</h1>
          <p className="text-gray-500 mt-2">Publish new stories and updates to the community.</p>
        </div>
      </motion.div>

      <motion.div 
         initial={{ opacity: 0, scale: 0.95 }}
         animate={{ opacity: 1, scale: 1 }}
         transition={{ duration: 0.4, delay: 0.2 }}
         className="bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-8 border border-gray-100"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Blog Title *</label>
                <input 
                  type="text" 
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter an engaging title" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white/50"
                  required
                />
            </div>

            {/* Image URL */}
            <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image URL</label>
                <input 
                  type="url" 
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white/50"
                />
            </div>

            {/* Date */}
            <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Publish Date</label>
                <input 
                  type="date" 
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white/50"
                />
            </div>
          </div>

          {/* Content */}
          <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Blog Content *</label>
              <textarea 
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows="8" 
                placeholder="Write your blog post content here..." 
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white/50 resize-y"
                required
              ></textarea>
          </div>

          <div className="pt-4 flex justify-end gap-4">
              <button 
                type="button" 
                onClick={() => navigate('/admin/impacts')}
                className="px-6 py-2 rounded-xl text-gray-600 font-medium hover:bg-gray-100 transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isLoading}
                className="px-8 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg shadow-green-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center h-12"
              >
                {isLoading ? <span className="loading loading-spinner loading-sm"></span> : 'Publish Blog'}
              </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddBlog;
