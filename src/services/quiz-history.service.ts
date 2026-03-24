import { ObjectId } from "mongodb";
import UserNotFoundError from "../errors/user-not-found.error.js";
import { QuizHistoryItem, UserQuizAnswer } from "../utils/quiz-history.type.js";
import QuizHistory from "../models/quiz-history.model.js";
import User from "../models/user.model.js";

class QuizHistoryService {
  postNewQuizHistory = async (data: QuizHistoryItem) => {
    // Added new quiz history to database
    const newHistory = new QuizHistory({
      quizId: data.quizId,
      userId: data.userId,
      answers: data.answers,
      submittedDate: new Date().toISOString().split("T")[0],
      score: data.score,
      quizStatus: data.quizStatus
    });

    await newHistory.save();

    // Updated user data
    const user = await User.findOne({ _id: new ObjectId(data.userId) });
    if (!user) {
      throw new UserNotFoundError("User not found", 404);
    }

    // Defined quiz result data
    let quizPassed = data.quizStatus ? 1 : 0;
    let correctAnswers = data.answers.reduce((acc: number, answer: UserQuizAnswer) => {
      return answer.isCorrect ? acc + 1 : acc;
    }, 0);

    const updatedUser = await User.findOneAndUpdate(
      { _id: new ObjectId(data.userId) },
      {
        $inc: {
          quizPassed: quizPassed,
          correctAnswers: correctAnswers
        }
      },
      { returnDocument: 'after' }
    );

    return newHistory;
  }

  getQuizHistoryByUserId = async (params: { id: string }) => {
    const histories = await QuizHistory.find({ userId: params.id });
    return histories;
  }
}

export default QuizHistoryService;