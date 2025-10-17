const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const crypto = require('crypto');

module.exports = async function (fastify, opts) {
  fastify.post('/register', async (req, reply) => {
    const { name, email, phone, password, role = 'rider', driverDetails } = req.body;

    if (!name || !email || !phone || !password) {
        return reply.code(400).send({ error: 'Missing required fields' });
    }

    // Validate driver-specific fields if role is driver
    if (role === 'driver') {
      if (!driverDetails) {
        return reply.code(400).send({ error: 'Driver details are required for driver registration' });
      }

      const { nationalId, drivingLicense, vehicleType, vehicleRegistration } = driverDetails;
      if (!nationalId || !drivingLicense || !vehicleType || !vehicleRegistration) {
        return reply.code(400).send({ error: 'All driver verification fields are required' });
      }
    }

    const passwordHash = await bcrypt.hash(password, 10);

    try {
        // Prepare user data
        const userData = {
          name,
          email,
          phone,
          passwordHash,
          role,
          vehicleType: driverDetails?.vehicleType || null
        };

        // Add driver-specific data if role is driver
        if (role === 'driver' && driverDetails) {
          userData.driverDetails = {
            nationalId: driverDetails.nationalId,
            drivingLicense: driverDetails.drivingLicense,
            vehicleRegistration: driverDetails.vehicleRegistration,
            vehicleMake: driverDetails.vehicleMake,
            vehicleColor: driverDetails.vehicleColor,
            documents: driverDetails.documents || [],
            verificationStatus: 'pending'
          };
        }

        const user = await User.create(userData);
        return reply.code(201).send({
          id: user._id,
          role: user.role,
          message: 'Registered successfully. Driver verification documents are pending review.'
        });
    } catch (e) {
        if (e.code === 11000) return reply.code(409).send({ error: 'Phone number already registered' });
        return reply.code(500).send({ error: 'Registration failed' });
    }
  });

  fastify.post('/login', async (req, reply) => {
    const { loginInput, password } = req.body;

    if (!loginInput || !password) {
      return reply.code(400).send({ error: 'Email/Phone and password are required' });
    }

    // Determine if loginInput is email or phone and find user accordingly
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^256[0-9]{9}$/;

    let user;
    console.log('🔐 Login attempt with input:', loginInput);

    // First, let's check if any users exist in the database
    const totalUsers = await User.countDocuments();
    console.log('📊 Total users in database:', totalUsers);

    if (emailPattern.test(loginInput)) {
      console.log('🔍 Searching by email:', loginInput);
      user = await User.findOne({ email: loginInput });
    } else if (phonePattern.test(loginInput)) {
      console.log('📞 Searching by phone:', loginInput);
      user = await User.findOne({ phone: loginInput });
    } else {
      return reply.code(400).send({ error: 'Please provide a valid email or phone number' });
    }

    console.log('👤 User found:', user ? 'YES' : 'NO');
    if (user) {
      console.log('👤 User details:', { email: user.email, phone: user.phone, role: user.role });
    }
    if (!user) return reply.code(401).send({ error: 'User not found' });

    console.log('🔑 Comparing passwords for user:', user.email || user.phone);
    console.log('🔑 Provided password length:', password.length);
    console.log('🔑 Stored hash length:', user.passwordHash.length);
    const valid = await bcrypt.compare(password, user.passwordHash);
    console.log('🔑 Password valid:', valid);
    if (!valid) {
      console.log('❌ Password comparison failed for user:', user.email || user.phone);
      return reply.code(401).send({ error: 'Invalid password' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return { access_token: token, token_type: 'Bearer', user: { id: user._id, name: user.name, role: user.role } };
  });

  // Forgot Password - Request password reset
  fastify.post('/forgot-password', async (req, reply) => {
    const { email } = req.body;

    if (!email) {
      return reply.code(400).send({ error: 'Email is required' });
    }

    try {
      const user = await User.findOne({ email });
      if (!user) {
        // Don't reveal if email exists or not for security
        return reply.code(200).send({
          message: 'If an account with that email exists, a password reset link has been sent.'
        });
      }

      // Generate secure reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
      const resetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Save reset token to user
      user.resetPasswordToken = resetTokenHash;
      user.resetPasswordExpires = resetExpires;
      await user.save();

      console.log('Password reset requested for:', email);
      console.log('Reset token generated (not hashed):', resetToken);

      // In a real application, you would send an email here
      return reply.code(200).send({
        message: 'Password reset link sent to your email.',
        // Only include reset token in development
        resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined
      });

    } catch (error) {
      console.error('Forgot password error:', error);
      return reply.code(500).send({ error: 'Server error. Please try again.' });
    }
  });

  // Reset Password - Update password with token
  fastify.post('/reset-password', async (req, reply) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return reply.code(400).send({ error: 'Token and new password are required' });
    }

    if (newPassword.length < 6) {
      return reply.code(400).send({ error: 'Password must be at least 6 characters long' });
    }

    try {
      // Hash the provided token to compare with stored hash
      const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

      const user = await User.findOne({
        resetPasswordToken: resetTokenHash,
        resetPasswordExpires: { $gt: new Date() }
      });

      if (!user) {
        return reply.code(400).send({ error: 'Invalid or expired reset token' });
      }

      // Hash new password and update user
      const passwordHash = await bcrypt.hash(newPassword, 10);
      user.passwordHash = passwordHash;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      console.log('Password reset successful for user:', user.email);

      return reply.code(200).send({
        message: 'Password reset successful. You can now login with your new password.'
      });

    } catch (error) {
      console.error('Reset password error:', error);
      return reply.code(500).send({ error: 'Server error. Please try again.' });
    }
  });
};
