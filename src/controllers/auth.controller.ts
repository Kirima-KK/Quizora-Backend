import authConfig from "../config/auth.config.js";
import AuthService from "../services/auth.service.js";

const authService = new AuthService();

class AuthController {
  login = async (req, res, next) => {
    const { email, password } = req.body;

    const token = await authService.login(email, password);
    if (!token) return res.status(401).json({ message: "Invalid credentials" });

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
  }
}

export default AuthController;