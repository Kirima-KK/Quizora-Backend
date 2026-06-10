import { describe, it, expect, beforeEach, vi } from "vitest";
import { verifyToken } from "../src/middleware/auth.middleware.js";
import { verifyJwt } from "../src/utils/jwt-utils.js";
import { NextFunction, Response } from "express";
import { AuthRequest } from "../src/interfaces/auth.interface.js";
import { JwtPayload } from "../src/interfaces/auth.interface.js";
import { JWTVerifyResult } from "jose";

vi.mock("../src/utils/jwt-utils.js");

describe("verifyToken middleware", () => {
  let mockReq: Partial<AuthRequest>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {
      cookies: {},
    };
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    mockNext = vi.fn();
    vi.clearAllMocks();
  });

  it("should call next() and attach user payload when token is valid", async () => {
    const mockPayload: JWTVerifyResult<JwtPayload> = {
      payload: {
        userId: "123",
        email: "user@example.com",
        role: "user",
        iat: 1234567890,
        exp: 1234567890,
      },
      protectedHeader: { alg: "HS256" }
    };
    mockReq.cookies!.session = "valid-token";
    vi.mocked(verifyJwt).mockResolvedValue(mockPayload);

    await verifyToken(mockReq as AuthRequest, mockRes as Response, mockNext);

    expect(verifyJwt).toHaveBeenCalledWith("valid-token");
    expect(mockReq.user).toEqual(mockPayload.payload);
    expect(mockNext).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  it("should return 401 when session cookie is missing", async () => {
    mockReq.cookies = {};

    await verifyToken(mockReq as AuthRequest, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Unauthenticated" });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should return 401 when verifyJwt returns null", async () => {
    mockReq.cookies!.session = "invalid-token";
    vi.mocked(verifyJwt).mockResolvedValue(null);

    await verifyToken(mockReq as AuthRequest, mockRes as Response, mockNext);

    expect(verifyJwt).toHaveBeenCalledWith("invalid-token");
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Unauthenticated" });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should correctly extract and attach nested payload property", async () => {
    const mockPayload: JWTVerifyResult<JwtPayload> = {
      payload: {
        userId: "456",
        email: "admin@example.com",
        role: "admin",
        iat: 1234567890,
        exp: 1234567890,
      },
      protectedHeader: { alg: "HS256" }
    };
    mockReq.cookies!.session = "token";
    vi.mocked(verifyJwt).mockResolvedValue(mockPayload);

    await verifyToken(mockReq as AuthRequest, mockRes as Response, mockNext);

    expect(mockReq.user).toEqual({
      userId: "456",
      role: "admin",
      email: "admin@example.com",
      iat: 1234567890,
      exp: 1234567890
    });
    expect(mockReq.user).not.toEqual(mockPayload);
  });

  it("should handle verifyJwt rejections gracefully", async () => {
    mockReq.cookies!.session = "malformed-token";
    vi.mocked(verifyJwt).mockRejectedValue(new Error("JWT verification failed"));

    await expect(
      verifyToken(mockReq as AuthRequest, mockRes as Response, mockNext)
    ).rejects.toThrow("JWT verification failed");
  });
});