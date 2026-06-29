import express, { Request } from 'express';
import UserController from '../controllers/user.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { roleAuth } from '../middleware/role-auth.middleware.js';
import { authenticatedRateLimiter } from '../middleware/rate-limit.middleware.js';
import { UserParams } from '../interfaces/user.interface.js';

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Returns a list of users
 *     responses:
 *       200:
 *         description: A list of users.
 */

const router = express.Router();
const userController = new UserController();

router.get('/api/user', verifyToken, authenticatedRateLimiter, roleAuth("ADMIN"), (req, res, next) => {
  userController.getAllUsers(req, res, next);
});

router.get('/api/user/:email', verifyToken, authenticatedRateLimiter, roleAuth("ADMIN"), (req: Request<UserParams>, res, next) => {
  userController.getUserByEmail(req, res, next);
});

router.get('/api/current-user', verifyToken, authenticatedRateLimiter, (req, res, next) => {
  userController.getCurrentUser(req, res, next);
});

export default router;
