import { connectToDatabase } from "../db/index.js";
import { QuizInfo } from "../models/quiz.model.js";
import mongoDB from "../config/db.config.js";
import QuizNotFoundError from "../errors/quiz-not-found.error.js";
import { ObjectId } from "mongodb";

class QuizService {
  getAllQuiz = async (page: number = 1) => {
    const db = await connectToDatabase();
    const collection = db.collection<QuizInfo>(`${mongoDB.quizCollectionName}`);

    // Calculated quiz pages
    const ITEMS_PER_PAGE = Number(mongoDB.itemPerPage);
    const offset = ((page - 1) * ITEMS_PER_PAGE);
    const total = await collection.countDocuments({});
    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

    // Find quiz in the current page
    const quizePage = await collection.find({})
      .skip(offset)
      .limit(ITEMS_PER_PAGE)
      .toArray();

    // Quizes validation
    if (!quizePage) throw new QuizNotFoundError("Quizes not found.", 404);

    return { quizes: quizePage, totalPages: totalPages };
  }

  getQuizById = async (params: { id: string }) => {
    const db = await connectToDatabase();
    const collection = db.collection(`${mongoDB.quizCollectionName}`);

    // Find quiz by object id
    const quiz = await collection.findOne({ _id: new ObjectId(params.id) });
    if (!quiz) throw new QuizNotFoundError("Quizes not found.", 404);

    return quiz;
  }
}

export default QuizService;