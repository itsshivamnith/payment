const Joi = require('joi');
const { AppError } = require('./errorHandler');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const message = error.details.map(detail => detail.message).join(', ');
      return next(new AppError(message, 400));
    }
    next();
  };
};

const schemas = {
  register: Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  createPayment: Joi.object({
    amount: Joi.number().positive().precision(8).required(),
    currency: Joi.string().valid('BTC', 'ETH', 'USDT', 'STX', 'sBTC').required(),
    memo: Joi.string().max(100),
    description: Joi.string().max(250),
    expiresIn: Joi.number().integer().min(300).max(86400).default(3600),
    webhookUrl: Joi.string().uri()
  })
};

module.exports = {
  validate,
  schemas
};
