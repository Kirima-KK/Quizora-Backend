import dotenv from 'dotenv';

dotenv.config();

const mongoDB = {
  connectionString: process.env.MONGODB_URI,
  dbName: process.env.DB_NAME,
  userCollectionName: process.env.USER_COLLECTION_NAME,
  options: {},
};

export default mongoDB;