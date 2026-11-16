const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 120
  },
  email: {
    type: String,
    trim: true,
    default: ''
  },
  phone: {
    type: String,
    trim: true,
    default: '',
    maxlength: 40
  },
  subject: {
    type: String,
    trim: true,
    default: 'Custom cake enquiry',
    maxlength: 160
  },
  occasion: {
    type: String,
    trim: true,
    default: '',
    maxlength: 80
  },
  guests: {
    type: String,
    trim: true,
    default: '',
    maxlength: 40
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  status: {
    type: String,
    enum: ['New', 'Read', 'Replied'],
    default: 'New'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

contactMessageSchema.index({ createdAt: -1 });

module.exports = mongoose.model('ContactMessage', contactMessageSchema);