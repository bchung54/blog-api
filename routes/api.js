import { Router } from 'express';
import passport from 'passport';
import * as postController from '../controllers/postController.js';
import * as commentController from '../controllers/commentController.js';
import * as userController from '../controllers/userController.js';
const router = Router();

/* User Routes */

// Get all users.
router.get('/users', userController.get_users_list);

// Get all posts from single user.
router.get('/users/:userid/posts', userController.get_user_posts);

// Get single user.
router.get('/users/:userid', userController.get_user);

// Delete single user. For users only.
router.delete(
  '/users/:userid',
  passport.authenticate('jwt', { session: false }),
  userController.delete_user
);

// Update single user. For users only.
router.put(
  '/users/:userid',
  passport.authenticate('jwt', { session: false }),
  userController.update_user
);

/* Post Routes */

// Get all posts.
router.get('/posts', postController.get_post_list);

// Delete all posts. For users only.
router.delete(
  '/posts',
  passport.authenticate('jwt', { session: false }),
  postController.delete_post_list
);

// Get single post.
router.get('/posts/:id', postController.get_post);

// Create single post. For users only.
router.post(
  '/posts/:id',
  passport.authenticate('jwt', { session: false }),
  postController.create_post
);

// Delete single post. For users only.
router.delete(
  '/posts/:id',
  passport.authenticate('jwt', { session: false }),
  postController.delete_post
);

// Update single post. For users only.
router.put(
  '/posts/:id',
  passport.authenticate('jwt', { session: false }),
  postController.update_post
);

/* Comment Routes */

// Get all comments.
router.get('/posts/:postid/comments', commentController.get_comment_list);

// Delete all comments. For users only.
router.delete(
  '/posts/:postid/comments',
  passport.authenticate('jwt', { session: false }),
  commentController.delete_comment_list
);

// Get single comment.
router.get('/posts/:postid/comments/:commentid', commentController.get_comment);

// Create single comment.
router.post(
  '/posts/:postid/comments/:commentid',
  commentController.create_comment
);

// Delete single comment. For users only.
router.delete(
  '/posts/:postid/comments/:commentid',
  passport.authenticate('jwt', { session: false }),
  commentController.delete_comment
);

// Update single comment. For users only.
router.put(
  '/posts/:postid/comments/:commentid',
  passport.authenticate('jwt', { session: false }),
  commentController.update_comment
);

export default router;
