const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema({
  identifier: { type: String, required: true }, // phone or email
  otp: { type: String, required: true },
  purpose: { type: String, enum: ['login', 'verify-email', 'reset-password'], default: 'login' },
  attempts: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true }
}, { timestamps: true });

// Index to automatically delete expired OTPs
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('OTP', OTPSchema);
