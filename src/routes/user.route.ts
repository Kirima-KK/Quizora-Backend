import express from 'express';
import UserController from '../controllers/user.controller.js';

const router = express.Router();
const userController = new UserController();

router.get('/api/user', (req, res, next) => {
  userController.getAllUsers(req, res, next);
});

router.get('/api/current-user', (req, res, next) => {
  userController.getCurrentUser(req, res, next);
});

router.get('/api/user/:email', (req, res, next) => {
  userController.getUserByEmail(req, res, next);
});

export default router;