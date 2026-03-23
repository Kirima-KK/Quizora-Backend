import { jwtVerify } from 'jose';
import authConfig from '../config/auth.config.js';

export type JwtPayload = {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
};

export async function verifyJwt(token: string) {
  try {
    const secret = new TextEncoder().encode(authConfig.jwtSecret);
    const result = await jwtVerify<JwtPayload>(token, secret);

    return result;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}