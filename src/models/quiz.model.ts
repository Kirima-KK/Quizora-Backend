import mongoose from "mongoose";

const choiceSchema = new mongoose.Schema({
  id: {
    type: Number,
  },
  choice: {
    type: String,
  },
});

const questionSchema = new mongoose.Schema({
  id: {
    type: Number,
  },
  question: {
    type: String,
  },
  choices: {
    type: [choiceSchema],
  },
});
const quizSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
  },
  passPoint: {
    type: Number,
  },
  questions: {
    type: [questionSchema],
  }
});

const Quiz = mongoose.model("Quiz", quizSchema, "quizes");
export default Quiz;