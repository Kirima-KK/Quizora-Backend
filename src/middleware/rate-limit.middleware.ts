import { Request, Response, NextFunction } from "express";
import rateLimiter from "../utils/rate-limiter.js";
import RateLimitError from "../errors/rate-limit.error.js";
import { rateLimitConfig } from "../config/rate-limit.config.js";
import { AuthRequest } from "../interfaces/auth.interface.js";

export interface RateLimitOptions {
  keyGenerator: (req: Request) => string;
  limit: number;
  windowMs: number;
  message?: string;
}

export const createRateLimitMiddleware = (options: RateLimitOptions) => {
  const { keyGenerator, limit, windowMs, message } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const key = keyGenerator(req);
      const { allowed, remaining, retryAfter } = rateLimiter.isAllowed(key, limit, windowMs);

      res.setHeader("X-RateLimit-Limit", limit);
      res.setHeader("X-RateLimit-Remaining", remaining);
      res.setHeader("X-RateLimit-Reset", new Date(Date.now() + retryAfter * 1000).toISOString());

      if (!allowed) {
        res.setHeader("Retry-After", retryAfter);
        return next(new RateLimitError(message, retryAfter));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const ipKeyGenerator = (req: Request): string => {
  return req.ip || req.socket?.remoteAddress || "unknown";
};

export const userIdKeyGenerator = (req: AuthRequest): string => {
  return req.user?.userId || "unknown";
};

export const publicRateLimiter = createRateLimitMiddleware({
  keyGenerator: ipKeyGenerator,
  limit: rateLimitConfig.publicEndpoints.limit,
  windowMs: rateLimitConfig.publicEndpoints.windowMs,
  message: "Too many authentication requests. Please try again in a minute.",
});

export const authenticatedRateLimiter = createRateLimitMiddleware({
  keyGenerator: userIdKeyGenerator,
  limit: rateLimitConfig.authenticatedEndpoints.limit,
  windowMs: rateLimitConfig.authenticatedEndpoints.windowMs,
  message: "Too many requests. Please try again in a minute.",
});
