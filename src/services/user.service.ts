import { verifyJwt } from "../utils/jwt-utils.js";
import { ObjectId } from "mongodb";
import User from "../models/user.model.js";
import UnauthenticatedError from "../errors/unauthenticated.error.js";
import UserNotFoundError from "../errors/user-not-found.error.js";
import { withCache, invalidateCache } from "../utils/cache.util.js";
import redisConfig from "../config/redis.config.js";

class UserService {
  getAllUsers = async () => {
    const users = await User.find({});
    return users;
  }

  getUserByEmail = async (email: string) => {
    const cacheKey = `user:email:${email}`;

    return withCache(cacheKey, async () => {
      const user = await User.findOne({ email: email });
      return user;
    }, redisConfig.ttl.user);
  };

  getCurrentUser = async (sessionToken: string | undefined) => {
    // Current session token validation
    const payload = sessionToken ? await verifyJwt(sessionToken) : null;
    if (!payload) {
      throw new UnauthenticatedError("Unauthenticated.", 401);
    }

    const userId: string = payload?.payload.userId;
    const cacheKey = `user:${userId}`;

    return withCache(cacheKey, async () => {
      const user = await User.findOne({ _id: new ObjectId(userId) });
      if (!user) throw new UserNotFoundError("User not found.", 404);

      return user;
    }, redisConfig.ttl.user);
  }

  /**
   * Invalidate user cache
   * Called after user profile updates
   */
  invalidateUserCache = async (userId: string) => {
    await invalidateCache(`user:${userId}`);
  }

  /**
   * Invalidate user email cache
   * Called after email updates
   */
  invalidateUserEmailCache = async (email: string) => {
    await invalidateCache(`user:email:${email}`);
  }
}

export default UserService;