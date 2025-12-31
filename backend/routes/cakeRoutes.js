const express = require('express');
const Cake = require('../models/cake');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// Add new cake (protected)
router.post('/', auth, async (req, res) => {
  try {
    const cake = new Cake(req.body);
    await cake.save();
    res.json(cake);
  } catch (err) {
    res.status(400).json({ message: 'Failed to add cake' });
  }
});

// Get all cakes
router.get('/', async (req, res) => {
  try {
    const cakes = await Cake.find();
    res.json(cakes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load cakes' });
  }
});

// Update cake (protected)
router.put('/:id', auth, async (req, res) => {
  try {
    const cake = await Cake.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cake) return res.status(404).json({ message: 'Cake not found' });
    res.json(cake);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update cake' });
  }
});

// Delete cake (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Cake.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Cake not found' });
    res.json({ message: 'Cake deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Failed to delete cake' });
  }
});

module.exports = router;
