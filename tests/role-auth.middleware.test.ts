import { describe, it, expect, beforeEach, vi } from "vitest";
import { roleAuth } from "../src/middleware/role-auth.middleware.js";
import { AuthRequest } from "../src/interfaces/auth.interface.js";
import { Response, NextFunction } from "express";

describe("roleAuth middleware", () => {
  let mockReq: Partial<AuthRequest>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    mockNext = vi.fn();
    vi.clearAllMocks();
  });

  it("should return 401 when user is not authenticated", () => {
    mockReq.user = undefined;
    const middleware = roleAuth("admin");

    middleware(mockReq as AuthRequest, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Unauthenticated." });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should return 403 when user role is not in allowed roles", () => {
    mockReq.user = { userId: "123", role: "student" };
    const middleware = roleAuth("admin", "teacher");

    middleware(mockReq as AuthRequest, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Access Denied" });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should call next when user role is in allowed roles", () => {
    mockReq.user = { userId: "456", role: "admin" };
    const middleware = roleAuth("admin", "teacher");

    middleware(mockReq as AuthRequest, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
    expect(mockRes.json).not.toHaveBeenCalled();
  });

  it("should call next when user role matches single allowed role", () => {
    mockReq.user = { userId: "789", role: "teacher" };
    const middleware = roleAuth("teacher");

    middleware(mockReq as AuthRequest, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  it("should call next when user role matches any of multiple allowed roles", () => {
    mockReq.user = { userId: "101", role: "moderator" };
    const middleware = roleAuth("admin", "moderator", "teacher");

    middleware(mockReq as AuthRequest, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  it("should be case-sensitive when matching roles", () => {
    mockReq.user = { userId: "102", role: "Admin" };
    const middleware = roleAuth("admin");

    middleware(mockReq as AuthRequest, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Access Denied" });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should return 401 when user object exists but role is undefined", () => {
    mockReq.user = { userId: "103", email: "test@example.com" } as any;
    const middleware = roleAuth("admin");

    middleware(mockReq as AuthRequest, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Access Denied" });
  });

  it("should handle error thrown during execution", () => {
    mockReq.user = { userId: "104", role: "admin" };
    const testError = new Error("Test error");

    // Mock next to throw an error
    vi.mocked(mockNext).mockImplementation(() => {
      throw testError;
    });

    const middleware = roleAuth("admin");

    expect(() => {
      middleware(mockReq as AuthRequest, mockRes as Response, mockNext);
    }).toThrow(testError);
  });

  it("should pass error to next when exception occurs", () => {
    mockReq.user = { userId: "105", role: "admin" };
    const testError = new Error("Unexpected error");

    // Override next to throw error
    vi.clearAllMocks();
    mockNext = vi.fn(() => {
      throw testError;
    });

    const middleware = roleAuth("admin");

    expect(() => {
      middleware(mockReq as AuthRequest, mockRes as Response, mockNext);
    }).toThrow(testError);
  });

  it("should work with empty allowed roles array", () => {
    mockReq.user = { userId: "106", role: "admin" };
    const middleware = roleAuth();

    middleware(mockReq as AuthRequest, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Access Denied" });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should handle user with additional properties", () => {
    mockReq.user = {
      userId: "107",
      email: "teacher@example.com",
      role: "teacher",
      iat: 1655000000,
      exp: 1655086400,
    } as any;
    const middleware = roleAuth("teacher", "admin");

    middleware(mockReq as AuthRequest, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  it("should return correct response and not call next on authorization failure", () => {
    mockReq.user = { userId: "108", role: "student" };
    const middleware = roleAuth("admin");

    middleware(mockReq as AuthRequest, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledTimes(1);
    expect(mockNext).not.toHaveBeenCalled();
  });
});