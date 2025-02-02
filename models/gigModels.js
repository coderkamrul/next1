const mongoose = require('mongoose');

// Package Schema
const PackageSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ['Basic', 'Standard', 'Premium'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  deliveryTime: {
    type: Number,
    required: true
  },
  revisions: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  features: [{
    type: String,
    required: true
  }]
});

// Seller Schema
const SellerSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  }
});

// Review Schema
const ReviewSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
}, {
  timestamps: true
});

// Main Service Schema
const ServiceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'draft'],
    default: 'active',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  subcategory: {
    type: String,
    required: true
  },
  serviceType: {
    type: String,
    required: true
  },
  tags: [{
    type: String,
    required: true
  }],
  packages: {
    type: [PackageSchema],
    required: true,
    validate: [arrayLimit, '{PATH} must contain exactly 3 packages']
  },
  description: {
    type: Object,
    type: [],
    time: Number,
    blocks: [],
    version: String,
  },
  seller: {
    type: SellerSchema,
    required: true
  },
  requirements: [{
    type: String,
    required: true
  }],
  images: [{
    type: String,
    required: true
  }],
  rating: {
    type: Number,
    default: 5
  },
  reviews: [ReviewSchema],
  reviewsCount: {
    type: Number,
    default: 203
  }
}, {
  timestamps: true,
});

// Validation to ensure exactly 3 packages
function arrayLimit(val) {
  return val.length === 3;
}

// Create and export the model


const Gig = mongoose.models?.Gig ||
mongoose.model('Gig', ServiceSchema)
module.exports = {
  Gig,
};

