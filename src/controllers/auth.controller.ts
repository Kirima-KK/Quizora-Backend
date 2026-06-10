import { LoginInfo, RegisterInfo } from "../interfaces/auth.interface.js";
import AuthService from "../services/auth.service.js";
import UserService from "../services/user.service.js";
import { createSession, destroySession } from "../services/session.service.js";
import { Request, Response, NextFunction, CookieOptions } from "express";
import authConfig from "../config/auth.config.js";
const authService = new AuthService();
const userService = new UserService();

class AuthController {
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result: RegisterInfo = {
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        role: req.body.role,
      };

      // Registered info validation
      if (!result.email || !result.password) return res.status(400).json({ message: "Bad Request" });

      const token = await authService.register(result);

      return res.status(200).json({
        message: `${result.email} Register Success`
      });
    } catch (err) {
      next(err);
    }
  }

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const result: LoginInfo = {
        email: email,
        password: password
      }

      // Authenticate user
      const token = await authService.login(result);

      // Get user data for session creation
      const user = await userService.getUserByEmail(email);

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Create Redis session
      const sessionId = await createSession(user._id.toString(), user.role);

      if (!sessionId) {
        return res.status(500).json({ message: "Failed to create session" });
      }

      const cookieOptions: CookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
      };

      // Store JWT in 'sessionToken' cookie
      res.cookie('sessionToken', token, {
        ...cookieOptions,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      });

      // Store Redis ID in 'sessionId' cookie
      res.cookie('sessionId', sessionId, {
        ...cookieOptions,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      });

      return res.status(200).json({
        message: "Login successful",
        user: {
          email: email
        }
      });
    } catch (err) {
      next(err);
    }
  }

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionId = req.cookies.sessionId;

      if (sessionId) await destroySession(sessionId);

      const clearOptions: CookieOptions = {
        expires: new Date(0),
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
      };

      res.cookie('sessionToken', '', clearOptions);
      res.cookie('sessionId', '', clearOptions);

      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

export default AuthController;