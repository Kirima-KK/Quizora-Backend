import mongoDB from "../config/db.config.js";
import QuizNotFoundError from "../errors/quiz-not-found.error.js";
import { ObjectId } from "mongodb";
import Quiz from "../models/quiz.model.js";

class QuizService {
  getAllQuiz = async (page: number, query?: string) => {
    // Calculated quiz pages
    const itemPerPage = page ? Number(mongoDB.itemPerPage) : 0;
    let offset = ((page - 1) * itemPerPage);
    if (offset <= 0) offset = 0;

    // filtered quizes
    let filter: any = {};
    if (query) {
      filter = {
        $or: [
          { name: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ]
      }
    }

    // Get total pages
    const total = await Quiz.countDocuments(filter);
    const totalPages = page ? Math.ceil(total / itemPerPage) : 1;

    // Find quiz in the current page
    const quizes = await Quiz.find(filter)
      .skip(offset)
      .limit(itemPerPage);

    // Quizes validation
    if (!quizes) throw new QuizNotFoundError("Quizes not found.", 404);

    return { quizes: quizes, totalPages: totalPages };
  }

  getQuizById = async (params: { id: string }) => {
    // Find quiz by object id
    const quiz = await Quiz.findOne({ _id: new ObjectId(params.id) });
    if (!quiz) throw new QuizNotFoundError("Quizes not found.", 404);

    return quiz;
  }
}

export default QuizService;