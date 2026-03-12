import express from 'express';
import AuthController from '../controllers/auth.controller.js';

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login user
 *     description: Authenticate user and return JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Login successful
 *       500:
 *          description: Something went wrong
 */

const router = express.Router();
const authController = new AuthController();

router.post('/api/register', (req, res, next) => {
  authController.register(req, res, next)
});

router.post('/api/login', (req, res, next) => {
  authController.login(req, res, next);
});

router.post('/api/logout', (req, res, next) => {
  authController.logout(req, res, next);
});

export default router;