import authConfig from "../config/auth.config.js";
import { LoginInfo, RegisterInfo } from "../models/auth.model.js";
import AuthService from "../services/auth.service.js";

const authService = new AuthService();

class AuthController {
  register = async (req, res, next) => {
    try {
      const result: RegisterInfo = {
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      };

      if (!result.email || !result.password) return res.status(400).json({ message: "Bad Request" });

      const token = await authService.register(result);

      return res.status(200).json({
        message: `${result.email} Register Success`
      });
    } catch (err) {
      next(err);
    }
  }

  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const result: LoginInfo = {
        email: email,
        password: password
      }

      const token = await authService.login(result);

      res.cookie('session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax', // Prevent CSRF attacks
        maxAge: Number(authConfig.jwtTokenExpires),
        path: '/'
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

  logout = async (req, res, next) => {
    res.cookie('session', '', { expires: new Date(0) });
    return res.status(204).send();
  }
}

export default AuthController;