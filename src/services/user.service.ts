import { verifyJwt } from "../utils/jwt-utils.js";
import { ObjectId } from "mongodb";
import User from "../models/user.model.js";
import UnauthenticatedError from "../errors/unauthenticated.error.js";
import UserNotFoundError from "../errors/user-not-found.error.js";

class UserService {
  getAllUsers = async () => {
    const users = await User.find({});
    return users;
  }

  getUserByEmail = async (email: string) => {
    const user = await User.findOne({ email: email });
    return user;
  };

  getCurrentUser = async (session) => {
    // Current session token validation
    const payload = session ? await verifyJwt(session) : null;
    if (!payload) {
      throw new UnauthenticatedError("Unauthenticated.", 401);
    }

    const userId: string = payload?.payload.userId;
    const user = await User.findOne({ _id: new ObjectId(userId) });
    if (!user) throw new UserNotFoundError("User not found.", 404);

    return user;
  }
}

export default UserService;