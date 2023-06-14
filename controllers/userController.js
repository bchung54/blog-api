import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';
import User from '../models/user.js';
import Post from '../models/post.js';

// GET '/api/users'
export const get_users_list = asyncHandler(async (req, res, next) => {
  const users = await User.find(
    {},
    { name: 1, username: 1, email: 1, _id: 0 }
  ).exec();

  return res.status(200).json({ users: users });
});

// GET '/api/users/:username'
export const get_user = asyncHandler(async (req, res, next) => {
  const user = await User.findOne(
    { username: req.params.username },
    { name: 1, username: 1, email: 1, _id: 0 }
  ).exec();

  if (user === null) {
    return res.status(404).json({ error: 'User not found.' });
  }

  return res.status(200).json({ user: user });
});

// DELETE '/api/users/:username'
export const delete_user = asyncHandler(async (req, res, next) => {
  const deletedUser = await User.findOneAndDelete({
    username: req.params.username,
  });

  if (deletedUser === null) {
    return res.status(404).json({ error: 'User not found.' });
  }

  return res
    .status(200)
    .json({ message: `${req.params.username} has been successfully deleted.` });
});

// PUT '/api/users/:username'
export const update_user = [
  body('name')
    .notEmpty()
    .withMessage('Name must be specified.')
    .trim()
    .escape(),
  body('email')
    .isEmail()
    .withMessage('Email must be valid (ex. email@domain.com).')
    .normalizeEmail()
    .trim(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const [user, duplicateEmailUsers] = await Promise.all([
      User.findOne({ username: req.params.username }).exec(),
      User.find({ email: req.body.email }).exec(),
    ]);

    if (user === null) {
      return res
        .status(204)
        .json({ message: 'User not found. Nothing to update.' });
    }

    if (user.email !== req.body.email && duplicateEmailUsers.length > 0) {
      return res.status(400).json({ error: 'Email already in use.' });
    }

    try {
      const updatedUser = new User({
        // username  & password cannot be updated
        username: user.username,
        password: user.password,

        name: req.body.name,
        email: req.body.email,
        _id: user._id,
      });

      await User.findByIdAndUpdate(user._id, updatedUser, {});

      return res
        .status(200)
        .json({ message: `User: ${user.username} updated successfully.` });
    } catch (err) {
      return res.status(404).json({ error: err });
    }
  }),
];

// GET '/api/users/:username/posts'
export const get_user_posts = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ username: req.params.username }).exec();

  if (user === null) {
    return res.status(204).json({ message: 'User not found.' });
  }

  try {
    const allPostsByUser = await Post.find({
      author: user._id,
    }).exec();

    if (allPostsByUser && allPostsByUser.length > 0) {
      return res.status(200).json({
        message: `All posts by ${user.username}`,
        posts: allPostsByUser,
      });
    }

    return res
      .status(200)
      .json({ message: `No posts made yet by ${user.username}` });
  } catch (err) {
    return res.status(404).json({ error: err });
  }
});
