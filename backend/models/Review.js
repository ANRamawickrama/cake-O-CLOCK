const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  cakeName: {
    type: String,
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  email: String,
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Review', reviewSchema);
