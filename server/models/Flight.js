const mongoose = require('mongoose');

const flightSchema = mongoose.Schema({
  airline: { type: String, required: true },
  airlineLogo: { type: String },
  flightNumber: { type: String, required: true },
  from: {
    city: { type: String, required: true },
    code: { type: String, required: true },
  },
  to: {
    city: { type: String, required: true },
    code: { type: String, required: true },
  },
  departureTime: { type: String, required: true },
  arrivalTime: { type: String, required: true },
  duration: { type: String, required: true },
  stops: { type: Number, default: 0 },
  stopCity: { type: String },
  price: { type: Number, required: true },
  class: { type: String, enum: ['Economy', 'Business', 'First'], default: 'Economy' },
  seatsAvailable: { type: Number, default: 50 },
  date: { type: Date, required: true },
}, { timestamps: true });

const Flight = mongoose.model('Flight', flightSchema);
module.exports = Flight;
