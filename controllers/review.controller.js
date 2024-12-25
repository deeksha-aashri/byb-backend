const Review = require('../data/reviews.model'); // Adjust the path as necessary
const Book = require('../data/book.model'); // Adjust the path as necessary
const mongoose = require('mongoose');
// Controller to add a review
module.exports.addReview = async (req, res) => {
  try {
    const { bookId, rating, comment } = req.body;

    // Validate request body
    if (!bookId || !rating || !comment) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if the book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found.' });
    }

    // Create the review
    const review = new Review({
      bookId,
      userId: req.user._id, // Ensure req.user is populated by auth middleware
      rating,
      comment,
      approved: false, // Set to false for admin approval
    });

    // Save the review to the database
    await review.save();

    return res.status(201).json({
      message: 'Review added successfully. It will be visible after admin approval.',
      review,
    });
  } catch (error) {
    console.error('Error adding review:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// Controller to approve a review

module.exports.approveReview = async (req, res) => {
  const reviewId = req.params.id;

  try {
    if (!reviewId) {
      return res.status(400).json({ message: 'Review ID is required.' });
    }

    // Find and approve the review
    const review = await Review.findByIdAndUpdate(reviewId, { approved: true }, { new: true });
    if (!review) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    // Update the corresponding Book model with full review details
    const book = await Book.findById(review.bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found.' });
    }

    // Push the entire review details into the reviews array of the Book model
    book.reviews.push({
      _id: review._id,
      userId: review.userId,
      rating: review.rating,
      comment: review.comment,
      approved: review.approved,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    });

    await book.save(); // Save the updated book document

    return res.status(200).json({ message: 'Review approved and added to the book.', review });
  } catch (error) {
    console.error('Error approving review:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};



// Controller to get all reviews
module.exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('userId', 'name email') // Populate specific fields (adjust as necessary)
      .populate('bookId', 'title author') // Populate specific fields (adjust as necessary)
      .lean();

    return res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};


module.exports.unApproveReview = async (req, res) => {
  const reviewId = req.params.id;

  try {
    if (!reviewId) {
      return res.status(400).json({ message: 'Review ID is required.' });
    }

    if (!mongoose.isValidObjectId(reviewId)) {
      return res.status(400).json({ message: 'Invalid Review ID format.' });
    }

    // Find and unapprove the review
    const review = await Review.findByIdAndUpdate(reviewId, { approved: false }, { new: true });
    if (!review) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    // Find the corresponding Book by review's bookId
    const book = await Book.findById(review.bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found.' });
    }

    // Remove the unapproved review from the book's reviews array
    const updatedReviews = book.reviews.filter((r) => r._id.toString() !== review._id.toString());
    book.reviews = updatedReviews;

    await book.save(); // Save the updated book document

    return res.status(200).json({ message: 'Review unapproved and removed from the book.', review });
  } catch (error) {
    console.error('Error unapproving review:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};


