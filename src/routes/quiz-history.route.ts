import express, { Request } from 'express';
import QuizHistoryController from '../controllers/quiz-history.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { authenticatedRateLimiter } from '../middleware/rate-limit.middleware.js';
import { QuizParams } from '../interfaces/quiz.interface.js';

const router = express.Router();
const quizHistoryController = new QuizHistoryController();

/**
 * @swagger
 * /api/quiz-history:
 *   post:
 *     tags: [Quiz History]
 *     summary: Submit a new quiz history entry
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QuizHistoryRequest'
 *     responses:
 *       200:
 *         description: Quiz history saved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Save new quiz history success."
 *                 data:
 *                   $ref: '#/components/schemas/QuizHistory'
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
router.post('/api/quiz-history', verifyToken, authenticatedRateLimiter, (req, res, next) => {
  quizHistoryController.postNewQuizHistory(req, res, next);
});

/**
 * @swagger
 * /api/quiz-history/{id}:
 *   get:
 *     tags: [Quiz History]
 *     summary: Get quiz history by user ID (paginated)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Paginated quiz history
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedQuizHistory'
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
router.get('/api/quiz-history/:id', verifyToken, authenticatedRateLimiter, (req:Request<QuizParams>, res, next) => {
  quizHistoryController.getQuizHistoryByUserId(req, res, next);
})

export default router;
