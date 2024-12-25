const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  items: [{
    book_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  }],
  totalAmount: {
    type: Number,
    required: true,
  },
  shipping_address: {
    houseNo: String,
    street: String,
    locality: String,
    city: String,
    pincode: String,
    state: String,
    country: String,
    telephone: String,
    email: String,
  },
  billing_address: {
    houseNo: String,
    street: String,
    locality: String,
    city: String,
    pincode: String,
    state: String,
    country: String,
    telephone: String,
    email: String,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  payment_status: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Paid',
  },
  order_status: {
    type: String,
    enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Processing',
  },
  order_date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Order', OrderSchema, 'orders');
