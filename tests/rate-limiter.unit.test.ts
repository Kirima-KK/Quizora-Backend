import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import rateLimiter from "../src/utils/rate-limiter.js";
import RateLimitError from "../src/errors/rate-limit.error.js";
import { ipKeyGenerator, userIdKeyGenerator } from "../src/middleware/rate-limit.middleware.js";
import { Request } from "express";
import { AuthRequest } from "../src/interfaces/auth.interface.js"; // Adjust path as needed

describe("RateLimitError", () => {
  it("should create an error with correct status code and default message", () => {
    const error = new RateLimitError();
    expect(error.statusCode).toBe(429);
    expect(error.retryAfter).toBe(60);
    expect(error.message).toBe("Too many requests, please try again later.");
  });

  it("should accept custom message and retryAfter values", () => {
    const error = new RateLimitError("Custom block message", 30);
    expect(error.statusCode).toBe(429);
    expect(error.retryAfter).toBe(30);
    expect(error.message).toBe("Custom block message");
  });
});

describe("RateLimiter Core", () => {
  beforeEach(() => {
    rateLimiter.stopCleanup();

    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));
    rateLimiter.clear();

    (rateLimiter as any).startCleanup();
  });

  afterEach(() => {
    rateLimiter.stopCleanup();
    vi.useRealTimers();
  });

  it("should allow requests under the limit and decrement remaining count", () => {
    const key = "test-user-1";
    const limit = 3;
    const windowMs = 60000; // 1 minute

    const first = rateLimiter.isAllowed(key, limit, windowMs);
    expect(first.allowed).toBe(true);
    expect(first.remaining).toBe(2);

    const second = rateLimiter.isAllowed(key, limit, windowMs);
    expect(second.remaining).toBe(1);
  });

  it("should block requests exceeding the limit and calculate accurate retryAfter", () => {
    const key = "test-user-2";
    const limit = 2;
    const windowMs = 60000;

    rateLimiter.isAllowed(key, limit, windowMs);
    rateLimiter.isAllowed(key, limit, windowMs);
    
    // 3rd request should be blocked
    const third = rateLimiter.isAllowed(key, limit, windowMs);
    expect(third.allowed).toBe(false);
    expect(third.remaining).toBe(0);
    expect(third.retryAfter).toBe(60); // 60 seconds remaining until the 1st request drops off
  });

  it("should slide the window and allow requests after time passes", () => {
    const key = "test-user-3";
    const limit = 1;
    const windowMs = 10000; // 10 seconds

    // First request at t=0
    expect(rateLimiter.isAllowed(key, limit, windowMs).allowed).toBe(true);
    // Blocked at t=2s
    vi.advanceTimersByTime(2000);
    expect(rateLimiter.isAllowed(key, limit, windowMs).allowed).toBe(false);

    // Allowed again at t=11s (outside window)
    vi.advanceTimersByTime(9000); 
    const result = rateLimiter.isAllowed(key, limit, windowMs);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(0);
  });

  it("should manually reset a specific key", () => {
    const key = "test-user-4";
    rateLimiter.isAllowed(key, 1, 60000);
    
    expect(rateLimiter.getCount(key)).toBe(1);
    rateLimiter.reset(key);
    expect(rateLimiter.getCount(key)).toBe(0);
  });

  it("should periodically clean up expired memory entries", () => {
    const key = "test-user-5";
    rateLimiter.isAllowed(key, 5, 60000);
    
    // Advance past the 10-minute safe cleanup mark inside startCleanup
    vi.advanceTimersByTime(11 * 60 * 1000);
    
    // Trigger the interval logic manually by advancing vitest timers
    expect(rateLimiter.getCount(key)).toBe(0);
  });
});

describe("Key Generators", () => {
  it("should resolve IP address from various request properties", () => {
    const mockReq = { ip: "192.168.1.1" } as unknown as Request;
    expect(ipKeyGenerator(mockReq)).toBe("192.168.1.1");

    const mockReqSocket = { socket: { remoteAddress: "10.0.0.1" } } as unknown as Request;
    expect(ipKeyGenerator(mockReqSocket)).toBe("10.0.0.1");

    const emptyReq = {} as unknown as Request;
    expect(ipKeyGenerator(emptyReq)).toBe("unknown");
  });

  it("should resolve user ID from AuthRequest", () => {
    const mockAuthReq = { user: { userId: "user_99a" } } as unknown as AuthRequest;
    expect(userIdKeyGenerator(mockAuthReq)).toBe("user_99a");

    const missingUserReq = {} as unknown as AuthRequest;
    expect(userIdKeyGenerator(missingUserReq)).toBe("unknown");
  });
});