// routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const parser = require('../middleware/cloudinaryStorage');

router.post('/upload', parser.single('image'), (req, res) => {
  if (!req.file || !req.file.path) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  res.json({ imageUrl: req.file.path }); // Cloudinary URL
});

module.exports = router;
