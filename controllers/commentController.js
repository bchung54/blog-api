import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';

import Comment from '../models/comment.js';
import Post from '../models/post.js';

// GET '/api/posts/:postid/comments'
export const get_comment_list = asyncHandler(async (req, res, next) => {
  try {
    const comments = await Comment.find({ post: req.params.postid })
      .sort({ createdAt: -1 })
      .populate('post')
      .exec();

    return res.status(200).json({
      postTitle:
        comments.length > 0 ? comments[0].post.title : 'No comments found.',
      comments: comments,
    });
  } catch (err) {
    return res.status(400).json({ error: err });
  }
});

// DELETE '/api/posts/:postid/comments'
export const delete_comment_list = asyncHandler(async (req, res, next) => {
  try {
    const [deleted, post] = await Promise.all([
      Comment.deleteMany({ post: req.params.postid }),
      Post.findById(req.params.postid).exec(),
    ]);

    if (post === null) {
      return res.status(404).json({ error: 'No post found.' });
    }

    return res.status(200).json({
      message: `${deleted.deletedCount} comment(s) have been deleted.`,
    });
  } catch (err) {
    return res.status(404).json({ error: err });
  }
});

// GET '/api/posts/:postid/comments/:commentid'
export const get_comment = asyncHandler(async (req, res, next) => {
  try {
    const comments = await Comment.find({ post: req.params.postid })
      .sort({ createdAt: -1 })
      .populate('post')
      .exec();

    return res.status(200).json({
      postTitle:
        comments.length > 0 ? comments[0].post.title : 'No comments found.',
      comments: comments,
    });
  } catch (err) {
    return res.status(404).json({ error: err });
  }
});

// POST '/api/posts/:postid/comments'
export const create_comment = [
  body('author')
    .notEmpty()
    .withMessage('Name must be specified.')
    .trim()
    .escape(),
  body('email')
    .notEmpty()
    .withMessage('Email must be specified.')
    .isEmail()
    .withMessage('Email must be valid.')
    .normalizeEmail()
    .trim()
    .escape(),
  body('content')
    .notEmpty()
    .withMessage('Comment cannot be blank.')
    .trim()
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const [post, duplicateComments] = await Promise.all([
        Post.findById(req.params.postid).exec(),
        Comment.find({
          email: req.body.email,
          content: req.body.content,
        }).exec(),
      ]);

      if (post === null) {
        return res
          .status(404)
          .json({ message: 'Post does not exist. Unable to post comment.' });
      }

      if (duplicateComments.length > 0) {
        return res.status(400).json({
          error: 'This user by email has already posted this same comment.',
        });
      }

      const newComment = new Comment({
        post: req.params.postid,
        author: req.body.author,
        email: req.body.email,
        content: req.body.content,
      });

      await newComment.save();
      return res
        .status(200)
        .json({ message: `Comment posted. Content: ${req.body.content}` });
    } catch (err) {
      return res.status(404).json({ error: err });
    }
  }),
];

// DELETE '/api/posts/:postid/comments/:commentid'
export const delete_comment = asyncHandler(async (req, res, next) => {
  try {
    const deletedComment = await Comment.findOneAndDelete({
      _id: req.params.commentid,
      post: req.params.postid,
    });

    if (deletedComment === null) {
      return res
        .status(404)
        .json({ error: 'Comment does not exist. Nothing to delete.' });
    }

    return res.status(200).json({
      message: `Comment: '${deletedComment.content}' successfully deleted.`,
    });
  } catch (err) {
    return res.status(404).json({ error: err });
  }
});

// PUT '/api/posts/:postid/comments/:commentid'
export const update_comment = [
  body('author')
    .notEmpty()
    .withMessage('Name must be specified.')
    .trim()
    .escape(),
  body('email')
    .notEmpty()
    .withMessage('Email must be specified.')
    .isEmail()
    .withMessage('Email must be valid.')
    .normalizeEmail()
    .trim()
    .escape(),
  body('content')
    .notEmpty()
    .withMessage('Comment cannot be blank.')
    .trim()
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const [post, comment] = await Promise.all([
        Post.findById(req.params.postid).exec(),
        Comment.findById(req.params.commentid).exec(),
      ]);

      if (post === null) {
        return res
          .status(404)
          .json({ error: 'Post does not exist. Unable to update comment.' });
      }

      if (comment === null) {
        return res
          .status(404)
          .json({ error: 'Comment does not exist. Nothing to delete.' });
      }

      const updatedComment = new Comment({
        post: post._id,
        author: req.body.author,
        email: req.body.email,
        content: req.body.content,
        _id: comment._id,
      });

      await Comment.findByIdAndUpdate(comment._id, updatedComment, {});

      return res
        .status(200)
        .json({ message: `Comment updated. Content: ${req.body.content}` });
    } catch (err) {
      return res.status(404).json({ error: err });
    }
  }),
];
