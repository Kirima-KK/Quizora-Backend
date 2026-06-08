import { describe, it, expect, beforeEach, vi } from "vitest";
import { ObjectId } from "mongodb";
import QuizHistoryService from "../src/services/quiz-history.service.js";
import QuizHistory from "../src/models/quiz-history.model.js";
import User from "../src/models/user.model.js";
import mongoDB from "../src/config/db.config.js";
import UserNotFoundError from "../src/errors/user-not-found.error.js";
import { QuizHistoryItem } from "../src/utils/quiz-history.type.js";

vi.mock("../src/models/quiz-history.model.js");

vi.mock("../src/models/user.model.js", () => {
  const MockUserClass = vi.fn().mockImplementation(function (data) {
    return {
      ...data,
      _id: "6a265e47843abfcf17bc8d9b",
      createdAt: new Date(),
      save: vi.fn().mockResolvedValue({}),
    };
  });

  (MockUserClass as any).findOne = vi.fn();
  (MockUserClass as any).findOneAndUpdate = vi.fn();

  return {
    default: MockUserClass
  };
});

vi.mock("../src/config/db.config.js");

describe("QuizHistoryService", () => {
  let quizHistoryService: QuizHistoryService;
  const mockUserId = "507f1f77bcf86cd799439011";
  const mockQuizId = "507f1f77bcf86cd799439012";

  beforeEach(() => {
    quizHistoryService = new QuizHistoryService();
    vi.clearAllMocks();
    (mongoDB as any).itemPerPage = "10";
  });

  describe("postNewQuizHistory", () => {
    const quizHistoryData: QuizHistoryItem = {
      quizId: mockQuizId,
      userId: mockUserId,
      answers: [
        { id: 1, choice: 1, isCorrect: true },
        { id: 2, choice: 2, isCorrect: true },
        { id: 3, choice: 3, isCorrect: false },
        { id: 4, choice: 4, isCorrect: true },
      ],
      submittedDate: new Date().toISOString().split("T")[0],
      score: 75,
      quizStatus: true,
    };

    it("should create new quiz history and save to database", async () => {
      const mockSave = vi.fn().mockResolvedValue({});
      const mockQuizHistoryInstance = { save: mockSave };

      vi.mocked(QuizHistory).mockImplementation(function () {
        return mockQuizHistoryInstance as any;
      });

      vi.mocked(User.findOne).mockResolvedValue({ _id: mockUserId } as any);
      vi.mocked(User.findOneAndUpdate).mockResolvedValue({
        _id: mockUserId,
        quizPassed: 1,
        correctAnswers: 3,
      } as any);

      await quizHistoryService.postNewQuizHistory(quizHistoryData);

      expect(QuizHistory).toHaveBeenCalledWith({
        quizId: mockQuizId,
        userId: mockUserId,
        answers: quizHistoryData.answers,
        submittedDate: quizHistoryData.submittedDate,
        score: 75,
        quizStatus: true,
      });
      expect(mockSave).toHaveBeenCalled();
    });

    it("should throw UserNotFoundError when user does not exist", async () => {
      const mockSave = vi.fn().mockResolvedValue({});
      const mockQuizHistoryInstance = { save: mockSave };

      vi.mocked(QuizHistory).mockImplementation(function () {
        return mockQuizHistoryInstance as any;
      });

      vi.mocked(User.findOne).mockResolvedValue(null);

      await expect(
        quizHistoryService.postNewQuizHistory(quizHistoryData)
      ).rejects.toThrow(UserNotFoundError);
      await expect(
        quizHistoryService.postNewQuizHistory(quizHistoryData)
      ).rejects.toThrow("User not found");
    });

    it("should correctly count correct answers", async () => {
      const mockSave = vi.fn().mockResolvedValue({});
      const mockQuizHistoryInstance = { save: mockSave };

      vi.mocked(QuizHistory).mockImplementation(function () {
        return mockQuizHistoryInstance as any;
      });
      vi.mocked(User.findOne).mockResolvedValue({ _id: mockUserId } as any);
      vi.mocked(User.findOneAndUpdate).mockResolvedValue({
        _id: mockUserId,
      } as any);

      await quizHistoryService.postNewQuizHistory(quizHistoryData);

      expect(User.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: expect.any(ObjectId) },
        {
          $inc: {
            quizPassed: 1,
            correctAnswers: 3,
          },
        },
        { returnDocument: "after" }
      );
    });

    it("should increment quizPassed by 1 when quiz status is true", async () => {
      const mockSave = vi.fn().mockResolvedValue({});
      const mockQuizHistoryInstance = { save: mockSave };

      vi.mocked(QuizHistory).mockImplementation(function () {
        return mockQuizHistoryInstance as any;
      });

      vi.mocked(User.findOne).mockResolvedValue({ _id: mockUserId } as any);
      vi.mocked(User.findOneAndUpdate).mockResolvedValue({
        _id: mockUserId,
        quizPassed: 5,
      } as any);

      await quizHistoryService.postNewQuizHistory(quizHistoryData);

      const updateCall = vi.mocked(User.findOneAndUpdate).mock.calls[0];
      expect(updateCall?.[1]?.$inc?.quizPassed).toBe(1);
    });

    it("should not increment quizPassed when quiz status is false", async () => {
      const failedQuizData = {
        ...quizHistoryData,
        quizStatus: false,
      };

      const mockSave = vi.fn().mockResolvedValue({});
      const mockQuizHistoryInstance = { save: mockSave };

      vi.mocked(QuizHistory).mockImplementation(function () {
        return mockQuizHistoryInstance as any;
      });
      vi.mocked(User.findOne).mockResolvedValue({ _id: mockUserId } as any);
      vi.mocked(User.findOneAndUpdate).mockResolvedValue({
        _id: mockUserId,
        quizPassed: 5,
      } as any);

      await quizHistoryService.postNewQuizHistory(failedQuizData);

      const updateCall = vi.mocked(User.findOneAndUpdate).mock.calls[0];
      expect(updateCall[1]?.$inc?.quizPassed).toBe(0);
    });

    it("should handle quiz history with all correct answers", async () => {
      const allCorrectData = {
        ...quizHistoryData,
        answers: [
          { id: 1, choice: 1, isCorrect: true },
          { id: 2, choice: 2, isCorrect: true },
          { id: 3, choice: 3, isCorrect: true },
          { id: 4, choice: 4, isCorrect: true },
        ],
      };

      const mockSave = vi.fn().mockResolvedValue({});
      const mockQuizHistoryInstance = { save: mockSave };

      vi.mocked(QuizHistory).mockImplementation(function () {
        return mockQuizHistoryInstance as any;
      });
      vi.mocked(User.findOne).mockResolvedValue({ _id: mockUserId } as any);
      vi.mocked(User.findOneAndUpdate).mockResolvedValue({
        _id: mockUserId,
        correctAnswers: 4,
      } as any);

      await quizHistoryService.postNewQuizHistory(allCorrectData);

      const updateCall = vi.mocked(User.findOneAndUpdate).mock.calls[0];
      expect(updateCall[1]?.$inc?.correctAnswers).toBe(4);
    });

    it("should handle quiz history with no correct answers", async () => {
      const noCorrectData = {
        ...quizHistoryData,
        answers: [
          { id: 1, choice: 1, isCorrect: false },
          { id: 2, choice: 2, isCorrect: false },
          { id: 3, choice: 3, isCorrect: false },
        ],
      };

      const mockSave = vi.fn().mockResolvedValue({});
      const mockQuizHistoryInstance = { save: mockSave };

      vi.mocked(QuizHistory).mockImplementation(function () {
        return mockQuizHistoryInstance as any;
      });
      vi.mocked(User.findOne).mockResolvedValue({ _id: mockUserId } as any);
      vi.mocked(User.findOneAndUpdate).mockResolvedValue({
        _id: mockUserId,
        correctAnswers: 0,
      } as any);

      await quizHistoryService.postNewQuizHistory(noCorrectData);

      const updateCall = vi.mocked(User.findOneAndUpdate).mock.calls[0];
      expect(updateCall[1]?.$inc?.correctAnswers).toBe(0);
    });

    it("should format submitted date correctly (YYYY-MM-DD)", async () => {
      const mockSave = vi.fn().mockResolvedValue({});
      const mockQuizHistoryInstance = { save: mockSave };

      vi.mocked(QuizHistory).mockImplementation(function () {
        return mockQuizHistoryInstance as any;
      });
      vi.mocked(User.findOne).mockResolvedValue({ _id: mockUserId } as any);
      vi.mocked(User.findOneAndUpdate).mockResolvedValue({
        _id: mockUserId,
      } as any);

      await quizHistoryService.postNewQuizHistory(quizHistoryData);

      const constructorCall = vi.mocked(QuizHistory).mock.calls[0][0] as any;
      expect(constructorCall.submittedDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it("should return saved quiz history document", async () => {
      const savedHistory = {
        quizId: mockQuizId,
        userId: mockUserId,
        answers: quizHistoryData.answers,
        score: 75,
        quizStatus: true,
        submittedDate: new Date().toISOString().split("T")[0], // Matches the real-time date logic in your function
      };

      const mockSave = vi.fn().mockResolvedValue({ _id: "history-123", ...savedHistory });
      const mockQuizHistoryInstance = {
        ...savedHistory,
        save: mockSave
      };

      vi.mocked(QuizHistory).mockImplementation(function () {
        return mockQuizHistoryInstance as any;
      });
      vi.mocked(User.findOne).mockResolvedValue({ _id: mockUserId } as any);
      vi.mocked(User.findOneAndUpdate).mockResolvedValue({
        _id: mockUserId,
      } as any);

      const result = await quizHistoryService.postNewQuizHistory(quizHistoryData);

      expect(result).toEqual(mockQuizHistoryInstance);
    });

    it("should update user with correct ObjectId", async () => {
      const mockSave = vi.fn().mockResolvedValue({});
      const mockQuizHistoryInstance = { save: mockSave };

      vi.mocked(QuizHistory).mockImplementation(function () {
        return mockQuizHistoryInstance as any;
      });
      vi.mocked(User.findOne).mockResolvedValue({ _id: mockUserId } as any);
      vi.mocked(User.findOneAndUpdate).mockResolvedValue({
        _id: mockUserId,
      } as any);

      await quizHistoryService.postNewQuizHistory(quizHistoryData);

      expect(User.findOne).toHaveBeenCalledWith({
        _id: expect.any(ObjectId),
      });
      expect(User.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: expect.any(ObjectId) },
        expect.any(Object),
        expect.any(Object)
      );
    });

    it("should use returnDocument: 'after' option in findOneAndUpdate", async () => {
      const mockSave = vi.fn().mockResolvedValue({});
      const mockQuizHistoryInstance = { save: mockSave };

      vi.mocked(QuizHistory).mockImplementation(function () {
        return mockQuizHistoryInstance as any;
      });
      vi.mocked(User.findOne).mockResolvedValue({ _id: mockUserId } as any);
      vi.mocked(User.findOneAndUpdate).mockResolvedValue({
        _id: mockUserId,
      } as any);

      await quizHistoryService.postNewQuizHistory(quizHistoryData);

      const updateCall = vi.mocked(User.findOneAndUpdate).mock.calls[0];
      expect(updateCall[2]).toEqual({ returnDocument: "after" });
    });

    it("should handle empty answers array", async () => {
      const emptyAnswersData = {
        ...quizHistoryData,
        answers: [],
      };

      const mockSave = vi.fn().mockResolvedValue({});
      const mockQuizHistoryInstance = { save: mockSave };

      vi.mocked(QuizHistory).mockImplementation(function () {
        return mockQuizHistoryInstance as any;
      });
      vi.mocked(User.findOne).mockResolvedValue({ _id: mockUserId } as any);
      vi.mocked(User.findOneAndUpdate).mockResolvedValue({
        _id: mockUserId,
        correctAnswers: 0,
      } as any);

      await quizHistoryService.postNewQuizHistory(emptyAnswersData);

      const updateCall = vi.mocked(User.findOneAndUpdate).mock.calls[0];
      expect(updateCall[1]?.$inc?.correctAnswers).toBe(0);
    });
  });

  describe("getQuizHistoryByUserId", () => {
    it("should return quiz histories for a user", async () => {
      const mockHistories = [
        {
          _id: "history-1",
          quizId: "quiz-1",
          userId: mockUserId,
          score: 80,
        },
        {
          _id: "history-2",
          quizId: "quiz-2",
          userId: mockUserId,
          score: 90,
        },
      ];

      vi.mocked(QuizHistory.find).mockResolvedValue(mockHistories as any);

      const result = await quizHistoryService.getQuizHistoryByUserId({ id: mockUserId });

      expect(QuizHistory.find).toHaveBeenCalledWith({ userId: mockUserId });
      expect(result.quizHistory).toEqual(mockHistories);
    });

    it("should calculate total pages correctly", async () => {
      const mockHistories = Array.from({ length: 25 }, (_, i) => ({
        _id: `history-${i}`,
        quizId: `quiz-${i}`,
        userId: mockUserId,
        score: 80,
      }));

      vi.mocked(QuizHistory.find).mockResolvedValue(mockHistories as any);

      const result = await quizHistoryService.getQuizHistoryByUserId({ id: mockUserId });

      expect(result.totalPages).toBe(3); // 25 unique quizzes / 10 per page = 2.5 rounded up = 3
    });

    it("should remove duplicate quiz IDs when calculating total pages", async () => {
      const mockHistories = [
        { _id: "history-1", quizId: "quiz-1", userId: mockUserId, score: 80 },
        { _id: "history-2", quizId: "quiz-1", userId: mockUserId, score: 85 },
        { _id: "history-3", quizId: "quiz-2", userId: mockUserId, score: 90 },
        { _id: "history-4", quizId: "quiz-2", userId: mockUserId, score: 92 },
      ];

      vi.mocked(QuizHistory.find).mockResolvedValue(mockHistories as any);

      const result = await quizHistoryService.getQuizHistoryByUserId({ id: mockUserId });

      expect(result.totalPages).toBe(1); // 2 unique quizzes / 10 per page = 1
    });

    it("should handle empty quiz history", async () => {
      vi.mocked(QuizHistory.find).mockResolvedValue([] as any);

      const result = await quizHistoryService.getQuizHistoryByUserId({ id: mockUserId });

      expect(result.quizHistory).toEqual([]);
      expect(result.totalPages).toBe(0);
    });

    it("should use itemPerPage from mongoDB config", async () => {
      (mongoDB as any).itemPerPage = "5";

      const mockHistories = Array.from({ length: 20 }, (_, i) => ({
        _id: `history-${i}`,
        quizId: `quiz-${i}`,
        userId: mockUserId,
        score: 80,
      }));

      vi.mocked(QuizHistory.find).mockResolvedValue(mockHistories as any);

      const result = await quizHistoryService.getQuizHistoryByUserId({ id: mockUserId });

      expect(result.totalPages).toBe(4); // 20 unique quizzes / 5 per page = 4
    });

    it("should handle single quiz history entry", async () => {
      const mockHistories = [
        {
          _id: "history-1",
          quizId: "quiz-1",
          userId: mockUserId,
          score: 80,
        },
      ];

      vi.mocked(QuizHistory.find).mockResolvedValue(mockHistories as any);

      const result = await quizHistoryService.getQuizHistoryByUserId({ id: mockUserId });

      expect(result.quizHistory).toHaveLength(1);
      expect(result.totalPages).toBe(1);
    });

    it("should correctly identify unique quiz IDs with multiple attempts", async () => {
      const mockHistories = [
        { _id: "h1", quizId: "q1", userId: mockUserId, score: 70 },
        { _id: "h2", quizId: "q1", userId: mockUserId, score: 75 },
        { _id: "h3", quizId: "q1", userId: mockUserId, score: 80 },
        { _id: "h4", quizId: "q2", userId: mockUserId, score: 85 },
      ];

      vi.mocked(QuizHistory.find).mockResolvedValue(mockHistories as any);

      const result = await quizHistoryService.getQuizHistoryByUserId({ id: mockUserId });

      expect(result.totalPages).toBe(1); // 2 unique quizzes / 10 per page = 1
    });
  });
});