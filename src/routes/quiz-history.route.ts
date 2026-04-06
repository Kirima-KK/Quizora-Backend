import express, { Request } from 'express';
import QuizHistoryController from '../controllers/quiz-history.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { QuizParams } from '../interfaces/quiz.interface.js';

const router = express.Router();
const quizHistoryController = new QuizHistoryController();

router.post('/api/quiz-history', verifyToken, (req, res, next) => {
  quizHistoryController.postNewQuizHistory(req, res, next);
});

router.get('/api/quiz-history/:id', verifyToken, (req:Request<QuizParams>, res, next) => {
  quizHistoryController.getQuizHistoryByUserId(req, res, next);
})

export default router;