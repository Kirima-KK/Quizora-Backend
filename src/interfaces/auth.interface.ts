import { Request } from "express";

export interface RegisterInfo {
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  role: string,
}

export interface LoginInfo {
  email: string,
  password: string,
}

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
    iat?: number;
    exp?: number;
  };
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
};