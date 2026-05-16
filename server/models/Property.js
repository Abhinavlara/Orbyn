const mongoose = require('mongoose');

const propertySchema = mongoose.Schema({
  host: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    address: String,
    city: String,
    country: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ['Adventure', 'Culture', 'Food', 'Luxury', 'Wellness', 'Beach', 'City'],
    default: 'Luxury'
  },
  type: {
    type: String,
    enum: ['Hotel', 'Villa', 'Apartment', 'Resort', 'Hostel', 'Cottage'],
    default: 'Villa'
  },
  maxGuests: {
    type: Number,
    default: 6
  },
  images: [String],
  amenities: [String],
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  availability: [{
    startDate: Date,
    endDate: Date,
    isBooked: { type: Boolean, default: false }
  }]
}, {
  timestamps: true
});

const Property = mongoose.model('Property', propertySchema);
module.exports = Property;
