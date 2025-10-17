const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
   name: { type: String, required: true },
   phone: { type: String, required: true, unique: true },
   email: { type: String, required: true, unique: true },
   role: { type: String, enum: ['rider', 'driver', 'admin'], default: 'rider' },
   passwordHash: { type: String, required: true },
   rating: { type: Number, default: 5.0 },
   verified: { type: Boolean, default: false },
   tier: { type: String, enum: ['Silver', 'Gold', 'Premium'], default: 'Silver' },
   vehicleType: { type: String, enum: ['boda', 'taxi', 'bus', 'car', 'train', null], default: null },

   // Driver-specific fields
   driverDetails: {
     nationalId: { type: String, default: null },
     drivingLicense: { type: String, default: null },
     vehicleRegistration: { type: String, default: null },
     vehicleMake: { type: String, default: null },
     vehicleColor: { type: String, default: null },
     documents: [{
       fieldname: String,
       filename: String,
       url: String,
       mimeType: String,
       size: Number
     }],
     isVerified: { type: Boolean, default: false },
     verificationStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
   },

   // Password reset fields
   resetPasswordToken: { type: String, default: null },
   resetPasswordExpires: { type: Date, default: null }
 }, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
