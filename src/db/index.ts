// import { Db, MongoClient } from "mongodb";
// import mongoDB from '../config/db.config.js';

// let dbInstance: Db;

// export async function connectToDatabase() {
//   if (dbInstance) {
//     return dbInstance;
//   }

//   const client = new MongoClient(mongoDB.connectionString);
//   await client.connect();

//   dbInstance = client.db(`${mongoDB.dbName}`);
//   return dbInstance;
// }

import mongoose from "mongoose";
import mongoDB from "../config/db.config.js";

export const connectToDatabase = async () => {
  try {
    const connect = await mongoose.connect(mongoDB.connectionString);

    console.log(`Database Connected: ${connect.connection.host}, ${connect.connection.name}`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}