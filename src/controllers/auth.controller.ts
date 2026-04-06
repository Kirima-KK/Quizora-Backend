import authConfig from "../config/auth.config.js";
import { LoginInfo, RegisterInfo } from "../interfaces/auth.interface.js";
import AuthService from "../services/auth.service.js";
import { Request, Response, NextFunction } from "express";
const authService = new AuthService();

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

      const token = await authService.login(result);

      // Save user session token to the cookie
      res.cookie('session', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: Number(authConfig.jwtTokenExpires),
        path: '/',
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
    // Remove user session token from the cookie
    res.cookie('session', '', {
      expires: new Date(0),
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    });
    return res.status(204).send();
  }
}

export default AuthController;