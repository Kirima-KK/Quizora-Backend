import QuizService from "../services/quiz.service.js";
import { Request, Response, NextFunction } from "express";
import { QuizParams } from "../interfaces/quiz.interface.js";

const quizService = new QuizService();

class QuizController {
  getAllQuiz = async (req: Request, res: Response, next: NextFunction) => {
    const page = Number(req.query.page);

    try {
      const quizInfo = await quizService.getAllQuiz(page);

      return res.status(200).json({
        quizes: quizInfo.quizes,
        totalPages: quizInfo.totalPages
      });
    } catch (err) {
      next(err);
    }
  }

  getQuizById = async (req: Request<QuizParams>, res: Response, next: NextFunction) => {
    try {
      const quiz = await quizService.getQuizById(req.params);

      return res.status(200).json(quiz);
    } catch (err) {
      next(err);
    }
  }
}

export default QuizController;