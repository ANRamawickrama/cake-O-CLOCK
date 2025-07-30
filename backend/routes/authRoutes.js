// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();

const OWNER_USERNAME = 'owner';
const OWNER_PASSWORD = 'yourSecret123';

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === OWNER_USERNAME && password === OWNER_PASSWORD) {
    // In real app, generate JWT token here
    res.json({ success: true, token: 'fake-jwt-token-for-demo' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

module.exports = router;
