import express from 'express';
import AuthController from '../controllers/auth.controller.js';
import { publicRateLimiter } from '../middleware/rate-limit.middleware.js';

const router = express.Router();
const authController = new AuthController();

/**
 * @swagger
 * /api/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       200:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "user@example.com Register Success"
 *       400:
 *         description: User already exists or bad request
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
router.post('/api/register', publicRateLimiter, (req, res, next) => {
  authController.register(req, res, next)
});

/**
 * @swagger
 * /api/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login and create a session
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful (sets sessionToken and sessionId cookies)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *                 user:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *       401:
 *         description: Invalid credentials
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
router.post('/api/login', publicRateLimiter, (req, res, next) => {
  authController.login(req, res, next);
});

/**
 * @swagger
 * /api/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout and destroy session
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       204:
 *         description: Logged out successfully
 *       429:
 *         description: Rate limit exceeded
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/api/logout', publicRateLimiter, (req, res, next) => {
  authController.logout(req, res, next);
});

export default router;
