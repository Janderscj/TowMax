require('dotenv').config();
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const towingRoutes = require('./routes/towingRoutes');
const userRoutes = require('./routes/userRoutes');
const garageRoutes = require('./routes/garageRoutes');
const app = express();
app.set('trust proxy', 1); // Trust first proxy (if behind a proxy like Heroku or Vercel)

const corsOptions = {
  origin:
    process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Enable gzip compression for all responses
app.use(compression());
app.use(express.json({ limit: '1mb' })); //  Add request size limit

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/towing', towingRoutes);
app.use('/api/user', userRoutes);
app.use('/api/garage', garageRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('SERVER BOOTED');
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});
