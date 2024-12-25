const jwt = require("jsonwebtoken");
require("dotenv").config();

const mongoose = require("mongoose");
const User = require('../data/users.model');  


const verifyToken = (token, secretKey) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        reject("Token is not valid");
      } else {
        resolve(decoded);
      }
    });
  });
};

const getTokenFromHeaders = (headers) => {
  let token = headers["x-access-token"] || headers["authorization"];
  if (token && token.includes("Bearer ")) {
    token = token.split("Bearer ")[1];
  }
  return token;
};

module.exports.authenticate = async (req, res, next) => {
  const token = getTokenFromHeaders(req.headers);
  if (!token) {
    return res.status(503).json({
      success: false,
      message: "Auth token is absent",
    });
  }

  try {
    req.decoded = await verifyToken(token, "hyhelrtmfhosidfyfohra");
   

    next();
  } catch (error) {
    return res.status(503).json({
      success: false,
      message: error,
    });
  }
};

module.exports.authenticateAdmin = async (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Auth token is absent' });
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret_key');
    req.admin = await Admin.findById(decoded.adminId);

    if (!req.admin) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};


module.exports.authenticateUser = async (req, res, next) => {
  const token = getTokenFromHeaders(req.headers);
  if (!token) {
    return res.status(503).json({
      success: false,
      message: "Auth token is absent",
    });
  }

  try {
    req.decoded = await verifyToken(token, "hyhelrtmfhosidfyfohr");
    next();
  } catch (error) {
    return res.status(503).json({
      success: false,
      message: error,
    });
  }
};








module.exports.verifyTokenn = async (req, res, next) => {
  console.log("Req in middleware ", req.headers);
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).send('Token is required');
  }

  try {
    const decoded = jwt.verify(token, "hyhelrtmfhosidfyfohr"); // Ensure you're using the same secret
    console.log("Decoded Token:", decoded); // Log the decoded token for debugging

    // Ensure this matches the property used in the token's payload
    const user = await User.findById(decoded.ID);
    if (!user) {
      return res.status(401).send('Invalid Token'); // Handle case where user is not found
    }
    
    req.user = user; // Attach user info to req
    next();
  } catch (error) {
    console.error("Token verification error:", error); // Log any verification errors
    return res.status(401).send('Invalid Token');
  }
};



