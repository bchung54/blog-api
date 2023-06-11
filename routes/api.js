import { Router } from 'express';
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

// Delete single user.
router.delete('/users/:userid', userController.delete_user);

// Update single user.
router.put('/users/:userid', userController.update_user);

/* Post Routes */

// Get all posts.
router.get('/posts', postController.get_post_list);

// Delete all posts.
router.delete('/posts', postController.delete_post_list);

// Get single post.
router.get('/posts/:id', postController.get_post);

// Create single post.
router.post('/posts/:id', postController.create_post);

// Delete single post.
router.delete('/posts/:id', postController.delete_post);

// Update single post.
router.put('/posts/:id', postController.update_post);

/* Comment Routes */

// Get all comments.
router.get('/posts/:postid/comments', commentController.get_comment_list);

// Delete all comments.
router.delete('/posts/:postid/comments', commentController.delete_comment_list);

// Get single comment.
router.get('/posts/:postid/comments/:commentid', commentController.get_comment);

// Create single comment.
router.post(
  '/posts/:postid/comments/:commentid',
  commentController.create_comment
);

// Delete single comment.
router.delete(
  '/posts/:postid/comments/:commentid',
  commentController.delete_comment
);

// Update single comment.
router.put(
  '/posts/:postid/comments/:commentid',
  commentController.update_comment
);

export default router;
