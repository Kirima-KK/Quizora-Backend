import express from 'express';
import UserController from '../controllers/user.controller.js';

const router = express.Router();
const userController = new UserController();

router.get('/user', (req, res, next) => {
  userController.getAllUsers(req, res, next);
});

router.get('/user/:email', (req, res, next) => {
  userController.getUserByEmail(req, res, next);
});

export default router;