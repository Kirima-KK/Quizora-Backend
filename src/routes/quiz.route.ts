import express, { Request } from "express";
import QuizController from "../controllers/quiz.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { createRateLimitMiddleware, userIdKeyGenerator } from "../middleware/rate-limit.middleware.js";
import { rateLimitConfig } from "../config/rate-limit.config.js";
import { QuizParams } from "../interfaces/quiz.interface.js";

const router = express.Router();
const quizController = new QuizController();

const authenticatedRateLimiter = createRateLimitMiddleware({
  keyGenerator: userIdKeyGenerator,
  limit: rateLimitConfig.authenticatedEndpoints.limit,
  windowMs: rateLimitConfig.authenticatedEndpoints.windowMs,
  message: 'Too many requests. Please try again in a minute.',
});

router.get('/api/quiz', verifyToken, authenticatedRateLimiter, (req, res, next) => {
  quizController.getAllQuiz(req, res, next);
});

router.get('/api/quiz/:id', verifyToken, authenticatedRateLimiter, (req: Request<QuizParams>, res, next) => {
  quizController.getQuizById(req, res, next);
})

export default router;