var mongoose = require("mongoose");
var autoIncrement = require("mongoose-auto-increment");

var userSchema = new mongoose.Schema({
  adminID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admins",
    required: false,
    default: null,
  },
  cartID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "addtocart",
    required: false,
    default: null,
  },
  sales_person: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admins",
    required: false,
    default: null,
  },
 
  name: {
    type: String,
    required: false,
    default: null,
  },
  email: {
    type: String,
    default: null,
  },
  password: {
    type: String,
  },
  
  billing_address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserAddress",
    default: null,
  },
  emailMarketing: {
    type: Boolean,
    default: false,
  },
  smsMarketing: {
    type: Boolean,
    default: false,
  },
  user_type: {
    type: String,
    
    default: "general",
  },
 
  contactNumber: {
    type: String,
    required: false,
    default: null,
  },
  otp: {
    type: Number,
    required: false,
  },
  gst_no: {
    type: String,
    default: null,
  },
 
  NoOfOrder: {
    type: Number,
    default: 0,
  },
 
  total_transactions_amount: {
    type: Number,
    default: 0,
  },
  LastOrderDate: {
    type: Date,
    required: false,
    default: null,
  },
 
  status: {
    type: Boolean,
    default: true,
  },
  isLogedIn: {
    type: Boolean,
    default: false,
  },
  ip: {
    type: String,
    default: null,
  },
  token: {
    type: String,
    default: null,
  },
  tokens:[{type: String}],
  subscribeToggle: {
    type: Boolean,
    default: false,
  },
 
  uniqueID: {
    type: String,
    default: null,
  },
  forgetPasswordExp: {
    type: Date,
  },
  AccountDelete: {
    type: Boolean,
    default: false,
  },
  customerId:{
    type:String
 },
  created_at: {
    type: Date,
    required: true,
    default: Date.now(),
    timezone: "Asia/Kolkata",
  },
}, { timestamps: true });






const Users = mongoose.model('Users', userSchema);

module.exports = Users;