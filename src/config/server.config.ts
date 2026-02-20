import dotenv from 'dotenv';

dotenv.config();

const serverConfig = {
  environment: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
};

export default serverConfig;