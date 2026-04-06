import dotenv from 'dotenv';

dotenv.config();

const serverConfig = {
  environment: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3001,
  allowedOrigins: [
    'http://localhost:3000',
    'https://quizora-backend.vercel.app',
    'https://quizora-seven.vercel.app',
    /^https:\/\/.*\.vercel\.app$/
  ],
};

export default serverConfig;