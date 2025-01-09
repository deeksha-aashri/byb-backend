
const express = require('express');
const mongoose = require('mongoose');
 
const cors = require('cors');

var routes = require('./routes/index')
const app = express();

// Middleware
app.use(express.json());
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:4000'];
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin, like mobile apps or curl requests
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));
app.use(express.static('API/public'));

// MongoDB Connection
mongoose.connect('mongodb+srv://deeksha_aashri:Passwordmongo@bybcluster.uft3dbc.mongodb.net/?retryWrites=true&w=majority&appName=BYBCluster', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'BYBCluster' 
});


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Routes
app.use("/api", routes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
