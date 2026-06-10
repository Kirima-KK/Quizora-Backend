import { NextFunction, Response } from "express";
import { AuthRequest } from "../interfaces/auth.interface.js";
import { getSession, refreshSession } from "../services/session.service.js";
import { verifyJwt } from "../utils/jwt-utils.js";

export const verifyToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const sessionToken = req.cookies.sessionToken;
    const sessionId = req.cookies.sessionId;

    if (!sessionToken || verifyJwt(sessionToken) === null) {
      return res.status(401).json({ message: "Unauthenticated" });
    }

    // Get session from Redis
    const session = await getSession(sessionId);
    
    if (!session) {
      return res.status(401).json({ message: "Unauthenticated" });
    }

    // Refresh session TTL
    await refreshSession(sessionId);

    // Attach user data to request
    req.user = {
      userId: session.userId,
      role: session.role,
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ message: "Unauthenticated" });
  }
}