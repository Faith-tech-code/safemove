const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  rider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  mode: { type: String, enum: ['boda', 'taxi', 'bus', 'car', 'train'], required: true },
  startCoords: { type: [Number], required: true },
  endCoords: { type: [Number], required: true },
  startAddress: { type: String },
  endAddress: { type: String },
  fare: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'], default: 'pending' },
  otp: { type: String, default: null },
  startTime: Date,
  endTime: Date,
}, { timestamps: true });

module.exports = mongoose.model('Trip', tripSchema);
