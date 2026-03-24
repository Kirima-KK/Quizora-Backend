import dotenv from 'dotenv';
dotenv.config();

const authConfig = {
  jwtSecret: process.env.JWT_SECRET,
  jwtTokenExpires: process.env.JWT_EXPIRES_IN,
}

export default authConfig;