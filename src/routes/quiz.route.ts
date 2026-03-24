import express from "express";
import QuizController from "../controllers/quiz.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();
const quizController = new QuizController();

router.get('/api/quiz', verifyToken, (req, res, next) => {
  quizController.getAllQuiz(req, res, next);
});

router.get('/api/quiz/:id', verifyToken, (req, res, next) => {
  quizController.getQuizById(req, res, next);
})

export default router;