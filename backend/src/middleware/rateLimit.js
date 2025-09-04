const rateLimit = require('express-rate-limit');

const createRateLimit = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      status: 'error',
      message
    },
    standardHeaders: true,
    legacyHeaders: false
  });
};

module.exports = {
  general: createRateLimit(
    15 * 60 * 1000, // 15 minutes
    100,
    'Too many requests from this IP'
  ),
  auth: createRateLimit(
    15 * 60 * 1000,
    5,
    'Too many authentication attempts'
  ),
  payment: createRateLimit(
    5 * 60 * 1000,
    10,
    'Too many payment requests'
  )
};
