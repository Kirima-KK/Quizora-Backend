import { describe, it, expect, beforeEach, vi } from "vitest";
import { ObjectId } from "mongodb";
import QuizService from "../src/services/quiz.service.js";
import Quiz from "../src/models/quiz.model.js";
import mongoDB from "../src/config/db.config.js";
import QuizNotFoundError from "../src/errors/quiz-not-found.error.js";

vi.mock("../src/models/quiz.model.js");
vi.mock("../src/config/db.config.js");

describe("QuizService", () => {
  let quizService: QuizService;
  const mockQuizId = "507f1f77bcf86cd799439011";

  beforeEach(() => {
    quizService = new QuizService();
    vi.clearAllMocks();
    (mongoDB as any).itemPerPage = "10";
  });

  describe("getAllQuiz", () => {
    const mockQuizzes = [
      {
        _id: mockQuizId,
        name: "JavaScript Basics",
        description: "Learn JavaScript fundamentals",
        image: "js.png",
        passPoint: 70,
        questions: [],
      },
      {
        _id: "507f1f77bcf86cd799439012",
        name: "TypeScript Advanced",
        description: "Advanced TypeScript concepts",
        image: "ts.png",
        passPoint: 80,
        questions: [],
      },
    ];

    it("should return paginated quizzes with correct total pages", async () => {
      vi.mocked(Quiz.countDocuments).mockResolvedValue(25);
      vi.mocked(Quiz.find).mockReturnValue({
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue(mockQuizzes),
      } as any);

      const result = await quizService.getAllQuiz(1);

      expect(result.quizes).toEqual(mockQuizzes);
      expect(result.totalPages).toBe(3); // 25 / 10 = 2.5 rounded up = 3
    });

    it("should calculate correct offset for pagination", async () => {
      vi.mocked(Quiz.countDocuments).mockResolvedValue(50);
      const mockSkip = vi.fn().mockReturnThis();
      const mockLimit = vi.fn().mockResolvedValue(mockQuizzes);

      vi.mocked(Quiz.find).mockReturnValue({
        skip: mockSkip,
        limit: mockLimit,
      } as any);

      await quizService.getAllQuiz(3); // Page 3

      expect(mockSkip).toHaveBeenCalledWith(20); // (3 - 1) * 10 = 20
      expect(mockLimit).toHaveBeenCalledWith(10);
    });

    it("should apply search filter with regex on name", async () => {
      vi.mocked(Quiz.countDocuments).mockResolvedValue(1);
      vi.mocked(Quiz.find).mockReturnValue({
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([mockQuizzes[0]]),
      } as any);

      await quizService.getAllQuiz(1, "JavaScript");

      const filterCall = vi.mocked(Quiz.find).mock.calls[0][0] as any;
      expect(filterCall?.$or[0].name.$regex).toBe("JavaScript");
      expect(filterCall?.$or[0].name.$options).toBe("i");
    });

    it("should apply case-insensitive search filter", async () => {
      vi.mocked(Quiz.countDocuments).mockResolvedValue(1);
      vi.mocked(Quiz.find).mockReturnValue({
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([mockQuizzes[0]]),
      } as any);

      await quizService.getAllQuiz(1, "javascript");

      const filterCall = vi.mocked(Quiz.find).mock.calls[0][0] as any;
      expect(filterCall.$or[0].name.$options).toBe("i");
      expect(filterCall.$or[1].description.$options).toBe("i");
    });

    it("should search in both name and description fields", async () => {
      vi.mocked(Quiz.countDocuments).mockResolvedValue(1);
      vi.mocked(Quiz.find).mockReturnValue({
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([mockQuizzes[0]]),
      } as any);

      await quizService.getAllQuiz(1, "fundamentals");

      const filterCall = vi.mocked(Quiz.find).mock.calls[0][0] as any;
      expect(filterCall.$or).toHaveLength(2);
      expect(filterCall.$or[0]).toHaveProperty("name");
      expect(filterCall.$or[1]).toHaveProperty("description");
    });

    it("should return empty filter when no query provided", async () => {
      vi.mocked(Quiz.countDocuments).mockResolvedValue(10);
      vi.mocked(Quiz.find).mockReturnValue({
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue(mockQuizzes),
      } as any);

      await quizService.getAllQuiz(1);

      const filterCall = vi.mocked(Quiz.find).mock.calls[0][0];
      expect(filterCall).toEqual({});
    });

    it("should return all items when page is 0", async () => {
      vi.mocked(Quiz.countDocuments).mockResolvedValue(100);
      const allQuizzes = Array.from({ length: 50 }, (_, i) => ({
        _id: `quiz-${i}`,
        name: `Quiz ${i}`,
        description: `Description ${i}`,
        image: "img.png",
        passPoint: 70,
        questions: [],
      }));

      const mockSkip = vi.fn().mockReturnThis();
      const mockLimit = vi.fn().mockResolvedValue(allQuizzes);

      vi.mocked(Quiz.find).mockReturnValue({
        skip: mockSkip,
        limit: mockLimit,
      } as any);

      const result = await quizService.getAllQuiz(0);

      expect(mockSkip).toHaveBeenCalledWith(0);
      expect(result.totalPages).toBe(1); // page is 0, so totalPages = 1
    });

    it("should apply limit of itemPerPage", async () => {
      vi.mocked(Quiz.countDocuments).mockResolvedValue(50);
      const mockLimit = vi.fn().mockResolvedValue(mockQuizzes);

      vi.mocked(Quiz.find).mockReturnValue({
        skip: vi.fn().mockReturnThis(),
        limit: mockLimit,
      } as any);

      await quizService.getAllQuiz(1);

      expect(mockLimit).toHaveBeenCalledWith(10);
    });

    it("should throw QuizNotFoundError when quizzes array is null", async () => {
      vi.mocked(Quiz.countDocuments).mockResolvedValue(0);
      vi.mocked(Quiz.find).mockReturnValue({
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue(null),
      } as any);

      await expect(quizService.getAllQuiz(1)).rejects.toThrow(
        QuizNotFoundError
      );
      await expect(quizService.getAllQuiz(1)).rejects.toThrow(
        "Quizes not found."
      );
    });

    it("should handle multiple search terms in query", async () => {
      vi.mocked(Quiz.countDocuments).mockResolvedValue(1);
      vi.mocked(Quiz.find).mockReturnValue({
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([mockQuizzes[0]]),
      } as any);

      await quizService.getAllQuiz(1, "JavaScript Basics");

      const filterCall = vi.mocked(Quiz.find).mock.calls[0][0] as any;
      expect(filterCall.$or[0].name.$regex).toBe("JavaScript Basics");
    });

    it("should calculate correct total pages for exact division", async () => {
      vi.mocked(Quiz.countDocuments).mockResolvedValue(30);
      vi.mocked(Quiz.find).mockReturnValue({
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue(mockQuizzes),
      } as any);

      const result = await quizService.getAllQuiz(1);

      expect(result.totalPages).toBe(3); // 30 / 10 = 3
    });

    it("should calculate correct total pages with remainder", async () => {
      vi.mocked(Quiz.countDocuments).mockResolvedValue(25);
      vi.mocked(Quiz.find).mockReturnValue({
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue(mockQuizzes),
      } as any);

      const result = await quizService.getAllQuiz(1);

      expect(result.totalPages).toBe(3); // 25 / 10 = 2.5 rounded up
    });

    it("should handle single quiz result", async () => {
      vi.mocked(Quiz.countDocuments).mockResolvedValue(1);
      vi.mocked(Quiz.find).mockReturnValue({
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([mockQuizzes[0]]),
      } as any);

      const result = await quizService.getAllQuiz(1);

      expect(result.quizes).toHaveLength(1);
      expect(result.totalPages).toBe(1);
    });

    it("should use correct itemPerPage from mongoDB config", async () => {
      (mongoDB as any).itemPerPage = "5";
      vi.mocked(Quiz.countDocuments).mockResolvedValue(20);
      const mockLimit = vi.fn().mockResolvedValue(mockQuizzes);

      vi.mocked(Quiz.find).mockReturnValue({
        skip: vi.fn().mockReturnThis(),
        limit: mockLimit,
      } as any);

      const result = await quizService.getAllQuiz(1);

      expect(mockLimit).toHaveBeenCalledWith(5);
      expect(result.totalPages).toBe(4); // 20 / 5 = 4
    });

    it("should call countDocuments with correct filter", async () => {
      vi.mocked(Quiz.countDocuments).mockResolvedValue(5);
      vi.mocked(Quiz.find).mockReturnValue({
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue(mockQuizzes),
      } as any);

      await quizService.getAllQuiz(1, "TypeScript");

      expect(Quiz.countDocuments).toHaveBeenCalledWith({
        $or: [
          { name: { $regex: "TypeScript", $options: "i" } },
          { description: { $regex: "TypeScript", $options: "i" } },
        ],
      });
    });
  });

  describe("getQuizById", () => {
    const mockQuiz = {
      _id: new ObjectId(mockQuizId),
      name: "JavaScript Basics",
      description: "Learn JavaScript fundamentals",
      image: "js.png",
      passPoint: 70,
      questions: [
        {
          id: 1,
          question: "What is a variable?",
          choices: [
            { id: 1, choice: "A storage location" },
            { id: 2, choice: "A function" },
          ],
        },
      ],
    };

    it("should return quiz when found by valid ObjectId", async () => {
      vi.mocked(Quiz.findOne).mockResolvedValue(mockQuiz as any);

      const result = await quizService.getQuizById({ id: mockQuizId });

      expect(result).toEqual(mockQuiz);
    });

    it("should convert string id to ObjectId", async () => {
      vi.mocked(Quiz.findOne).mockResolvedValue(mockQuiz as any);

      await quizService.getQuizById({ id: mockQuizId });

      expect(Quiz.findOne).toHaveBeenCalledWith({
        _id: expect.any(ObjectId),
      });
    });

    it("should throw QuizNotFoundError when quiz not found", async () => {
      vi.mocked(Quiz.findOne).mockResolvedValue(null);

      await expect(
        quizService.getQuizById({ id: mockQuizId })
      ).rejects.toThrow(QuizNotFoundError);
      await expect(
        quizService.getQuizById({ id: mockQuizId })
      ).rejects.toThrow("Quizes not found.");
    });

    it("should throw QuizNotFoundError with 404 status code", async () => {
      vi.mocked(Quiz.findOne).mockResolvedValue(null);

      try {
        await quizService.getQuizById({ id: mockQuizId });
      } catch (error: any) {
        expect(error.statusCode).toBe(404);
      }
    });

    it("should query by correct _id field", async () => {
      vi.mocked(Quiz.findOne).mockResolvedValue(mockQuiz as any);

      await quizService.getQuizById({ id: mockQuizId });

      const queryCall = vi.mocked(Quiz.findOne).mock.calls[0][0];
      expect(queryCall).toHaveProperty("_id");
    });

    it("should return quiz with all fields", async () => {
      vi.mocked(Quiz.findOne).mockResolvedValue(mockQuiz as any);

      const result = await quizService.getQuizById({ id: mockQuizId });

      expect(result).toHaveProperty("_id");
      expect(result).toHaveProperty("name");
      expect(result).toHaveProperty("description");
      expect(result).toHaveProperty("image");
      expect(result).toHaveProperty("passPoint");
      expect(result).toHaveProperty("questions");
    });

    it("should return quiz with nested questions and choices", async () => {
      vi.mocked(Quiz.findOne).mockResolvedValue(mockQuiz as any);

      const result = await quizService.getQuizById({ id: mockQuizId });

      expect(result.questions).toHaveLength(1);
      expect(result.questions[0].choices).toBeDefined();
      expect(result.questions[0].choices).toHaveLength(2);
    });

    it("should handle different valid ObjectIds", async () => {
      const differentId = "507f1f77bcf86cd799439099";
      const differentQuiz = { ...mockQuiz, _id: new ObjectId(differentId) };

      vi.mocked(Quiz.findOne).mockResolvedValue(differentQuiz as any);

      const result = await quizService.getQuizById({ id: differentId });

      expect(result._id.toString()).toBe(differentId);
    });

    it("should handle quiz with no questions", async () => {
      const quizNoQuestions = { ...mockQuiz, questions: [] };
      vi.mocked(Quiz.findOne).mockResolvedValue(quizNoQuestions as any);

      const result = await quizService.getQuizById({ id: mockQuizId });

      expect(result.questions).toEqual([]);
    });

    it("should handle quiz with multiple questions", async () => {
      const quizMultipleQuestions = {
        ...mockQuiz,
        questions: [
          { id: 1, question: "Question 1?", choices: [] },
          { id: 2, question: "Question 2?", choices: [] },
          { id: 3, question: "Question 3?", choices: [] },
        ],
      };

      vi.mocked(Quiz.findOne).mockResolvedValue(quizMultipleQuestions as any);

      const result = await quizService.getQuizById({ id: mockQuizId });

      expect(result.questions).toHaveLength(3);
    });
  });
});