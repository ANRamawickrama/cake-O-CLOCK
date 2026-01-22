const mongoose = require('mongoose');

const cakeSchema = new mongoose.Schema({
  price: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Birthday Cake', 'Anniversary Cake', 'Cupcake', 'Wedding Cake', 'Wedding Structure', 'Jar Cake']
  },
  image: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Cake', cakeSchema);
