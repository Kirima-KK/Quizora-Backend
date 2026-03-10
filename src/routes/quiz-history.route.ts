import express from 'express';
import QuizHistoryController from '../controllers/quiz-history.controller.js';

const router = express.Router();
const quizHistoryController = new QuizHistoryController();

router.post('/api/quiz-history', (req, res, next) => {
  quizHistoryController.postNewQuizHistory(req, res, next);
});

export default router;