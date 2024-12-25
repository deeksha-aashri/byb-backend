const mongoose = require('mongoose');
const CouponSchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    discount: { type: Number, required: true } // Discount in percentage or amount
  });
  
  module.exports = mongoose.model('Coupon', CouponSchema);
  