const mongoose = require('mongoose');

const TrainSchema = new mongoose.Schema({
  trainNumber: { type: String, required: true, unique: true },
  trainName: { type: String, required: true },
  from: {
    station: { type: String, required: true },
    code: { type: String, required: true },
    city: { type: String, required: true }
  },
  to: {
    station: { type: String, required: true },
    code: { type: String, required: true },
    city: { type: String, required: true }
  },
  departureTime: { type: String, required: true }, // e.g., "06:30"
  arrivalTime: { type: String, required: true },
  duration: { type: String, required: true },
  daysOfRun: [{ type: String }], // ["Mon", "Wed", "Fri"]
  classes: [{
    type: { type: String, enum: ['SL', '3A', '2A', '1A', 'CC', 'EC'] },
    price: { type: Number, required: true },
    seatsAvailable: { type: Number, default: 0 }
  }],
  trainType: { type: String, enum: ['Express', 'Superfast', 'Rajdhani', 'Shatabdi', 'Vande Bharat', 'Duronto'], default: 'Express' }
}, { timestamps: true });

module.exports = mongoose.model('Train', TrainSchema);
