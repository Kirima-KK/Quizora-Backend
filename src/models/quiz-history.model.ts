export interface UserQuizAnswer {
  id: number;
  choice: number;
  isCorrect: boolean;
}

export interface QuizHistoryItem {
  quizId: string;
  userId: string;
  answers: UserQuizAnswer[];
  submittedDate: string;
  score: number;
  quizStatus: boolean;
}