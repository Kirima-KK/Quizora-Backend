import QuizService from "../services/quiz.service.js";

const quizService = new QuizService();

class QuizController {
  getAllQuiz = async (req, res, next) => {
    const page = req.query.page;

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
}

export default QuizController;