const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: String,
  customerEmail: String,
  cakeName: String,
  quantity: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);
