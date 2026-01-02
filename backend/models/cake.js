const mongoose = require('mongoose');

const cakeSchema = new mongoose.Schema({
  name: String,
  price: Number,
  imageUrl: String,  // store file path
  category: { type: String, default: 'general' }
});

module.exports = mongoose.model('Cake', cakeSchema);
