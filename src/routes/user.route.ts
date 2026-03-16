import express from 'express';
import UserController from '../controllers/user.controller.js';

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

router.get('/api/user', (req, res, next) => {
  userController.getAllUsers(req, res, next);
});

router.get('/api/user/:email', (req, res, next) => {
  userController.getUserByEmail(req, res, next);
});

router.get('/api/current-user', (req, res, next) => {
  userController.getCurrentUser(req, res, next);
});


export default router;