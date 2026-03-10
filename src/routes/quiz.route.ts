import express from "express";
import QuizController from "../controllers/quiz.controller.js";

const router = express.Router();
const quizController = new QuizController();

router.get('/api/quiz', (req, res, next) => {
  quizController.getAllQuiz(req, res, next);
});

router.get('/api/quiz/:id', (req, res, next) => {
  quizController.getQuizById(req, res, next);
})

export default router;