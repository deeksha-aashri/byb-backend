const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the Review Schema
const reviewSchema = new Schema({
  bookId: {
    type: Schema.Types.ObjectId,
    ref: 'Book', // Reference to the Book model
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'Users', // Reference to the User model (ensure you have a User model)
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1, // Minimum rating value
    max: 5, // Maximum rating value
  },
  comment: {
    type: String,
    required: true,
    maxlength: 1000, // Maximum character limit for the review
  },
  approved: {
    type: Boolean,
    default: false, // Set to false by default; requires admin approval
  },
}, { timestamps: true }); // Add timestamps for createdAt and updatedAt

// Create the Review model
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
