import { Router } from 'express';
import passport from 'passport';
import * as authController from '../controllers/authController.js';
const router = Router();

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/signup', authController.signup);

router.get('/logout', authController.logout);

/* User Protected Routes */

router.get(
  '/protected',
  passport.authenticate('jwt', { session: false }),
  authController.protectedRoute
);

router.post(
  '/login',
  passport.authenticate('local', { session: false }),
  authController.login
);

export default router;
