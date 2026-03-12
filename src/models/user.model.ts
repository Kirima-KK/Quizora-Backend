import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  image: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
  },
  correctAnswers: {
    type: Number,
  },
  quizPassed: {
    type: Number,
  },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'user'],
  },
}, {
  timestamps: true,
});

const User = mongoose.model("User", userSchema);
export default User;