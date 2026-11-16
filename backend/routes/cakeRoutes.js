const express = require('express');
const Cake = require('../models/cake');
const auth = require('../middleware/authMiddleware');
const { upload, publicPathFor } = require('../middleware/upload');
const router = express.Router();

const CAKE_TYPES = Cake.CAKE_TYPES;

// Add new cake (protected).
// Accepts either a multipart/form-data upload with an `image` file or a
// JSON body containing a base64 `image` string (legacy clients).
router.post('/upload', auth, upload.single('image'), async (req, res) => {
  try {
    const { type, price, name, description } = req.body;

    const image = req.file ? publicPathFor(req.file) : req.body.image;

    if (!type || price === undefined || price === '' || !image) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    if (!CAKE_TYPES.includes(type)) {
      return res.status(400).json({ message: 'Please choose a valid cake type' });
    }

    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice) || numericPrice <= 0) {
      return res.status(400).json({ message: 'Price must be greater than 0' });
    }

    const newCake = new Cake({
      ownerId: req.user.id,
      name: (name || '').trim(),
      type,
      price: numericPrice,
      image,
      description: (description || '').trim(),
    });

    await newCake.save();
    res.status(201).json({ message: 'Cake uploaded successfully', cake: newCake });
  } catch (err) {
    console.error('Error uploading cake:', err);
    res.status(400).json({ message: 'Failed to upload cake', error: err.message });
  }
});

// Get the cakes highlighted on the home page (public)
router.get('/featured', async (req, res) => {
  try {
    const cakes = await Cake.find({ featured: true })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();
    res.json(cakes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load featured cakes' });
  }
});

// Get all cakes
router.get('/', async (req, res) => {
  try {
    const cakes = await Cake.find().sort({ createdAt: -1 }).lean();
    res.json(cakes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load cakes' });
  }
});

// Get cakes by type
router.get('/type/:type', async (req, res) => {
  try {
    const type = req.params.type;
    if (!CAKE_TYPES.includes(type)) {
      return res.status(400).json({ message: 'Please choose a valid cake type' });
    }
    const cakes = await Cake.find({ type }).sort({ createdAt: -1 }).lean();
    res.json(cakes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load cakes' });
  }
});

// Get owner's cakes (protected)
router.get('/owner/my-cakes', auth, async (req, res) => {
  try {
    const cakes = await Cake.find({ ownerId: req.user.id }).sort({ createdAt: -1 }).lean();
    res.json(cakes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load your cakes' });
  }
});

// Get a single cake by id
router.get('/:id', async (req, res) => {
  try {
    const cake = await Cake.findById(req.params.id);
    if (!cake) {
      return res.status(404).json({ message: 'Cake not found' });
    }
    res.json(cake);
  } catch (err) {
    res.status(400).json({ message: 'Failed to load cake' });
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
    if (req.body.price !== undefined) {
      const numericPrice = Number(req.body.price);
      if (Number.isNaN(numericPrice) || numericPrice <= 0) {
        return res.status(400).json({ message: 'Price must be greater than 0' });
      }
      cake.price = numericPrice;
    }

    if (req.body.type !== undefined) {
      if (!CAKE_TYPES.includes(req.body.type)) {
        return res.status(400).json({ message: 'Please choose a valid cake type' });
      }
      cake.type = req.body.type;
    }

    if (req.body.name !== undefined) {
      cake.name = String(req.body.name).trim();
    }

    if (req.body.description !== undefined) {
      cake.description = String(req.body.description).trim();
    }

    if (req.body.featured !== undefined) {
      cake.featured = Boolean(req.body.featured);
    }

    if (req.body.image !== undefined && req.body.image) {
      cake.image = req.body.image;
    }

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
