import mongoDB from "../config/db.config.js";
import { connectToDatabase } from "../db/index.js";
import bcrypt from 'bcrypt';
import authConfig from "../config/auth.config.js";
import jwt from 'jsonwebtoken';
import { LoginInfo, RegisterInfo } from "../models/auth.model.js";
import InvalidCredentialError from "../errors/invalid-credential.error.js";
import UserAlreadyExistError from "../errors/user-already-exist.error.js";

class AuthService {
  register = async (addedUser: RegisterInfo) => {
    const db = await connectToDatabase();
    const collection = db.collection(`${mongoDB.userCollectionName}`);

    // Check for user existence
    const user = await collection.findOne({ email: addedUser.email });
    if (user) {
      throw new UserAlreadyExistError("User already exist.", 400);
    }

    // Encrypt thye password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(addedUser.password.toString(), salt);

    // Added new user to the database
    const newUser = await collection.insertOne({
      email: addedUser.email,
      firstName: addedUser.firstName,
      lastName: addedUser.lastName,
      password: hash,
      createdAt: new Date()
    });

    // Signed JWT token
    const payload = {
      user: {
        id: newUser.insertedId
      }
    };

    const secret = authConfig.jwtSecret;
    const options = { expiresIn: Number(authConfig.jwtTokenExpires) };

    const token = jwt.sign(payload, secret, options);
    if (!token) throw new InvalidCredentialError("Invalid Credentials.", 401);
      
    return token
  }

  login = async (currentUser: LoginInfo) => {
    const db = await connectToDatabase();
    const collection = db.collection(`${mongoDB.userCollectionName}`);

    // Check for user existence
    const user = await collection.findOne({ email: currentUser.email });
    if (!user) throw new InvalidCredentialError("Invalid Credentials.", 401);

    const result = await bcrypt.compare(currentUser.password, user.password);
    if (!result) {
      throw new InvalidCredentialError("Invalid Credentials.", 401);
    }

    // Signed JWT token
    const payload = {
      userId: user._id,
      email: user.email
    }
    const secret = authConfig.jwtSecret;
    const options = { expiresIn: Number(authConfig.jwtTokenExpires) };

    const token = jwt.sign(payload, secret, options);
    if (!token) throw new InvalidCredentialError("Invalid Credentials.", 401);

    return token;
  }
}

export default AuthService;