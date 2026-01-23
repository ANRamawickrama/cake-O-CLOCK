const express = require('express');
const Cake = require('../models/cake');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// Add new cake (protected) - accepts base64 image
router.post('/upload', auth, async (req, res) => {
  try {
    const { type, price, image, description } = req.body;

    if (!type || !price || !image) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    if (price <= 0) {
      return res.status(400).json({ message: 'Price must be greater than 0' });
    }

    const newCake = new Cake({
      ownerId: req.user.id,
      type,
      price,
      image,
      description: description || ''
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

// Get owner's cakes (protected)
router.get('/owner/my-cakes', auth, async (req, res) => {
  try {
    const cakes = await Cake.find({ ownerId: req.user.id }).sort({ createdAt: -1 });
    res.json(cakes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load your cakes' });
  }
});

// Update cake (protected) - Only owner can update their own cakes
router.put('/:id', auth, async (req, res) => {
  try {
    const cake = await Cake.findById(req.params.id);
    
    if (!cake) {
      return res.status(404).json({ message: 'Cake not found' });
    }

    // Authorization: Check if owner matches
    if (cake.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to update this cake' });
    }

    // Validate price if being updated
    if (req.body.price !== undefined && req.body.price <= 0) {
      return res.status(400).json({ message: 'Price must be greater than 0' });
    }

    // Update allowed fields
    const allowedFields = ['type', 'price', 'image', 'description'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        cake[field] = req.body[field];
      }
    });

    cake.updatedAt = new Date();
    await cake.save();
    
    res.json({ message: 'Cake updated successfully', cake });
  } catch (err) {
    res.status(400).json({ message: 'Failed to update cake', error: err.message });
  }
});

// Delete cake (protected) - Only owner can delete their own cakes
router.delete('/:id', auth, async (req, res) => {
  try {
    const cake = await Cake.findById(req.params.id);
    
    if (!cake) {
      return res.status(404).json({ message: 'Cake not found' });
    }

    // Authorization: Check if owner matches
    if (cake.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to delete this cake' });
    }

    await Cake.findByIdAndDelete(req.params.id);
    res.json({ message: 'Cake deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Failed to delete cake', error: err.message });
  }
});

module.exports = router;
