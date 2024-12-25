const express = require('express');
const Stripe = require('stripe');
const router = express.Router();
const stripe = Stripe('sk_test_51M8f0QSIyZmUPyzEQd1wiOSZqxrEKiO1LFEd2qGyDLWCCEzsr7qGNa4K1WEZsDdFg1hKW6g0QMpKr6vtxrllWcvB00Q2UFZAsj');
const Order = require('../data/order.model');
// Create Order

 // Make sure you import the Order model

 module.exports.createOrder = async (req, res) => {
  const { items, shippingAddress, billingAddress, formData } = req.body;

  // Calculate total amount
  const totalAmount = items.reduce((total, item) => total + item.price * item.quantity, 0);

  try {
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount * 100, // amount in cents
      currency: 'usd',
      metadata: {
        shippingAddress: JSON.stringify(shippingAddress),
        billingAddress: JSON.stringify(billingAddress),
        customerName: formData.name,
        customerEmail: formData.email,
      },
    });

    // Once paymentIntent is created, create the order in the database
    const newOrder = new Order({
      user_id: formData.userId,  // Assuming the user's ID is passed in formData
      items: items.map(item => ({
        book_id: item.book_id,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount: totalAmount,
      shipping_address: shippingAddress,
      billing_address: billingAddress,
      name: formData.name,       // Adding name
      email: formData.email,     // Adding email
      phone: formData.phone,     // Adding phone
      payment_status: 'Paid', 
      order_status: 'Processing', 
    });

    // Save the new order to the database
    const savedOrder = await newOrder.save();

    // Send response back to client with clientSecret and order ID
    res.status(200).json({ clientSecret: paymentIntent.client_secret, orderId: savedOrder._id, amount: totalAmount });
    
  } catch (error) {
    console.error('Error creating order or payment intent:', error);
    res.status(500).send('Internal Server Error');
  }
};



// Create Payment Intent
module.exports.createIntent = async (req, res) => {
  const { amount } = req.body;
console.log("INETENRTTT ", req.body)
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'inr', // Ensure consistent currency
    });
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).send({ error: error.message });
  }
};


module.exports.getAllOrders= async (req, res) => {
  try {
    // Fetch all orders from the database
    const orders = await Order.find().populate('items.book_id'); // Populating the book details

    // Send the orders as a response
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports.getOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id).populate('items.book_id'); // Populate book details if needed

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports.deleteOrderById = async (req, res) => {
  try {
    const orderId = req.params.id; // Get the order ID from the request parameters
    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



// Update order status by ID
module.exports.updateOrderStatus = async (req, res) => {
  const orderId = req.params.id; // Get the order ID from the request parameters
  const { order_status } = req.body; // Get the new order status from the request body

  try {
    // Validate the order status
    if (!order_status) {
      return res.status(400).json({ message: 'Order status is required' });
    }

    // Update the order status
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { order_status },
      { new: true } // Return the updated document
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order status updated successfully', order: updatedOrder });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



