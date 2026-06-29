import { describe, it, expect, beforeEach, vi } from "vitest";
import { createRateLimitMiddleware } from "../src/middleware/rate-limit.middleware.js";
import rateLimiter from "../src/utils/rate-limiter.js";
import { Request, Response, NextFunction } from "express";
import RateLimitError from "../src/errors/rate-limit.error.js";

describe("Rate Limiter Middleware Integration", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = vi.fn();
  let headers: Record<string, any> = {};

  beforeEach(() => {
    rateLimiter.clear();
    headers = {};
    nextFunction = vi.fn();
    
    mockRequest = {
      ip: "127.0.0.1",
    };

    mockResponse = {
      setHeader: vi.fn().mockImplementation((key, value) => {
        headers[key] = value;
        return mockResponse;
      }),
    };
  });

  it("should pass to next() and set rate-limit headers on successful evaluation", () => {
    const middleware = createRateLimitMiddleware({
      keyGenerator: (req) => req.ip || "unknown",
      limit: 5,
      windowMs: 60000,
    });

    middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledWith(); // Called with no errors
    expect(headers["X-RateLimit-Limit"]).toBe(5);
    expect(headers["X-RateLimit-Remaining"]).toBe(4);
    expect(headers["X-RateLimit-Reset"]).toBeDefined();
  });

  it("should call next() with a RateLimitError and set Retry-After when limit is breached", () => {
    const middleware = createRateLimitMiddleware({
      keyGenerator: (req) => req.ip || "unknown",
      limit: 1,
      windowMs: 60000,
      message: "Too many attempts!",
    });

    // 1st request: Allowed
    middleware(mockRequest as Request, mockResponse as Response, nextFunction);
    
    // 2nd request: Throttled
    middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenLastCalledWith(expect.any(RateLimitError));
    expect(headers["X-RateLimit-Remaining"]).toBe(0);
    expect(headers["Retry-After"]).toBeDefined();
    
    const errorPassed = (nextFunction as any).mock.calls[1][0] as RateLimitError;
    expect(errorPassed.message).toBe("Too many attempts!");
    expect(errorPassed.statusCode).toBe(429);
  });

  it("should safely pass runtime exceptions caught inside the middleware block to next()", () => {
    const brokenKeyGen = () => { throw new Error("Database offline or generation failed"); };
    const middleware = createRateLimitMiddleware({
      keyGenerator: brokenKeyGen,
      limit: 10,
      windowMs: 60000,
    });

    middleware(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(nextFunction).toHaveBeenCalledWith(expect.any(Error));
  });
});