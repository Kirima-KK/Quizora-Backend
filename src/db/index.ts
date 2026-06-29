import mongoose from "mongoose";
import mongoDB from "../config/db.config.js";
import MongoDBConnectionFailedError from "../errors/mongodb-connection-failed.error.js";
import { initializeRedis } from "./redis.js";

export const connectToDatabase = async () => {
  try {
    if (!mongoDB.connectionString) throw new MongoDBConnectionFailedError("Please define the MONGODB_URI environment variable");

    const connect = await mongoose.connect(mongoDB.connectionString);

    console.log(`Database Connected: ${connect.connection.host}, ${connect.connection.name}`);

    initializeRedis();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}