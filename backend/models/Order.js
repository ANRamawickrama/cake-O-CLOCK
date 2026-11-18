const mongoose = require('mongoose');

const ORDER_STATUSES = ['Pending', 'Confirmed', 'Baking', 'Ready', 'Completed', 'Cancelled'];

const orderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 120
  },
  customerEmail: {
    type: String,
    trim: true,
    default: ''
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    default: null
  },
  customerPhone: {
    type: String,
    required: true,
    trim: true,
    maxlength: 40
  },
  cakeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cake',
    default: null
  },
  cakeName: {
    type: String,
    required: true,
    trim: true
  },
  cakeImage: {
    type: String,
    default: null
  },
  cakePrice: {
    type: Number,
    default: 0,
    min: 0
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1
  },
  totalPrice: {
    type: Number,
    default: 0,
    min: 0
  },
  location: {
    type: String,
    required: true,
    trim: true,
    maxlength: 400
  },
  description: {
    type: String,
    default: '',
    maxlength: 1000
  },
  weight: {
    type: String,
    default: '',
    maxlength: 40
  },
  deliveryDate: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ORDER_STATUSES,
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

orderSchema.index({ createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ customerId: 1, createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
module.exports.ORDER_STATUSES = ORDER_STATUSES;
