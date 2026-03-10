import QuizHistoryService from "../services/quiz-history.service.js";

const quizHistoryService = new QuizHistoryService();

class QuizHistoryController {
  postNewQuizHistory = async (req, res, next) => {
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

}

export default QuizHistoryController;