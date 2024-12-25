const mongoose = require('mongoose');
const { Schema } = mongoose;
const ReviewSchema = require('./reviews.model')
// Define the Book Schema
const bookSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: true,
  },
  genre: [
    {
      type: String,
      required: false,
    }
  ],
  author: {
    type: String,
    required: false,
  },
  yearOfPublication: {
    type: Number,
    required: false,
  },
  publisher: {
    type: String,
    required: false,
  },
  language: {
    type: String,
    required: false,
  },
  category: {
    type: String,
    required: false,
  },
  sku: {
    type: String,
    required: true,
    unique: true, // Ensure each book has a unique SKU
  },
  stock: {
    type: Number,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  onSale: {
    type: Boolean,
  },
  bestSeller: {
    type: Boolean
  },
  coverImages: [
    {
      type: String, // URL or path to cover images
      required: false,
    }
  ],
  // Array of approved reviews
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review', // Reference to the Review model
      required: false, // Not required since a book can exist without reviews
    }
  ],
}, { timestamps: true }); // Add timestamps for createdAt and updatedAt

// Create the Book model
const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
