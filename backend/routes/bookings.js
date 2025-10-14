const Booking = require('../models/Booking');
const Trip = require('../models/Trip');
const { authenticate } = require('../middleware/auth');

async function routes(fastify, options) {
  fastify.get('/', { preHandler: authenticate }, async (request, reply) => {
    try {
      const bookings = await Booking.find({ user: request.user._id })
        .populate('trip')
        .sort({ createdAt: -1 });

      return reply.send({ bookings });
    } catch (error) {
      return reply.code(500).send({ error: error.message });
    }
  });

  fastify.get('/:id', { preHandler: authenticate }, async (request, reply) => {
    try {
      const booking = await Booking.findById(request.params.id)
        .populate('trip')
        .populate('user', 'name email phone');

      if (!booking) {
        return reply.code(404).send({ error: 'Booking not found' });
      }

      if (booking.user._id.toString() !== request.user._id.toString()) {
        return reply.code(403).send({ error: 'Not authorized' });
      }

      return reply.send({ booking });
    } catch (error) {
      return reply.code(500).send({ error: error.message });
    }
  });

  fastify.post('/', { preHandler: authenticate }, async (request, reply) => {
    try {
      const { tripId, seats } = request.body;

      const trip = await Trip.findById(tripId);
      if (!trip) {
        return reply.code(404).send({ error: 'Trip not found' });
      }

      if (trip.availableSeats < seats) {
        return reply.code(400).send({ error: 'Not enough seats available' });
      }

      const totalPrice = trip.price * seats;

      const booking = new Booking({
        user: request.user._id,
        trip: tripId,
        seats,
        totalPrice
      });

      await booking.save();

      trip.availableSeats -= seats;
      await trip.save();

      return reply.code(201).send({
        message: 'Booking created successfully',
        booking
      });
    } catch (error) {
      return reply.code(500).send({ error: error.message });
    }
  });

  fastify.patch('/:id/cancel', { preHandler: authenticate }, async (request, reply) => {
    try {
      const booking = await Booking.findById(request.params.id);

      if (!booking) {
        return reply.code(404).send({ error: 'Booking not found' });
      }

      if (booking.user.toString() !== request.user._id.toString()) {
        return reply.code(403).send({ error: 'Not authorized' });
      }

      if (booking.status === 'cancelled') {
        return reply.code(400).send({ error: 'Booking already cancelled' });
      }

      booking.status = 'cancelled';
      await booking.save();

      const trip = await Trip.findById(booking.trip);
      if (trip) {
        trip.availableSeats += booking.seats;
        await trip.save();
      }

      return reply.send({
        message: 'Booking cancelled successfully',
        booking
      });
    } catch (error) {
      return reply.code(500).send({ error: error.message });
    }
  });
}

module.exports = routes;
