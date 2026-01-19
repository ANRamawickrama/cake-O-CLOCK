const express = require('express');
const Cake = require('../models/cake');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// Add new cake (protected) - accepts base64 image
router.post('/upload', auth, async (req, res) => {
  try {
    const { name, type, price, image } = req.body;

    if (!name || !type || !price || !image) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    const newCake = new Cake({
      name,
      type,
      price,
      image
    });

    await newCake.save();
    res.status(201).json({ message: 'Cake uploaded successfully', cake: newCake });
  } catch (err) {
    console.error('Error uploading cake:', err);
    res.status(400).json({ message: 'Failed to upload cake', error: err.message });
  }
});

// Get all cakes
router.get('/', async (req, res) => {
  try {
    const cakes = await Cake.find().sort({ createdAt: -1 });
    res.json(cakes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load cakes' });
  }
});

// Get cakes by type
router.get('/type/:type', async (req, res) => {
  try {
    const cakes = await Cake.find({ type: req.params.type }).sort({ createdAt: -1 });
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
