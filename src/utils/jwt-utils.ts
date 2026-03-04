import { jwtVerify } from 'jose';

export type JwtPayload = {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
};

export async function verifyJwt(token: string) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const result = await jwtVerify<JwtPayload>(token, secret);

    return result;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}