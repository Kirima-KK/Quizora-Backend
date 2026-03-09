import dotenv from 'dotenv';

dotenv.config();

const mongoDB = {
  connectionString: process.env.MONGODB_URI,
  dbName: process.env.DB_NAME,
  userCollectionName: process.env.USER_COLLECTION_NAME,
  quizCollectionName: process.env.QUIZ_COLLECTION_NAME,
  itemPerPage: process.env.ITEMS_PER_PAGE,
  options: {},
};

export default mongoDB;