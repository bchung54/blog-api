import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

import User from '../models/user.js';

import 'dotenv/config';

// Protected route
export const protectedRoute = (req, res, next) => {
  res.json({ success: true, message: 'You are authorized' });
};

// POST '/signup'
export const signup = [
  body('name')
    .notEmpty()
    .trim()
    .escape()
    .withMessage('Name must be specified.'),
  body('username')
    .isLength({ min: 5, max: 99 })
    .trim()
    .escape()
    .withMessage('Username must be between 5 and 99 characters long.'),
  body('email')
    .isEmail()
    .withMessage('Email must be valid (ex. email@domain.com).')
    .custom(async (email) => {
      const user = await User.findOne({ email: email }).exec();

      if (user) {
        throw new Error('Email already in use.');
      }
    }),
  body('password')
    .isLength({ min: 8 })
    .escape()
    .withMessage('Password must be at least 8 characters long.')
    .not()
    .isLowercase()
    .not()
    .isUppercase()
    .not()
    .isNumeric()
    .not()
    .isAlpha()
    .withMessage(
      'Password must contain each of the following: lowercase, uppercase and number.'
    ),
  body('confirmPassword').custom(async (confirmPassword, { req }) => {
    const password = req.body.password;

    if (password !== confirmPassword) {
      throw new Error('Passwords must be the same.');
    }
  }),

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(403).json({
        username: req.body.username,
        errors: errors.array(),
      });
    } else {
      bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        if (err) {
          return next(err);
        }

        try {
          const user = new User({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
          });

          await user.save();
          res.json({ message: 'User created successfully' });
        } catch (err) {
          return next(err);
        }
      });
    }
  }),
];

// POST '/login'
export const login = (req, res, next) => {
  req.login(req.user, { session: false });

  const body = {
    _id: req.user._id,
    username: req.user.username,
    name: req.user.name,
  };

  const token = jwt.sign({ user: body }, process.env.JWT_PRIVATE_KEY, {
    algorithm: 'RS256',
    expiresIn: '1d',
  });

  return res.json({ body, token });
};

// GET '/logout'
export const logout = asyncHandler(async (req, res, next) => {
  res.json({ message: 'GET logout' });
});
