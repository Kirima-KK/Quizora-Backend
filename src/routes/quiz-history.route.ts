import express, { Request } from 'express';
import QuizHistoryController from '../controllers/quiz-history.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { createRateLimitMiddleware, userIdKeyGenerator } from '../middleware/rate-limit.middleware.js';
import { rateLimitConfig } from '../config/rate-limit.config.js';
import { QuizParams } from '../interfaces/quiz.interface.js';

const router = express.Router();
const quizHistoryController = new QuizHistoryController();

const authenticatedRateLimiter = createRateLimitMiddleware({
  keyGenerator: userIdKeyGenerator,
  limit: rateLimitConfig.authenticatedEndpoints.limit,
  windowMs: rateLimitConfig.authenticatedEndpoints.windowMs,
  message: 'Too many requests. Please try again in a minute.',
});

router.post('/api/quiz-history', verifyToken, authenticatedRateLimiter, (req, res, next) => {
  quizHistoryController.postNewQuizHistory(req, res, next);
});

router.get('/api/quiz-history/:id', verifyToken, authenticatedRateLimiter, (req:Request<QuizParams>, res, next) => {
  quizHistoryController.getQuizHistoryByUserId(req, res, next);
})

export default router;