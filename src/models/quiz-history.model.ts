import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  id: {
    type: Number,
  },
  choice: {
    type: Number,
  },
  isCorrect: {
    type: Boolean,
  }
});

const quizHistorySchema = new mongoose.Schema({
  quizId: {
    type: String,
  },
  userId: {
    type: String,
  },
  answers: {
    type: [answerSchema],
  },
  submittedDate: {
    type: Date,
  },
  score: {
    type: Number,
  },
  quizStatus: {
    type: Boolean,
  },
});

const QuizHistory = mongoose.model("QuizHistory", quizHistorySchema, "quiz-history");
export default QuizHistory;