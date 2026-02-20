import { Db, MongoClient } from "mongodb";
import mongoDB from '../config/db.config.js';

let dbInstance: Db;

export async function connectToDatabase() {
  if (dbInstance) {
    return dbInstance;
  }

  const client = new MongoClient(mongoDB.connectionString);
  await client.connect();

  dbInstance = client.db(`${mongoDB.dbName}`);
  return dbInstance;
}
