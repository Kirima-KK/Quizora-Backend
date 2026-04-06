import { NextFunction, Response } from "express";
import { verifyJwt } from "../utils/jwt-utils.js";
import { AuthRequest } from "../interfaces/auth.interface.js";

export const verifyToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.session;
  const payload = token ? await verifyJwt(token) : null;
  if (!payload) {
    return res.status(401).json({ message: "Unauthenticated" });
  }

  req.user = payload.payload;
  next();
}