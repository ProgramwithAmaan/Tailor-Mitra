const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/auth');
const customerRoutes = require('./routes/customers');
const orderRoutes = require('./routes/orders');

// Load environment variables
dotenv.config();

const app = express();

// ============================================================
// CORS CONFIGURATION
// ============================================================

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  'https://tailor-mitra-1.onrender.com',
  'https://tailor-mitra.onrender.com', // Add your backend URL too
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (Postman, server-to-server, etc.)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log('❌ CORS blocked:', origin);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
  })
);

// ============================================================
// MIDDLEWARE
// ============================================================

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================================
// DATABASE CONNECTION
// ============================================================

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log('✅ MongoDB connected successfully');
  console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// MongoDB connection events
mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected');
});

// ============================================================
// ROUTES
// ============================================================

// Health check route
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Tailor Management System API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      auth: '/api/auth',
      customers: '/api/customers',
      orders: '/api/orders',
      health: '/health',
    },
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);

// Legacy health route (for backward compatibility)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    uptime: process.uptime(),
  });
});

// ============================================================
// 404 HANDLER
// ============================================================

app.use((req, res) => {
  console.log(`❌ Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method,
  });
});

// ============================================================
// GLOBAL ERROR HANDLER
// ============================================================

app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  console.error('📝 Stack:', err.stack);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors,
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`,
    });
  }

  // JWT error
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
  }

  // Default error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ============================================================
// START SERVER
// ============================================================

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📍 API URL: http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📡 CORS allowed origins: ${allowedOrigins.join(', ')}\n`);
});

// ============================================================
// GRACEFUL SHUTDOWN
// ============================================================

const gracefulShutdown = (signal) => {
  console.log(`\n⚠️ Received ${signal}, shutting down gracefully...`);
  
  server.close(() => {
    console.log('🔌 HTTP server closed');
    
    mongoose.connection.close(false, () => {
      console.log('🔌 MongoDB connection closed');
      console.log('✅ Shutdown complete');
      process.exit(0);
    });
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error('❌ Force shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise);
  console.error('📝 Reason:', reason);
  process.exit(1);
});

module.exports = app;















// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const authRoutes = require('./routes/auth');
// const customerRoutes = require('./routes/customers');
// const orderRoutes = require('./routes/orders');

// dotenv.config();

// const app = express();

// const allowedOrigins = [
//   'http://localhost:3000',
//   'http://localhost:5173',
//   'http://localhost:5174',
//   'http://127.0.0.1:5173',
//   'http://127.0.0.1:3000',
//   'https://tailor-mitra-1.onrender.com',
// ];

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       // Allow requests with no origin
//       // (Postman, server-to-server, etc.)
//       if (!origin) {
//         return callback(null, true);
//       }

//       if (allowedOrigins.includes(origin)) {
//         return callback(null, true);
//       }

//       console.log('❌ CORS blocked:', origin);
//       return callback(new Error('Not allowed by CORS'));
//     },
//     credentials: true,
//   })
// );

// // const allowedOrigins = [
// //   'http://localhost:3000',
// //   'http://localhost:5173',
// //   'http://localhost:5174',
// //   'http://127.0.0.1:5173',
// //   'http://127.0.0.1:3000',
// //   'http://0.0.0.0:5173',
// // ];

// // app.use(cors({
// //   origin: (origin, callback) => {
// //     if (
// //       !origin ||
// //       allowedOrigins.includes(origin) ||
// //       /^http:\/\/192\.168\./.test(origin) ||
// //       /^http:\/\/10\./.test(origin) ||
// //       /^http:\/\/172\.(1[6-9]|2[0-9]|3[0-1])\./.test(origin)
// //     ) {
// //       callback(null, true);
// //       return;
// //     }

// //     callback(new Error('Not allowed by CORS'));
// //   },
// //   credentials: true,
// // }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tailor_db', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('✅ MongoDB connected successfully'))
// .catch(err => {
//   console.error('❌ MongoDB connection error:', err);
//   process.exit(1);
// });

// app.get('/', (req, res) => {
//   res.json({
//     message: 'Tailor Management System API',
//     version: '1.0.0',
//     status: 'running',
//   });
// });

// app.use('/api/auth', authRoutes);
// app.use('/api/customers', customerRoutes);
// app.use('/api/orders', orderRoutes);

// app.get('/api/health', (req, res) => {
//   res.json({
//     status: 'healthy',
//     timestamp: new Date(),
//     uptime: process.uptime(),
//   });
// });

// app.use((err, req, res, next) => {
//   console.error('❌ Server Error:', err);
//   res.status(500).json({
//     success: false,
//     message: 'Internal Server Error',
//     error: process.env.NODE_ENV === 'development' ? err.message : undefined,
//   });
// });

// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     message: 'Route not found',
//     path: req.originalUrl,
//   });
// });

// const PORT = process.env.PORT || 5001;
// const server = app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
//   console.log(`📍 API URL: http://localhost:${PORT}`);
// });

// process.on('SIGTERM', () => {
//   server.close(() => {
//     mongoose.connection.close(false, () => {
//       process.exit(0);
//     });
//   });
// });

// process.on('SIGINT', () => {
//   server.close(() => {
//     mongoose.connection.close(false, () => {
//       process.exit(0);
//     });
//   });
// });

// module.exports = app;
