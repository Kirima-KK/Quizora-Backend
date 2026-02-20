import mongoDB from "../config/db.config.js";
import { connectToDatabase } from "../db/index.js";
import bcrypt from 'bcrypt';
import authConfig from "../config/auth.config.js";
import jwt from 'jsonwebtoken';

class AuthService {
  login = async (email: string, password: string) => {
    const db = await connectToDatabase();
    const collection = db.collection(`${mongoDB.userCollectionName}`);

    const user = await collection.findOne({ email: email });
    if (!user) return null;

    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      return null;
    }

    const payload = {
      userId: user._id,
      email: user.email
    }
    const secret = authConfig.jwtSecret;
    const options = { expiresIn: Number(authConfig.jwtTokenExpires) };

    const token = jwt.sign(payload, secret, options);
    return token;
  }
}

export default AuthService;