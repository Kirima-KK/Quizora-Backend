import mongoDB from "../config/db.config.js";
import QuizNotFoundError from "../errors/quiz-not-found.error.js";
import { ObjectId } from "mongodb";
import Quiz from "../models/quiz.model.js";

class QuizService {
  getAllQuiz = async (page: number) => {
    // Calculated quiz pages
    const itemPerPage = page ? Number(mongoDB.itemPerPage) : 0;
    const offset = ((page - 1) * itemPerPage);
    const total = await Quiz.countDocuments({});
    const totalPages = Math.ceil(total / itemPerPage);

    // Find quiz in the current page
    const quizePage = await Quiz.find({})
      .skip(offset)
      .limit(itemPerPage)

    // Quizes validation
    if (!quizePage) throw new QuizNotFoundError("Quizes not found.", 404);

    return { quizes: quizePage, totalPages: totalPages };
  }

  getQuizById = async (params: { id: string }) => {
    // Find quiz by object id
    const quiz = await Quiz.findOne({ _id: new ObjectId(params.id) });
    if (!quiz) throw new QuizNotFoundError("Quizes not found.", 404);

    return quiz;
  }
}

export default QuizService;