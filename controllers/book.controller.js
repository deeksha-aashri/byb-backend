const Book = require('../data/book.model'); // Adjust the path as necessary
const { uploadImage } = require('../utils/cloudinaryUploader'); // Using CommonJS require

// Add a new book
module.exports.addBook = async (req, res) => {
  try {
    const {
      title,
      price,
      genre,
      author,
      yearOfPublication,
      publisher,
      language,
      category,
      stock,
      description,
      sku,
      onSale,        // Added onSale
      bestSeller,    // Added bestSeller
    } = req.body;

    // Validate required fields
    if (!title || !price || !sku) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Upload cover image to Cloudinary (if provided)
    let coverImageUrl = null;
    if (req.file) { // req.file contains the image uploaded by Multer
      coverImageUrl = await uploadImage(req.file.buffer); // Passing image buffer to Cloudinary
    }

    // Create a new book instance
    const newBook = new Book({
      title,
      price,
      genre,
      author,
      yearOfPublication,
      publisher,
      language,
      category,
      stock,
      description,
      coverImages: coverImageUrl ? [coverImageUrl] : [], // Use the Cloudinary image URL here, or leave it empty
      sku,
      onSale: onSale || false,        // Default to false if not provided
      bestSeller: bestSeller || false // Default to false if not provided
    });

    // Save the new book to the database
    const savedBook = await newBook.save();

    // Send a success response
    res.status(201).json({
      message: 'Book added successfully',
      data: savedBook,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error adding book',
      error: error.message,
    });
  }
};


// Update an existing book
module.exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params; // Get the MongoDB ID from the URL parameters
    const updateData = { ...req.body }; // Get the data to update from the request body

    // Convert stock to a number if it's not null or an empty string
    if (updateData.stock && updateData.stock !== 'null' && updateData.stock !== '') {
      updateData.stock = Number(updateData.stock);
    } else {
      updateData.stock = null; // Set stock to null if the value is not valid
    }

    // Handle cover image update if provided
    if (req.file) { // Check if a file was uploaded
      const coverImageUrl = await uploadImage(req.file.buffer);
      updateData.coverImages = [coverImageUrl]; // Store the new image URL
    } else {
      // If no new file is uploaded, keep existing cover images unchanged
      const existingBook = await Book.findById(id);
      if (existingBook) {
        updateData.coverImages = existingBook.coverImages; // Retain existing cover images
      }
    }

    // Find the book by MongoDB ID and update it
    const updatedBook = await Book.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Send a success response
    res.status(200).json({
      message: 'Book updated successfully',
      data: updatedBook,
    });
  } catch (error) {
    console.error("Error updating book:", error); // Log the error
    res.status(500).json({
      message: 'Error updating book',
      error: error.message,
    });
  }
};

// Retrieve all books with optional filters
module.exports.getAllBooks = async (req, res) => {
  try {
    const {
      title,
      priceMin,
      priceMax,
      genre,
      author,
      yearOfPublication,
      publisher,
      language,
      category,
      stockMin,
      stockMax,
      description,
      coverImage,
    } = req.body;

    // Build query object
    const query = {};

    if (title) query.title = { $regex: title, $options: 'i' };
    if (priceMin || priceMax) {
      query.price = {};
      if (priceMin) query.price.$gte = priceMin;
      if (priceMax) query.price.$lte = priceMax;
    }
    if (genre) query.genre = { $in: genre };
    if (author) query.author = { $regex: author, $options: 'i' };
    if (yearOfPublication) query.yearOfPublication = yearOfPublication;
    if (publisher) query.publisher = { $regex: publisher, $options: 'i' };
    if (language) query.language = { $regex: language, $options: 'i' };
    if (category) query.category = { $regex: category, $options: 'i' };
    if (stockMin || stockMax) {
      query.stock = {};
      if (stockMin) query.stock.$gte = stockMin;
      if (stockMax) query.stock.$lte = stockMax;
    }
    if (description) query.description = { $regex: description, $options: 'i' };
    if (coverImage) query.coverImages = { $regex: coverImage, $options: 'i' };

    // Fetch books with filters applied
    const books = await Book.find(query);

    // Send a success response with the filtered books
    res.status(200).json({
      message: 'Books retrieved successfully',
      data: books,
      count: books.length,
    });
  } catch (error) {
    console.error("Error retrieving books:", error); // Log the error
    res.status(500).json({
      message: 'Error retrieving books',
      error: error.message,
    });
  }
};

// Get a book by its ID
module.exports.getBookById = async (req, res) => {
  try {
    const bookId = req.params.id; // Get the ID from the URL params

    // Find the book by ID and populate the 'reviews' field with all review info
    const book = await Book.findById(bookId)
      .populate({
        path: 'reviews', // Populate the reviews field
        populate: {
          path: 'userId', // Optionally populate user details inside each review
          // No 'select' field here to populate all user fields
        }
      });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json(book); // Send the book data with populated reviews back
  } catch (error) {
    console.error('Error retrieving book:', error);
    res.status(500).json({ message: 'Error retrieving book', error: error.message });
  }
};


// Delete a book by its ID
module.exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params; // Get the MongoDB _id from the URL parameters

    // Find the book by ID and delete it
    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Send a success response
    res.status(200).json({
      message: 'Book deleted successfully',
      data: deletedBook, // Optional: Return the deleted book's data
    });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({
      message: 'Error deleting book',
      error: error.message,
    });
  }
};

// Get books by category (with sanitized category)
const sanitizeCategory = (category) => {
  return category.toLowerCase().replace(/[^a-z0-9]/gi, ''); // Sanitize the category
};

module.exports.getAllBooksByCategory = async (req, res) => {
  try {
    const categoryParam = sanitizeCategory(req.params.category);

    const books = await Book.find({
      $or: [
        { category: { $regex: categoryParam, $options: 'i' } },
        { genre: { $in: [categoryParam] } },
      ],
    });

    if (books.length > 0) {
      res.json({
        message: 'Books retrieved successfully',
        data: books,
      });
    } else {
      res.json({
        message: 'No books found in this category',
        data: [],
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};

// Get books on sale
module.exports.getBooksOnSale = async (req, res) => {
  try {
    const booksOnSale = await Book.find({ onSale: true });

    if (booksOnSale.length > 0) {
      res.json({
        message: 'Books on sale retrieved successfully',
        data: booksOnSale,
      });
    } else {
      res.json({
        message: 'No books on sale',
        data: [],
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};

// Get best sellers
module.exports.getBestSellers = async (req, res) => {
  try {
    const bestSellers = await Book.find({ bestSeller : true  });
console.log("000", bestSellers)
    if (bestSellers.length > 0) {
      res.json({
        message: 'Best Selling books retrieved successfully',
        data: bestSellers,
      });
    } else {
      res.json({
        message: 'No best sellers found',
        data: [],
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};
