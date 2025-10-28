// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// ===== Middleware =====
app.use(cors());
app.use(express.json());

// ===== Static Files (for uploaded images) =====
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ===== Route Imports =====
const orderRoutes = require('./routes/orderRoutes');
const cakeRoutes = require('./routes/cakeRoutes');
const authRoutes = require('./routes/authRoutes');

// ===== API Routes =====
app.use('/api/orders', orderRoutes);
app.use('/api/cakes', cakeRoutes);       // Cake add/update/delete
app.use('/api/auth', authRoutes);        // Owner login

// ===== MongoDB Connection =====
const MONGO_URI = process.env.MONGO_URI || process.env.mongo; // support both key names

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1); // Stop server if DB connection fails
  });

// ===== Start Server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
