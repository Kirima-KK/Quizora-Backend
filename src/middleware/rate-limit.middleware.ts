import { Request, Response, NextFunction } from "express";
import rateLimiter from "../utils/rate-limiter.js";
import RateLimitError from "../errors/rate-limit.error.js";
import { AuthRequest } from "../interfaces/auth.interface.js";

export interface RateLimitOptions {
  keyGenerator: (req: Request) => string;
  limit: number;
  windowMs: number;
  message?: string;
}

/**
 * Creates a rate limiting middleware
 * @param options - Configuration for rate limiting
 * @returns Middleware function
 */
export const createRateLimitMiddleware = (options: RateLimitOptions) => {
  const { keyGenerator, limit, windowMs, message } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const key = keyGenerator(req);
      const { allowed, remaining, retryAfter } = rateLimiter.isAllowed(key, limit, windowMs);

      // Set rate limit headers on all responses
      res.setHeader("X-RateLimit-Limit", limit);
      res.setHeader("X-RateLimit-Remaining", remaining);
      res.setHeader("X-RateLimit-Reset", new Date(Date.now() + retryAfter * 1000).toISOString());

      if (!allowed) {
        res.setHeader("Retry-After", retryAfter);
        throw new RateLimitError(message, retryAfter);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Key generator for IP-based rate limiting
 */
export const ipKeyGenerator = (req: Request): string => {
  return req.ip || req.socket?.remoteAddress || "unknown";
};

/**
 * Key generator for user ID-based rate limiting (authenticated endpoints)
 */
export const userIdKeyGenerator = (req: AuthRequest): string => {
  if (req.user && typeof req.user === "object" && "userId" in req.user) {
    return (req.user.userId as string) || "unknown";
  }
  return "unknown";
};
