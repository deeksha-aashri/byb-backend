const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  cart_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AddToCart',
    required: true,
  },
  book_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Books',
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  total_price: {
    type: Number,
    required: true,
    default: function () {
      return this.price * this.quantity;
    },
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// Update total price before saving the item
CartItemSchema.pre('save', function (next) {
  this.total_price = this.price * this.quantity;
  next();
});

module.exports = mongoose.model('CartItem', CartItemSchema, 'cartitems');
