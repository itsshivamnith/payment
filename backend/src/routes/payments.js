const express = require('express');
const { authenticate } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');
const paymentService = require('../services/paymentService');
const { AppError } = require('../middleware/errorHandler');
const rateLimit = require('../middleware/rateLimit');

const router = express.Router();

router.use(authenticate);

// Create payment
router.post('/', 
  rateLimit.payment,
  validate(schemas.createPayment),
  async (req, res, next) => {
    try {
      const payment = await paymentService.createPayment(req.user.id, req.body);
      res.status(201).json({
        status: 'success',
        data: { payment }
      });
    } catch (error) {
      next(new AppError(error.message, 400));
    }
  }
);

// Get payments
router.get('/', async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      currency
    } = req.query;

    const options = {
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      status,
      currency
    };

    const payments = await paymentService.getPayments(req.user.id, options);

    res.json({
      status: 'success',
      data: { 
        payments,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get payment by ID
router.get('/:id', async (req, res, next) => {
  try {
    const payment = await paymentService.getPaymentById(req.params.id, req.user.id);
    
    if (!payment) {
      return next(new AppError('Payment not found', 404));
    }

    res.json({
      status: 'success',
      data: { payment }
    });
  } catch (error) {
    next(error);
  }
});

// Get payment stats
router.get('/stats/overview', async (req, res, next) => {
  try {
    const stats = await paymentService.getPaymentStats(req.user.id);
    
    res.json({
      status: 'success',
      data: { stats }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
