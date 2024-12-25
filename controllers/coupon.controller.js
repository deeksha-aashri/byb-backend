const express = require('express');

const Coupon = require('../data/coupons.model'); 

module.exports.Addcoupon = async (req, res) => {
  try {
    const { name, code, discount } = req.body;
    const coupon = new Coupon({ name, code, discount });
    await coupon.save();
    res.status(201).json({ message: 'Coupon added successfully', coupon });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


module.exports.DeleteCoupon= async (req, res) => {
    try {
      const { code } = req.params;
      const deletedCoupon = await Coupon.findOneAndDelete({ code });
      if (!deletedCoupon) return res.status(404).json({ error: 'Coupon not found' });
      res.json({ message: 'Coupon deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  

module.exports.ApplyDiscount =async (req, res) => {
  try {
    const { cartId, couponCode } = req.body;
    
    // Check if coupon exists and get discount
    const coupon = await Coupon.findOne({ code: couponCode });
    if (!coupon) {
      return res.status(404).json({ error: 'Invalid coupon code' });
    }

    // Apply discount to cart
    const cart = await AddToCart.findById(cartId);
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    // Update cart with coupon details
    cart.coupon = { code: couponCode, discount: coupon.discount };
    await cart.save();

    res.json({ message: 'Discount applied successfully', cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports.GetAllCoupons= async (req, res) => {
    try {
      const coupons = await Coupon.find(); // Retrieve all coupons from the database
      res.json({ coupons });
    } catch (error) {
      console.error('Error fetching coupons:', error);
      res.status(500).json({ error: 'An error occurred while fetching coupons' });
    }}
