import express, { Request } from "express";
import QuizController from "../controllers/quiz.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { authenticatedRateLimiter } from "../middleware/rate-limit.middleware.js";
import { QuizParams } from "../interfaces/quiz.interface.js";

const router = express.Router();
const quizController = new QuizController();

/**
 * @swagger
 * /api/quiz:
 *   get:
 *     tags: [Quizzes]
 *     summary: Get all quizzes (paginated)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         description: Page number
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Search by name or description
 *     responses:
 *       200:
 *         description: Paginated quiz list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedQuizzes'
 *       401:
 *         description: Unauthenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       429:
 *         description: Rate limit exceeded
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/api/quiz', verifyToken, authenticatedRateLimiter, (req, res, next) => {
  quizController.getAllQuiz(req, res, next);
});

/**
 * @swagger
 * /api/quiz/{id}:
 *   get:
 *     tags: [Quizzes]
 *     summary: Get a quiz by ID
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Quiz ID
 *     responses:
 *       200:
 *         description: Quiz found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quiz'
 *       401:
 *         description: Unauthenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Quiz not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       429:
 *         description: Rate limit exceeded
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/api/quiz/:id', verifyToken, authenticatedRateLimiter, (req: Request<QuizParams>, res, next) => {
  quizController.getQuizById(req, res, next);
})

export default router;
