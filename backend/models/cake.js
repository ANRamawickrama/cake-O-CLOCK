const mongoose = require('mongoose');

const CAKE_TYPES = [
  'Birthday Cake',
  'Anniversary Cake',
  'Cupcake',
  'Wedding Cake',
  'Wedding Structure',
  'Jar Cake',
];

const cakeSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Owner',
    required: true
  },
  name: {
    type: String,
    trim: true,
    maxlength: 120,
    default: ''
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  weightKg: {
    type: Number,
    min: 0,
    default: 0
  },
  type: {
    type: String,
    required: true,
    enum: CAKE_TYPES
  },
  image: {
    type: String,
    required: true
  },
  source: {
    type: String,
    enum: ['catalogue', 'owner'],
    default: 'owner'
  },
  featured: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    default: '',
    maxlength: 600
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

cakeSchema.index({ type: 1, createdAt: -1 });
cakeSchema.index({ createdAt: -1 });
cakeSchema.index({ ownerId: 1 });
cakeSchema.index({ featured: 1, createdAt: -1 });

cakeSchema.virtual('displayName').get(function displayName() {
  return this.name || this.type;
});

cakeSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.displayName = doc.displayName;
    return ret;
  },
});

module.exports = mongoose.model('Cake', cakeSchema);
module.exports.CAKE_TYPES = CAKE_TYPES;
