import bcrypt from 'bcrypt';
import authConfig from "../config/auth.config.js";
import jwt from 'jsonwebtoken';
import { LoginInfo, RegisterInfo } from "../utils/auth.type.js";
import InvalidCredentialError from "../errors/invalid-credential.error.js";
import UserAlreadyExistError from "../errors/user-already-exist.error.js";
import User from "../models/user.model.js";

class AuthService {
  register = async (addedUser: RegisterInfo) => {
    // Check for user existence
    const user = await User.findOne({ email: addedUser.email });
    if (user) {
      throw new UserAlreadyExistError("User already exist.", 400);
    }

    // Encrypt thye password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(addedUser.password.toString(), salt);

    // Added new user to the database
    const newUser = new User({
      email: addedUser.email,
      firstName: addedUser.firstName,
      lastName: addedUser.lastName,
      role: addedUser.role,
      password: hash,
      createdAt: new Date()
    });

    await newUser.save();

    // Signed JWT token
    const payload = {
      user: {
        id: newUser._id,
        role: newUser.role,
      }
    };

    const secret = authConfig.jwtSecret;
    const options = { expiresIn: Number(authConfig.jwtTokenExpires) };

    const token = jwt.sign(payload, secret, options);
    if (!token) throw new InvalidCredentialError("Invalid Credentials.", 401);

    return token
  }

  login = async (currentUser: LoginInfo) => {
    // Check for user existence
    const user = await User.findOne({ email: currentUser.email });
    if (!user) throw new InvalidCredentialError("Invalid Credentials.", 401);

    const result = await bcrypt.compare(currentUser.password, user.password);
    if (!result) {
      throw new InvalidCredentialError("Invalid Credentials.", 401);
    }

    // Signed JWT token
    const payload = {
      userId: user._id,
      email: user.email,
      role: user.role,
    }
    const secret = authConfig.jwtSecret;
    const options = { expiresIn: Number(authConfig.jwtTokenExpires) };

    const token = jwt.sign(payload, secret, options);
    if (!token) throw new InvalidCredentialError("Invalid Credentials.", 401);

    return token;
  }
}

export default AuthService;