const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true
  },
  customerEmail: String,
  customerPhone: {
    type: String,
    required: true
  },
  cakeName: {
    type: String,
    required: true
  },
  cakeImage: {
    type: String,
    default: null
  },
  cakePrice: Number,
  quantity: {
    type: Number,
    default: 1
  },
  location: {
    type: String,
    required: true
  },
  description: String,
  weight: String,
  deliveryDate: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);
