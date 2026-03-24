import express from 'express';
import QuizHistoryController from '../controllers/quiz-history.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();
const quizHistoryController = new QuizHistoryController();

router.post('/api/quiz-history', verifyToken, (req, res, next) => {
  quizHistoryController.postNewQuizHistory(req, res, next);
});

router.get('/api/quiz-history/:id', verifyToken, (req, res, next) => {
  quizHistoryController.getQuizHistoryByUserId(req, res, next);
})

export default router;