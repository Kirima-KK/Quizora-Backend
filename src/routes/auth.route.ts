import express from 'express';
import AuthController from '../controllers/auth.controller.js';
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