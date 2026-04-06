import { UserParams } from "../interfaces/user.interface.js";
import UserService from "../services/user.service.js";
import { Request, Response, NextFunction } from "express";

const userService = new UserService();

class UserController {
  getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await userService.getAllUsers();

      return res.status(200).json(users);
    }
    catch (err) {
      return next(err);
    }
  }

  getUserByEmail = async (req: Request<UserParams>, res: Response, next: NextFunction) => {
    try {
      const email = req.params.email;

      const user = await userService.getUserByEmail(email);

      return res.status(200).json(user);
    }
    catch (err) {
      return next(err);
    }
  }

  getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get current user from the cookie
      const session = req.cookies.session;
      const user = await userService.getCurrentUser(session);
      return res.status(200).json(user);
    } catch (err) {
      return next(err);
    }
  }
}

export default UserController;