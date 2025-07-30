// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); 
const uploadRoutes = require('./routes/uploadRoutes');

// Route files
const orderRoutes = require('./routes/orderRoutes');
const cakeRoutes = require('./routes/cakeRoutes'); 

const app = express();

// MongoDB Atlas URI (hardcoded)
const MONGO_URI = process.env.mongo;

// Middleware
app.use(cors());
app.use(express.json());

// Serve image files from /uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api/orders', orderRoutes);
app.use('/api/cakes', cakeRoutes); // for cake name, price, and image upload
app.use('/api', uploadRoutes);
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
