import { Request, Response, NextFunction } from "express";
import QuizHistoryService from "../services/quiz-history.service.js";
import { QuizParams } from "../interfaces/quiz.interface.js";

const quizHistoryService = new QuizHistoryService();

class QuizHistoryController {
  postNewQuizHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newHistory = await quizHistoryService.postNewQuizHistory(req.body);

      return res.status(200).json({
        message: 'Save new quiz history success.',
        data: newHistory,
      });
    } catch (err) {
      next(err);
    }
  }

  getQuizHistoryByUserId = async (req: Request<QuizParams>, res: Response, next: NextFunction) => {
    try {
      const quizHistories = await quizHistoryService.getQuizHistoryByUserId(req.params);

      return res.status(200).json({
        quizHistory: quizHistories
      });
    } catch (err) {
      next(err);
    }
  }
}

export default QuizHistoryController;