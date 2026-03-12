import { connectToDatabase } from "../db/index.js";
import mongoDB from '../config/db.config.js';
import { verifyJwt } from "../utils/jwt-utils.js";
import { ObjectId } from "mongodb";
import User from "../models/user.model.js";
import UnauthenticatedError from "../errors/unauthenticated.error.js";
import UserNotFoundError from "../errors/user-not-found.error.js";

class UserService {
  getAllUsers = async () => {
    // const db = await connectToDatabase();
    // const collection = db.collection(`${mongoDB.userCollectionName}`);

    const users = await User.find({});
    return users;
  }

  getUserByEmail = async (email: string) => {
    // const db = await connectToDatabase();
    // const collection = db.collection(`${mongoDB.userCollectionName}`);

    const user = await User.findOne({ email: email });
    return user;
  };

  getCurrentUser = async (session) => {
    // Current session token validation
    const payload = session ? await verifyJwt(session) : null;
    if (!payload) {
      throw new UnauthenticatedError("Unauthenticated.", 401);
    }

    // const db = await connectToDatabase();
    // const collection = db.collection(`${process.env.USER_COLLECTION_NAME}`);
    const userId: string = payload?.payload.userId;
    const user = await User.findOne({ _id: new ObjectId(userId) });
    if (!user) throw new UserNotFoundError("User not found.", 404);

    return user;
  }
}

export default UserService;