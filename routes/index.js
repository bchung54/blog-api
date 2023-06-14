import { Router } from 'express';
import passport from 'passport';
import * as authController from '../controllers/authController.js';
const router = Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get(
  '/protected',
  passport.authenticate('jwt', { session: false }),
  authController.protectedRoute
);

router.post('/signup', authController.signup);

router.post(
  '/login',
  passport.authenticate('local', { session: false }),
  authController.login
);

router.get('/logout', authController.logout);

export default router;
