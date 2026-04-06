import { NextFunction, Response } from "express";
import { AuthRequest } from "../interfaces/auth.interface.js";

export const roleAuth = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthenticated." });

      if (!allowedRoles.includes(req.user.role)) {
        res.status(403).json({ message: "Access Denied" });
      }

      next();
    } catch (err) {
      next(err);
    }
  }
}