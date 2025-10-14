const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, reply) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.code(401).send({ error: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return reply.code(401).send({ error: 'User not found' });
    }

    req.user = user;
  } catch (err) {
    reply.code(401).send({ error: 'Invalid or expired token' });
  }
};

module.exports = { authenticate };
