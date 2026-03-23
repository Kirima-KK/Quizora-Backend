import express from 'express';
import UserController from '../controllers/user.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { roleAuth } from '../middleware/role-auth.middleware.js';

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

router.get('/api/user', verifyToken, roleAuth("ADMIN"), (req, res, next) => {
  userController.getAllUsers(req, res, next);
});

router.get('/api/user/:email', verifyToken, roleAuth("ADMIN"), (req, res, next) => {
  userController.getUserByEmail(req, res, next);
});

router.get('/api/current-user', verifyToken, (req, res, next) => {
  userController.getCurrentUser(req, res, next);
});


export default router;