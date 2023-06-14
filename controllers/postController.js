import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';
import Post from '../models/post.js';
import Comment from '../models/comment.js';

// GET '/api/posts'
export const get_post_list = asyncHandler(async (req, res, next) => {
  const allPosts = await Post.find({}).populate('author', 'name email').exec();
  return res.status(200).json({ posts: allPosts });
});

// DELETE '/api/posts'
export const delete_post_list = asyncHandler(async (req, res, next) => {
  const deleted = await Post.deleteMany({});
  return res
    .status(200)
    .json({ message: `${deleted.deletedCount} post(s) have been deleted.` });
});

// GET '/api/posts/:postid'
export const get_post = asyncHandler(async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postid).exec();
    if (post === null) {
      return res.status(404).json({ error: 'No post found.' });
    } else {
      return res.status(200).json({ post: post });
    }
  } catch (err) {
    return res.status(404).json({ error: err });
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
          error:
            'Post with same title already exists. Change title or revise existing post.',
          post: posts,
        });
      } else {
        const post = new Post({
          title: req.body.title,
          author: req.user._id,
          content: req.body.content,
          published: req.body.published,
        });
        await post.save();
        return res
          .status(200)
          .json({ message: `Post successful. Title: ${req.body.title}` });
      }
    } catch (err) {
      return res.status(404).json({ error: err });
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
        .json({ error: 'Post not found. Nothing to delete.' });
    }

    return res
      .status(200)
      .json({ message: `${deletedPost.title} has been successfully deleted.` });
  } catch (err) {
    return res.status(404).json({ error: err });
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
        return res
          .status(400)
          .json({ error: 'This user already has a post with the same title.' });
      }

      const updatedPost = new Post({
        title: req.body.title,
        author: req.user._id,
        content: req.body.content,
        published: req.body.published,
        _id: req.params.postid,
      });

      await Post.findByIdAndUpdate(req.params.postid, updatedPost, {});
      return res.status(200).json({
        message: `Post: ${req.body.title} updated successfully.`,
        post: updatedPost,
      });
    } catch (err) {
      return res.status(404).json({ error: err });
    }
  }),
];
