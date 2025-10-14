const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  role: { type: String, enum: ['rider', 'driver', 'admin'], default: 'rider' },
  passwordHash: { type: String, required: true },
  rating: { type: Number, default: 5.0 },
  verified: { type: Boolean, default: false },
  tier: { type: String, enum: ['Silver', 'Gold', 'Premium'], default: 'Silver' },
  vehicleType: { type: String, enum: ['boda', 'taxi', 'bus', 'car', 'train', null], default: null },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
