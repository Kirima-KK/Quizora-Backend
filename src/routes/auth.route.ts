import express from 'express';
import AuthController from '../controllers/auth.controller.js';

const router = express.Router();
const authController = new AuthController();

router.post('/login', (req, res, next) => {
  authController.login(req, res, next);
});

export default router;