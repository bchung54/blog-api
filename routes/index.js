import { Router } from 'express';
import * as authController from '../controllers/authController.js';
const router = Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/signup', authController.signup);

router.post('/login', authController.login);

router.get('/logout', authController.logout);

export default router;
