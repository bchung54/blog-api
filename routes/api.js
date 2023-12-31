import { Router } from 'express';
import passport from 'passport';
import * as postController from '../controllers/postController.js';
import * as commentController from '../controllers/commentController.js';
import * as userController from '../controllers/userController.js';
import validateObjectId from '../utils/validateObjectId.js';
const router = Router();

/* User Routes */

// Get all users.
router.get('/users', userController.get_users_list);

// Get single user.
router.get('/users/:username', userController.get_user);

// Get all posts from single user.
router.get('/users/:username/posts', userController.get_user_posts);

/* User Routes Protected */
// Delete single user. For users only.
router.delete(
  '/users/:username',
  passport.authenticate('jwt', { session: false }),
  userController.delete_user
);

// Update single user. For users only.
router.put(
  '/users/:username',
  passport.authenticate('jwt', { session: false }),
  userController.update_user
);

/* Post Routes */

// Get all posts.
router.get('/posts', postController.get_post_list);

// Get single post.
router.get('/posts/:postid', validateObjectId, postController.get_post);

/* Post Routes Protected */
// Create single post. For users only.
router.post(
  '/posts',
  passport.authenticate('jwt', { session: false }),
  postController.create_post
);

// Delete single post. For users only.
router.delete(
  '/posts/:postid',
  passport.authenticate('jwt', { session: false }),
  validateObjectId,
  postController.delete_post
);

// Update single post. For users only.
router.put(
  '/posts/:postid',
  passport.authenticate('jwt', { session: false }),
  validateObjectId,
  postController.update_post
);

// Delete all posts. For users only.
router.delete(
  '/posts',
  passport.authenticate('jwt', { session: false }),
  postController.delete_post_list
);

/* Comment Routes */

// Get all comments.
router.get(
  '/posts/:postid/comments',
  validateObjectId,
  commentController.get_comment_list
);

// Get single comment.
router.get(
  '/posts/:postid/comments/:commentid',
  validateObjectId,
  commentController.get_comment
);

// Create single comment.
router.post(
  '/posts/:postid/comments',
  validateObjectId,
  commentController.create_comment
);

/* Comment Routes Protected */
// Delete single comment. For users only.
router.delete(
  '/posts/:postid/comments/:commentid',
  passport.authenticate('jwt', { session: false }),
  validateObjectId,
  commentController.delete_comment
);

// Update single comment. For users only.
router.put(
  '/posts/:postid/comments/:commentid',
  passport.authenticate('jwt', { session: false }),
  validateObjectId,
  commentController.update_comment
);

// Delete all comments. For users only.
router.delete(
  '/posts/:postid/comments',
  passport.authenticate('jwt', { session: false }),
  validateObjectId,
  commentController.delete_comment_list
);

export default router;
