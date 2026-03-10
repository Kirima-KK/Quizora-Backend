import { ObjectId } from "mongodb";
import mongoDB from "../config/db.config.js";
import { connectToDatabase } from "../db/index.js";
import UserNotFoundError from "../errors/user-not-found.error.js";
import { QuizHistoryItem, UserQuizAnswer } from "../models/quiz-history.model.js";

class QuizHistoryService {
  postNewQuizHistory = async (data: QuizHistoryItem) => {
    const db = await connectToDatabase();
    const quizHistoryCollection = await db.collection(`${mongoDB.quizHistoryCollectionName}`);
    const userCollection = await db.collection(`${mongoDB.userCollectionName}`);

    // Added new quiz history to database
    const newHistory = await quizHistoryCollection.insertOne({
      quizId: data.quizId,
      userId: data.userId,
      answers: data.answers,
      submittedDate: new Date().toISOString().split("T")[0],
      score: data.score,
      quizStatus: data.quizStatus
    });

    // Updated user data
    const user = await userCollection.findOne({ _id: new ObjectId(data.userId) });
    if (!user) {
      throw new UserNotFoundError("User not found", 404);
    }

    // Defined quiz result data
    let quizPassed = data.quizStatus ? 1 : 0;
    let correctAnswers = data.answers.reduce((acc: number, answer: UserQuizAnswer) => {
      return answer.isCorrect ? acc + 1 : acc;
    }, 0);

    const updatedUser = await userCollection.findOneAndUpdate(
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
    const db = await connectToDatabase();
    const collection = await db.collection(`${mongoDB.quizHistoryCollectionName}`);

    const histories = await collection.find({ userId: params.id }).toArray();
    return histories;
  }
}

export default QuizHistoryService;