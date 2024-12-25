const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

// Remove the pre-save hook that hashes the password
const Admin = mongoose.model('Admin', AdminSchema);
module.exports = Admin;
