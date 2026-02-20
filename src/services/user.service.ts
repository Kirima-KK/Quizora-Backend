import { connectToDatabase } from "../db/index.js";
import mongoDB from '../config/db.config.js';

class UserService {
  getAllUsers = async () => {
    const db = await connectToDatabase();
    const collection = db.collection(`${mongoDB.userCollectionName}`);

    const users = await collection.find().toArray();
    return users;
  }

  getUserByEmail = async (email: string) => {
    const db = await connectToDatabase();
    const collection = db.collection(`${mongoDB.userCollectionName}`);

    const user = await collection.findOne({ email: email });
    return user;
  };
}

export default UserService;