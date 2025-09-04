const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');

const authRoutes = require('./src/routes/auth');
const paymentRoutes = require('./src/routes/payments');
const webhookRoutes = require('./src/routes/webhooks');
const errorHandler = require('./src/middleware/errorHandler');
const rateLimit = require('./src/middleware/rateLimit');

const paymentMonitor = require('./src/jobs/paymentMonitor');
const priceUpdater = require('./src/jobs/priceUpdater');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(compression());

// Rate limiting
app.use('/api/', rateLimit.general);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/webhooks', webhookRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    version: '1.0.0'
  });
});

// ✅ FIXED: 404 handler for Express v5
app.use('/{*catchAll}', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Error handling
app.use(errorHandler);

// Start background jobs
if (process.env.NODE_ENV !== 'test') {
  paymentMonitor.start();
  priceUpdater.start();
}

module.exports = app;
