import express from 'express';
import AuthController from '../controllers/auth.controller.js';
import { publicRateLimiter } from '../middleware/rate-limit.middleware.js';

const router = express.Router();
const authController = new AuthController();

router.post('/api/register', publicRateLimiter, (req, res, next) => {
  authController.register(req, res, next)
});

router.post('/api/login', publicRateLimiter, (req, res, next) => {
  authController.login(req, res, next);
});

router.post('/api/logout', publicRateLimiter, (req, res, next) => {
  authController.logout(req, res, next);
});

export default router;
