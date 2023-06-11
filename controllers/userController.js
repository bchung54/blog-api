import asyncHandler from 'express-async-handler';

// GET '/api/users'
export const get_users_list = asyncHandler(async (req, res, next) => {
  res.json({ message: 'GET all users' });
});

// GET '/api/users/:userid'
export const get_user = asyncHandler(async (req, res, next) => {
  res.json({ message: 'GET user' });
});

// DELETE '/api/users/:userid'
export const delete_user = asyncHandler(async (req, res, next) => {
  res.json({ message: 'DELETE user' });
});

// PUT '/api/users/:userid'
export const update_user = asyncHandler(async (req, res, next) => {
  res.json({ message: 'PUT user' });
});

// GET '/api/users/:userid/posts'
export const get_user_posts = asyncHandler(async (req, res, next) => {
  res.json({ message: 'GET user posts' });
});
