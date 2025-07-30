const mongoose = require('mongoose');

const cakeSchema = new mongoose.Schema({
  name: String,
  price: Number,
  imageUrl: String  // store file path
});

module.exports = mongoose.model('Cake', cakeSchema);
