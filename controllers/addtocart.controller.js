// Add to Cart Function
const AddToCart = require('../data/addtocarts.model')
const User = require('../data/users.model');
const Book = require('../data/book.model');

// Add to Cart Function
module.exports.addToCart = async (req, res) => {
  try {
    const { user_id, book_id, quantity, price } = req.body;

    // Check if the book exists
    const book = await Book.findById(book_id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // If a user ID is provided, check if the user exists
    if (user_id && user_id!=null) {
      const user = await User.findById(user_id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
    }

    // Check if the cart already exists for the user
    let cart = await AddToCart.findOne({ user_id: user_id || null });

    if (!cart) {
      // If no cart exists, create a new one
      cart = new AddToCart({
        user_id: user_id || null,
        items: [{ book_id, quantity, price }]
      });
    } else {
      // If the cart exists, check if the book is already in the cart
      const existingItem = cart.items.find(item => item.book_id.toString() === book_id);

      if (existingItem) {
        // If the book is already in the cart, update the quantity
        existingItem.quantity += quantity;  // Update the quantity as needed
      } else {
        // Otherwise, add the new item to the cart
        cart.items.push({ book_id, quantity, price });
      }
    }

    await cart.save();  // Save the cart with the updated items

    return res.status(200).json({ message: 'Added to cart successfully', cart });
  } catch (error) {
    return res.status(500).json({ message: 'Error adding to cart', error });
  }
};





// Get Cart Function
module.exports.getCart = async (req, res) => {
  try {
    const { user_id } = req.query; // Retrieve user_id from query params for guests or logged-in users

    // Fetch the cart for the user or guest (null user_id for guests)
    const cart = await AddToCart.findOne({ user_id: user_id || null }).populate({
      path: 'items.book_id', // Populate book details from the Book model
      select: 'title price genre author' // Specify the fields you want to populate from the Book table
    });

    if (!cart) {
      return res.status(404).json({ message: 'No cart found' });
    }

    // Return the cart details with populated book info
    return res.status(200).json({ cart });
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving cart', error });
  }
};


// Remove from Cart Function
module.exports.removeFromCart = async (req, res) => {
  try {
    const { user_id } = req.body; // Assuming user_id is passed in the body if logged in
    const { bookId } = req.params; // bookId is passed as a URL parameter

    // Check if the book exists in the database
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if the cart exists for the user (or guest if no user_id)
    let cart = await AddToCart.findOne({ user_id: user_id || null });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Check if the book is present in the cart
    const itemIndex = cart.items.findIndex(item => item.book_id.toString() === bookId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Book not found in cart' });
    }

    // Remove the item from the cart
    cart.items.splice(itemIndex, 1);

    // If the cart is now empty, you can choose to delete the cart or keep it
    if (cart.items.length === 0) {
      await cart.remove();
      return res.status(200).json({ message: 'Cart is now empty, all items removed' });
    } else {
      await cart.save();
      return res.status(200).json({ message: 'Book removed from cart', cart });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error removing from cart', error });
  }
};




// Save Address API
module.exports.saveAddressToCart = async (req, res) => {
  const { userId, address, type } = req.body; // Extract userId, address details, and type (shipping/billing)

  try {
    // Find the user's cart
    const cart = await AddToCart.findOne({ user_id: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found.' });
    }

    // Update the address based on the type (shipping or billing)
    if (type === 'shipping') {
      // Update the shipping address in the cart items
      cart.items.forEach(item => {
        item.shipping_address = address; // Assuming address is an ObjectId of UserAddress
      });
    } else if (type === 'billing') {
      // Update the billing address in the cart items
      cart.items.forEach(item => {
        item.billing_address = address; // Assuming address is an ObjectId of UserAddress
      });
    } else {
      return res.status(400).json({ message: 'Invalid address type.' });
    }

    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: 'Address saved successfully.' });
  } catch (err) {
    console.error('Error saving address:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};









