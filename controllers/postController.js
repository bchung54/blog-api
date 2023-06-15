import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';

import Comment from '../models/comment.js';
import Post from '../models/post.js';

// GET '/api/posts'
export const get_post_list = asyncHandler(async (req, res, next) => {
  try {
    const allPosts = await Post.find({})
      .populate('author', 'name email')
      .exec();

    return res.json(allPosts);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// DELETE '/api/posts'
export const delete_post_list = asyncHandler(async (req, res, next) => {
  try {
    const deleted = await Post.deleteMany({});

    return res.json({
      message: `${deleted.deletedCount} post(s) have been deleted.`,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// GET '/api/posts/:postid'
export const get_post = asyncHandler(async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postid).exec();

    if (post === null) {
      return res.status(404).json({ message: 'No post found.' });
    }

    return res.json({ post: post });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// POST '/api/posts'
export const create_post = [
  body('title')
    .notEmpty()
    .withMessage('Title must be specified.')
    .trim()
    .escape(),
  body('content')
    .notEmpty()
    .withMessage('Content must be specified.')
    .trim()
    .escape(),
  body('published').isBoolean().withMessage('Published must be boolean.'),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.arrary() });
    }

    try {
      const posts = await Post.find(
        { title: req.body.title, author: req.user._id },
        'title'
      ).exec();

      if (posts.length > 0) {
        return res.status(400).json({
          message:
            'Post with same title already exists. Change title or revise existing post.',
          post: posts,
        });
      }

      const newPost = new Post({
        title: req.body.title,
        author: req.user._id,
        content: req.body.content,
        published: req.body.published,
      });

      await newPost.save();

      return res.status(201).json(newPost);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }),
];

// DELETE '/api/posts/:postid'
export const delete_post = asyncHandler(async (req, res, next) => {
  try {
    const [deletedPost, comments] = await Promise.all([
      Post.findByIdAndDelete(req.params.postid),
      Comment.deleteMany({ post: req.params.postid }),
    ]);

    if (deletedPost === null) {
      return res
        .status(404)
        .json({ message: 'Post not found. Nothing to delete.' });
    }

    return res.json({
      message: `${deletedPost.title} has been successfully deleted.`,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// PUT '/api/posts/:postid'
export const update_post = [
  body('title')
    .notEmpty()
    .withMessage('Title must be specified.')
    .trim()
    .escape(),
  body('content')
    .notEmpty()
    .withMessage('Content must be specified.')
    .trim()
    .escape(),
  body('published').isBoolean().withMessage('Published must be boolean.'),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.arrary() });
    }

    try {
      const [post, duplicateTitlePosts] = await Promise.all([
        Post.findById(req.params.postid).exec(),
        Post.find({ title: req.body.title, author: req.user._id }).exec(),
      ]);

      if (post.title !== req.body.title && duplicateTitlePosts.length > 0) {
        return res.status(400).json({
          message: 'This user already has a post with the same title.',
        });
      }

      const updatedPost = new Post({
        title: req.body.title,
        author: req.user._id,
        content: req.body.content,
        published: req.body.published,
        _id: req.params.postid,
      });

      await Post.findByIdAndUpdate(req.params.postid, updatedPost, {});

      return res.json(updatedPost);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }),
];
