import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import towingRoutes from './routes/towingRoutes.js';
import userRoutes from './routes/userRoutes.js';
import garageRoutes from './routes/garageRoutes.js';
import { validateAllData } from '../scripts/validateData.js';

const app = express();
app.set('trust proxy', 1); // Trust first proxy (if behind a proxy like Heroku or Vercel)
const isDevelopment = process.env.NODE_ENV !== 'production';
const allowedOrigin = process.env.FRONTEND_URL || (isDevelopment ? 'http://localhost:3000' : null);

const corsOptions = {
  origin: allowedOrigin || false,
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
  if (isDevelopment) {
    console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  }
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

// Validate data before starting server
const allValid = validateAllData();

if (!allValid) {
  console.error('\n Data validation failed. Fix errors before starting the server.');
  process.exit(1);
}

app.listen(PORT, () => {
  console.log('\n SERVER BOOTED');
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
