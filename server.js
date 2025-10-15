const fastify = require('fastify')({ logger: true });
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

fastify.register(require('@fastify/cors'), {
  origin: (origin, callback) => {
    // Allow requests from localhost (development) and Netlify (production)
    const allowedOrigins = [
      'http://localhost:8000',
      'http://127.0.0.1:8000',
      'http://localhost:5500',
      'http://127.0.0.1:5500',
      'https://imaginative-mooncake-de0de1.netlify.app',
      'https://safemove.netlify.app',
      'https://main--safemove.netlify.app'
    ];

    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
});

fastify.register(require('@fastify/multipart'));

fastify.register(require('@fastify/static'), {
  root: require('path').join(__dirname, 'uploads'),
  prefix: '/uploads/',
});

fastify.register(require('@fastify/static'), {
  root: require('path').join(__dirname, 'frontend'),
  prefix: '/',
  decorateReply: false
});

fastify.get('/', async (request, reply) => {
  return { message: 'SafeMove API is running', version: '1.0.0' };
});

fastify.register(require('./routes/auth'), { prefix: '/v1/auth' });
fastify.register(require('./routes/trips'), { prefix: '/v1/trips' });
fastify.register(require('./routes/upload'), { prefix: '/v1/upload' });

const start = async () => {
  try {
    await fastify.listen({ port: process.env.PORT || 8000, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();

