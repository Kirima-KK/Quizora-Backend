import express from 'express';
import AuthController from '../controllers/auth.controller.js';
import { createRateLimitMiddleware, ipKeyGenerator } from '../middleware/rate-limit.middleware.js';
import { rateLimitConfig } from '../config/rate-limit.config.js';

const router = express.Router();
const authController = new AuthController();

const publicRateLimiter = createRateLimitMiddleware({
  keyGenerator: ipKeyGenerator,
  limit: rateLimitConfig.publicEndpoints.limit,
  windowMs: rateLimitConfig.publicEndpoints.windowMs,
  message: 'Too many authentication requests. Please try again in a minute.',
});

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