const express = require('express');
const { hashPassword, comparePassword, generateToken } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');
const { AppError } = require('../middleware/errorHandler');
const prisma = require('../config/database');
const rateLimit = require('../middleware/rateLimit');

const router = express.Router();

// Register
router.post('/register', 
  rateLimit.auth,
  validate(schemas.register),
  async (req, res, next) => {
    try {
      const { name, email, password } = req.body;

      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return next(new AppError('User already exists', 400));
      }

      const hashedPassword = await hashPassword(password);

      const user = await prisma.user.create({
        data: {
          name,
          email,
          passwordHash: hashedPassword
        }
      });

      const token = generateToken(user.id);

      res.status(201).json({
        status: 'success',
        token,
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

// Login
router.post('/login',
  rateLimit.auth,
  validate(schemas.login),
  async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user || !(await comparePassword(password, user.passwordHash))) {
        return next(new AppError('Incorrect email or password', 401));
      }

      if (!user.isActive) {
        return next(new AppError('Account is deactivated', 401));
      }

      const token = generateToken(user.id);

      res.json({
        status: 'success',
        token,
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
