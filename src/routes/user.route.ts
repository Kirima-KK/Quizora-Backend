import express, { Request } from 'express';
import UserController from '../controllers/user.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { roleAuth } from '../middleware/role-auth.middleware.js';
import { authenticatedRateLimiter } from '../middleware/rate-limit.middleware.js';
import { UserParams } from '../interfaces/user.interface.js';

const router = express.Router();
const userController = new UserController();

/**
 * @swagger
 * /api/user:
 *   get:
 *     tags: [Users]
 *     summary: Get all users (admin only)
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Access denied (not admin)
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
router.get('/api/user', verifyToken, authenticatedRateLimiter, roleAuth("ADMIN"), (req, res, next) => {
  userController.getAllUsers(req, res, next);
});

/**
 * @swagger
 * /api/user/{email}:
 *   get:
 *     tags: [Users]
 *     summary: Get a user by email (admin only)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Access denied (not admin)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
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
router.get('/api/user/:email', verifyToken, authenticatedRateLimiter, roleAuth("ADMIN"), (req: Request<UserParams>, res, next) => {
  userController.getUserByEmail(req, res, next);
});

/**
 * @swagger
 * /api/current-user:
 *   get:
 *     tags: [Users]
 *     summary: Get the currently authenticated user
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Current user data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
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
router.get('/api/current-user', verifyToken, authenticatedRateLimiter, (req, res, next) => {
  userController.getCurrentUser(req, res, next);
});

export default router;
