import mongoose from 'mongoose';
import mongoDB from '../config/db.config.js';

export const connectToDb = async () => {
  await mongoose.connect(mongoDB.connectionString, mongoDB.options);
};
