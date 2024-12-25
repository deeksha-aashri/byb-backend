const Admin = require('../data/admins.model'); // Path to your Admin model

const jwt = require('jsonwebtoken');


//Admin Register
module.exports.register = async (req, res) => {
  const { email, password } = req.body;
  console.log("Registration request:", req.body);

  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Store the password as plain text
    const newAdmin = new Admin({ email, password });

    // Save the new admin to the database
    await newAdmin.save();

    // Check if JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    // Create JWT token
    const token = jwt.sign({ adminId: newAdmin._id }, process.env.JWT_SECRET, {
      expiresIn: '1h', // Token expires in 1 hour
    });

    res.status(201).json({ token, message: 'Admin created successfully' });
  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};





// Admin Login
module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log('Login request:', req.body);

  try {
    // Check if admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Log the stored password in the database (plain text)
    console.log("Stored Password:", admin.password);

    // Compare the provided password with the one stored in the database
    if (password !== admin.password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    // Create JWT token
    const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, {
      expiresIn: '1h' // Token expires in 1 hour
    });

    // Return the token to the client
    return res.json({ token, message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};





