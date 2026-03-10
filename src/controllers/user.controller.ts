import UserService from "../services/user.service.js";

const userService = new UserService();

class UserController {
  getAllUsers = async (req, res, next) => {
    try {
      const users = await userService.getAllUsers();

      return res.status(200).json(users);
    }
    catch (err) {
      return next(err);
    }
  }

  getUserByEmail = async (req, res, next) => {
    try {
      const email = req.params.email;

      const user = await userService.getUserByEmail(email);

      return res.status(200).json(user);
    }
    catch (err) {
      return next(err);
    }
  }

  getCurrentUser = async (req, res, next) => {
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