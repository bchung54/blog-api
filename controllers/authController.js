import asyncHandler from 'express-async-handler';

// POST '/signup'
export const signup = asyncHandler(async (req, res, next) => {
  res.json({ message: 'POST user sign-up' });
});

// POST '/login'
export const login = asyncHandler(async (req, res, next) => {
  res.json({ message: 'POST user login' });
});

// GET '/logout'
export const logout = asyncHandler(async (req, res, next) => {
  res.json({ message: 'GET logout' });
});
