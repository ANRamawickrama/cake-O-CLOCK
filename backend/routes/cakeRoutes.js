const express = require('express');
const Cake = require('../models/Cake');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// Add new cake
router.post('/', auth, async (req, res) => {
  const cake = new Cake(req.body);
  await cake.save();
  res.json(cake);
});

// Get all cakes
router.get('/', async (req, res) => {
  const cakes = await Cake.find();
  res.json(cakes);
});

// Update cake
router.put('/:id', auth, async (req, res) => {
  const cake = await Cake.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(cake);
});

// Delete cake
router.delete('/:id', auth, async (req, res) => {
  await Cake.findByIdAndDelete(req.params.id);
  res.json({ message: 'Cake deleted' });
});

module.exports = router;
