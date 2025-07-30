const express = require('express');
const multer = require('multer');
const path = require('path');
const Cake = require('../models/cake.js');

const router = express.Router();

// Configure multer to store files in 'uploads/' folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // relative to root
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  }
});

const upload = multer({ storage });

// POST /api/cakes - upload a cake image + data
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, price } = req.body;
    const newCake = new Cake({
      name,
      price,
      imageUrl: req.file.path  // Save file path
    });
    await newCake.save();
    res.status(201).json(newCake);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/cakes - list all cakes
router.get('/', async (req, res) => {
  try {
    const cakes = await Cake.find();
    res.json(cakes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
