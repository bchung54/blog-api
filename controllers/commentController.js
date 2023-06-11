import asyncHandler from 'express-async-handler';

// GET '/posts/:postid/comments'
export const get_comment_list = asyncHandler(async (req, res, next) => {
  res.json({ message: 'GET all comments' });
});

// DELETE '/posts/:postid/comments'
export const delete_comment_list = asyncHandler(async (req, res, next) => {
  res.json({ message: 'DELETE all comments' });
});

// GET '/posts/:postid/comments/:commentid'
export const get_comment = asyncHandler(async (req, res, next) => {
  res.json({ message: 'GET comment' });
});

// POST '/posts/:postid/comments/:commentid'
export const create_comment = asyncHandler(async (req, res, next) => {
  res.json({ message: 'POST new comment' });
});

// DELETE '/posts/:postid/comments/:commentid'
export const delete_comment = asyncHandler(async (req, res, next) => {
  res.json({ message: 'DELETE comment' });
});

// PUT '/posts/:postid/comments/:commentid'
export const update_comment = asyncHandler(async (req, res, next) => {
  res.json({ message: 'PUT comment' });
});
