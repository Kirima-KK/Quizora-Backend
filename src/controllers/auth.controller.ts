import authConfig from "../config/auth.config.js";
import { LoginInfo, RegisterInfo } from "../utils/auth.type.js";
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

  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const result: LoginInfo = {
        email: email,
        password: password
      }

      const token = await authService.login(result);

      const frontendOrigin = req.headers.origin;
      if (frontendOrigin) {
        const url = new URL(frontendOrigin);
        const frontendHostname = url.hostname

        console.log(`DEBUG:frontendOrigin: ${frontendOrigin}`);
        // Save user session token to the cookie
        res.cookie('session', token, {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
          maxAge: Number(authConfig.jwtTokenExpires),
          path: '/',
          domain: frontendHostname,
        });
      }

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