const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// POST - Create a new review (public route)
router.post('/', async (req, res) => {
  try {
    const { cakeName, customerName, email, rating, comment } = req.body;

    // Validation
    if (!cakeName || !customerName || !rating || !comment) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const newReview = new Review({
      cakeName,
      customerName,
      email: email || 'Anonymous',
      rating,
      comment
    });

    await newReview.save();
    res.status(201).json({ message: 'Review posted successfully', review: newReview });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Failed to post review', error: error.message });
  }
});

// GET - Get reviews by cake name
router.get('/cake/:cakeName', async (req, res) => {
  try {
    const { cakeName } = req.params;
    const reviews = await Review.find({ cakeName })
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Failed to fetch reviews', error: error.message });
  }
});

// GET - Get all reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find()
      .sort({ createdAt: -1 })
      .limit(100);
    
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
});

// GET - Get average rating for a cake
router.get('/rating/:cakeName', async (req, res) => {
  try {
    const { cakeName } = req.params;
    const reviews = await Review.find({ cakeName });
    
    if (reviews.length === 0) {
      return res.json({ averageRating: 0, totalReviews: 0 });
    }
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = (totalRating / reviews.length).toFixed(1);
    
    res.json({ averageRating, totalReviews: reviews.length });
  } catch (error) {
    console.error('Error calculating rating:', error);
    res.status(500).json({ message: 'Failed to fetch rating' });
  }
});

module.exports = router;
