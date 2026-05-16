const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Property'
  },
  dates: {
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true }
  },
  guests: {
    adults: { type: Number, required: true, default: 1 },
    children: { type: Number, default: 0 }
  },
  totalPrice: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'completed'],
    default: 'confirmed'
  },
  invoiceId: {
    type: String
  }
}, {
  timestamps: true
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
