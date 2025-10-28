const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Owner = require('models/Owner');
const router = express.Router();

// Register owner (run once to create owner account)
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const owner = new Owner({ email, password: hashed });
  await owner.save();
  res.json({ message: 'Owner created successfully' });
});

// Login owner
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const owner = await Owner.findOne({ email });
  if (!owner) return res.status(400).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, owner.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: owner._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

module.exports = router;
