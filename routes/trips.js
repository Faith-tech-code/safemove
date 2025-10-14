const Trip = require('../models/Trip');
const { authenticate } = require('../utils/auth');

module.exports = async function (fastify, opts) {
  fastify.addHook('preHandler', authenticate);

  fastify.post('/', async (req, reply) => {
    const { mode, startCoords, endCoords, startAddress, endAddress } = req.body;

    let fare;
    switch (mode) {
        case 'boda': fare = 5; break;
        case 'taxi': fare = 15; break;
        case 'car': fare = 25; break;
        case 'bus': fare = 10; break; 
        case 'train': fare = 35; break; 
        default: return reply.code(400).send({ error: 'Invalid transport mode' });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    const trip = await Trip.create({
      rider: req.user._id,
      mode,
      startCoords,
      endCoords,
      startAddress,
      endAddress,
      fare,
      otp,
      status: 'pending'
    });

    return reply.code(201).send({ 
        message: `Trip requested. Looking for service... OTP is ${otp}`, 
        tripId: trip._id, 
        fare,
        otp
    });
  });

  fastify.get('/', async (req, reply) => {
    const trips = await Trip.find({ rider: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('-driver'); 

    return trips;
  });
};
