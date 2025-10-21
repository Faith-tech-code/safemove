const fastify = require('fastify')({ logger: true });
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Enhanced MongoDB connection with better error handling
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000
})
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    console.log('📊 Database:', mongoose.connection.db.databaseName);
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('🔍 Please check:');
    console.error('   - MongoDB URI in .env file');
    console.error('   - Network connectivity to MongoDB Atlas');
    console.error('   - Database user permissions');
    console.error('   - IP whitelist in MongoDB Atlas');
    // Don't exit process, let server run without DB for debugging
    console.log('⚠️ Server will continue running without database connection');
  });

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('📱 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('📱 Mongoose disconnected from MongoDB');
});

fastify.register(require('@fastify/cors'), {
  origin: (origin, callback) => {
    // Log the incoming origin for debugging purposes
    console.log(`🔍 CORS Origin received: ${origin}`);
    // More robust regex for Netlify deploy previews and branch deploys
    const netlifyRegex = /^https:\/\/([a-zA-Z0-9-]+--)?safemove\.netlify\.app$/;
    // Also allow any netlify.app domain for development/testing
    const anyNetlifyRegex = /^https:\/\/[a-zA-Z0-9-]+.netlify\.app$/;
    const allowedOrigins = [
      'https://safemove.netlify.app', // Your main production site
      'https://imaginative-mooncake-de0de1.netlify.app', // Current deployment
    ];

    // Allow requests with no origin (mobile apps, Postman, etc.)
    // Allow requests with no origin (e.g., mobile apps, Postman)
    if (!origin) {
      console.log('✅ CORS: Allowing request with no origin');
      return callback(null, true);
    }

    // Allow localhost for development
    // Allow localhost and 127.0.0.1 for local development on any port
    if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
      console.log('✅ CORS: Allowing localhost origin');
      return callback(null, true);
    }

    // Allow production origins
    if (allowedOrigins.includes(origin) || netlifyRegex.test(origin) || anyNetlifyRegex.test(origin)) {
      console.log(`✅ CORS: Allowing Netlify origin: ${origin}`);
    // Allow your main Netlify domain and any of its subdomains (for deploy previews)
    if (/(^https:\/\/safemove\.netlify\.app$)|(\.netlify\.app$)/.test(origin)) {
      return callback(null, true);
    }

    // Block all other origins
    console.log(`❌ CORS: Blocked origin: ${origin}`);
    fastify.log.warn(`CORS: Blocked origin: ${origin}`);
    callback(new Error('Not allowed by CORS'));
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
