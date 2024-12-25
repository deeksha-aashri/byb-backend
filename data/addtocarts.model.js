const mongoose = require('mongoose');

const AddToCartSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Set to false to make user_id optional
  },
  items: [
    {
      book_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        default: 1
      },
      price: {
        type: Number,
        required: true
      },
      coverImages: [
        {
          type: String, 
          required: false
        }
      ],
      shipping_address: {
        houseNo: { type: String, required: false },
        street: { type: String, required: false },
        locality: { type: String, required: false },
        city: { type: String, required: false },
        pincode: { type: String, required: false },
        state: { type: String, required: false },
        country: { type: String, required: false },
        telephone: { type: String, required: false },
        email: { type: String, required: false }
      },
      billing_address: {
        houseNo: { type: String, required: false },
        street: { type: String, required: false },
        locality: { type: String, required: false },
        city: { type: String, required: false },
        pincode: { type: String, required: false },
        state: { type: String, required: false },
        country: { type: String, required: false },
        telephone: { type: String, required: false },
        email: { type: String, required: false }
      },
      coupon: {
        code: { type: String, required: false },
        discountAmount: { type: Number, required: false, default: 0 }
      }
    }
  ]
});

module.exports = mongoose.model('addtocart', AddToCartSchema);
