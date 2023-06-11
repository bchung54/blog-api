import asyncHandler from 'express-async-handler';

// GET '/api/posts'
export const get_post_list = asyncHandler(async (req, res, next) => {
  res.json({ message: 'GET all posts' });
});

// DELETE '/api/posts'
export const delete_post_list = asyncHandler(async (req, res, next) => {
  res.json({ message: 'DELETE all posts' });
});

// GET '/api/posts/:id'
export const get_post = asyncHandler(async (req, res, next) => {
  res.json({ message: 'GET post' });
});

// POST '/api/posts/:id'
export const create_post = asyncHandler(async (req, res, next) => {
  res.json({ message: 'POST new post' });
});

// DELETE '/api/posts/:id'
export const delete_post = asyncHandler(async (req, res, next) => {
  res.json({ message: 'DELETE post' });
});

// PUT '/api/posts/:id'
export const update_post = asyncHandler(async (req, res, next) => {
  res.json({ message: 'PUT post' });
});
