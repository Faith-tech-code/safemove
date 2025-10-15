const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function (fastify, opts) {
  fastify.post('/register', async (req, reply) => {
    const { name, phone, password, role = 'rider' } = req.body;

    if (!name || !phone || !password) {
        return reply.code(400).send({ error: 'Missing required fields' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    try {
        const user = await User.create({ name, phone, passwordHash, role });
        return reply.code(201).send({ id: user._id, role: user.role, message: 'Registered successfully' });
    } catch (e) {
        if (e.code === 11000) return reply.code(409).send({ error: 'Phone number already registered' });
        return reply.code(500).send({ error: 'Registration failed' });
    }
  });

  fastify.post('/login', async (req, reply) => {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone });

    if (!user) return reply.code(401).send({ error: 'User not found' });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return reply.code(401).send({ error: 'Invalid password' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return { token: token, user: { id: user._id, name: user.name, role: user.role } };
  });
};
