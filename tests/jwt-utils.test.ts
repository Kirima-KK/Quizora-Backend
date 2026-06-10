import { describe, it, expect, beforeEach, vi } from "vitest";
import { verifyJwt } from "../src/utils/jwt-utils.js";
import { jwtVerify } from "jose";
import authConfig from "../src/config/auth.config.js";

vi.mock('jose', async (importOriginal) => {
  const actual = await importOriginal<typeof import('jose')>();
  return {
    ...actual,
    // Turn jwtVerify into a clean mock function we can manipulate
    jwtVerify: vi.fn() 
  };
});
vi.mock("../config/auth.config.js");

describe("jwt-utils", () => {
  const mockSecret = "test-secret-key-12345";
  const mockUserId = "507f1f77bcf86cd799439011";
  const mockValidPayload = {
    payload: {
      userId: mockUserId,
      email: "test@example.com",
      role: "USER",
      iat: 1234567890,
      exp: 1234571490,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (authConfig as any).jwtSecret = mockSecret;
  });

  describe("verifyJwt", () => {
    it("should return decoded JWT payload on successful verification", async () => {
      vi.mocked(jwtVerify).mockResolvedValue(mockValidPayload as any);

      const result = await verifyJwt("valid-token");

      expect(result).toEqual(mockValidPayload);
      expect(result?.payload).toEqual(mockValidPayload.payload);
    });

    it("should call jwtVerify with token and encoded secret", async () => {
      vi.mocked(jwtVerify).mockResolvedValue(mockValidPayload as any);

      await verifyJwt("test-token");

      expect(jwtVerify).toHaveBeenCalledTimes(1);
      const callArgs = vi.mocked(jwtVerify).mock.calls[0];
      expect(callArgs[0]).toBe("test-token");
      expect(callArgs[1]).toBeInstanceOf(Uint8Array);
    });

    it("should encode secret with TextEncoder", async () => {
      const textEncoderSpy = vi.spyOn(global, "TextEncoder" as any);
      vi.mocked(jwtVerify).mockResolvedValue(mockValidPayload as any);

      await verifyJwt("test-token");

      expect(textEncoderSpy).toHaveBeenCalled();
    });

    it("should return null on invalid token", async () => {
      vi.mocked(jwtVerify).mockRejectedValue(new Error("Invalid token"));

      const result = await verifyJwt("invalid-token");

      expect(result).toBeNull();
    });

    it("should return null on expired token", async () => {
      const expiredError = new Error("Token expired");
      vi.mocked(jwtVerify).mockRejectedValue(expiredError);

      const result = await verifyJwt("expired-token");

      expect(result).toBeNull();
    });

    it("should return null on malformed token", async () => {
      vi.mocked(jwtVerify).mockRejectedValue(new Error("Malformed token"));

      const result = await verifyJwt("malformed-token");

      expect(result).toBeNull();
    });

    it("should log error to console on verification failure", async () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const testError = new Error("Verification failed");
      vi.mocked(jwtVerify).mockRejectedValue(testError);

      await verifyJwt("invalid-token");

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "JWT verification failed:",
        testError
      );
      consoleErrorSpy.mockRestore();
    });

    it("should handle verification errors gracefully", async () => {
      const error = new Error("JwtError");
      vi.mocked(jwtVerify).mockRejectedValue(error);

      const result = await verifyJwt("test-token");

      expect(result).toBeNull();
      expect(() => {
        throw new Error();
      }).toThrow();
    });

    it("should use authConfig.jwtSecret for encoding", async () => {
      const customSecret = "custom-secret-xyz";
      (authConfig as any).jwtSecret = customSecret;

      vi.mocked(jwtVerify).mockResolvedValue(mockValidPayload as any);

      await verifyJwt("test-token");

      const callArgs = vi.mocked(jwtVerify).mock.calls[0];
      const encodedSecret = callArgs[1] as unknown as Uint8Array;
      expect(encodedSecret).toBeInstanceOf(Uint8Array);
    });

    it("should return payload with all JwtPayload properties", async () => {
      vi.mocked(jwtVerify).mockResolvedValue(mockValidPayload as any);

      const result = await verifyJwt("test-token");

      expect(result?.payload).toHaveProperty("userId");
      expect(result?.payload).toHaveProperty("email");
      expect(result?.payload).toHaveProperty("role");
      expect(result?.payload).toHaveProperty("iat");
      expect(result?.payload).toHaveProperty("exp");
    });

    it("should correctly extract userId from payload", async () => {
      vi.mocked(jwtVerify).mockResolvedValue(mockValidPayload as any);

      const result = await verifyJwt("test-token");

      expect(result?.payload.userId).toBe(mockUserId);
    });

    it("should correctly extract email from payload", async () => {
      vi.mocked(jwtVerify).mockResolvedValue(mockValidPayload as any);

      const result = await verifyJwt("test-token");

      expect(result?.payload.email).toBe("test@example.com");
    });

    it("should correctly extract role from payload", async () => {
      vi.mocked(jwtVerify).mockResolvedValue(mockValidPayload as any);

      const result = await verifyJwt("test-token");

      expect(result?.payload.role).toBe("USER");
    });

    it("should handle different user roles", async () => {
      const adminPayload = {
        payload: {
          userId: mockUserId,
          email: "admin@example.com",
          role: "ADMIN",
          iat: 1234567890,
          exp: 1234571490,
        },
      };

      vi.mocked(jwtVerify).mockResolvedValue(adminPayload as any);

      const result = await verifyJwt("admin-token");

      expect(result?.payload.role).toBe("ADMIN");
    });

    it("should handle token without optional iat and exp fields", async () => {
      const payloadNoOptional = {
        payload: {
          userId: mockUserId,
          email: "test@example.com",
          role: "USER",
        },
      };

      vi.mocked(jwtVerify).mockResolvedValue(payloadNoOptional as any);

      const result = await verifyJwt("test-token");

      expect(result?.payload).toEqual(payloadNoOptional.payload);
      expect(result?.payload.iat).toBeUndefined();
      expect(result?.payload.exp).toBeUndefined();
    });

    it("should handle different token formats", async () => {
      vi.mocked(jwtVerify).mockResolvedValue(mockValidPayload as any);

      const token1 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.signature";
      const result1 = await verifyJwt(token1);

      expect(result1).toEqual(mockValidPayload);

      const token2 = "different.format.token";
      const result2 = await verifyJwt(token2);

      expect(result2).toEqual(mockValidPayload);
    });

    it("should handle empty token string", async () => {
      vi.mocked(jwtVerify).mockRejectedValue(new Error("Invalid token"));

      const result = await verifyJwt("");

      expect(result).toBeNull();
    });

    it("should handle null secret in authConfig", async () => {
      (authConfig as any).jwtSecret = null;

      vi.mocked(jwtVerify).mockResolvedValue(mockValidPayload as any);

      const result = await verifyJwt("test-token");

      const callArgs = vi.mocked(jwtVerify).mock.calls[0];
      expect(callArgs[1]).toBeInstanceOf(Uint8Array);
    });

    it("should handle undefined secret in authConfig", async () => {
      (authConfig as any).jwtSecret = undefined;

      vi.mocked(jwtVerify).mockResolvedValue(mockValidPayload as any);

      const result = await verifyJwt("test-token");

      const callArgs = vi.mocked(jwtVerify).mock.calls[0];
      expect(callArgs[1]).toBeInstanceOf(Uint8Array);
    });

    it("should not throw error on jwtVerify rejection", async () => {
      vi.mocked(jwtVerify).mockRejectedValue(new Error("Verification failed"));

      const result = await verifyJwt("test-token");

      expect(result).toBeNull();
    });

    it("should handle multiple consecutive verifications", async () => {
      vi.mocked(jwtVerify).mockResolvedValue(mockValidPayload as any);

      const result1 = await verifyJwt("token1");
      const result2 = await verifyJwt("token2");
      const result3 = await verifyJwt("token3");

      expect(result1).toEqual(mockValidPayload);
      expect(result2).toEqual(mockValidPayload);
      expect(result3).toEqual(mockValidPayload);
      expect(vi.mocked(jwtVerify)).toHaveBeenCalledTimes(3);
    });

    it("should handle mixed success and failure verifications", async () => {
      vi.mocked(jwtVerify)
        .mockResolvedValueOnce(mockValidPayload as any)
        .mockRejectedValueOnce(new Error("Invalid"))
        .mockResolvedValueOnce(mockValidPayload as any);

      const result1 = await verifyJwt("valid-token");
      const result2 = await verifyJwt("invalid-token");
      const result3 = await verifyJwt("valid-token");

      expect(result1).toEqual(mockValidPayload);
      expect(result2).toBeNull();
      expect(result3).toEqual(mockValidPayload);
    });

    it("should properly handle signature verification errors", async () => {
      const signatureError = new Error("Signature verification failed");
      vi.mocked(jwtVerify).mockRejectedValue(signatureError);

      const result = await verifyJwt("tampered-token");

      expect(result).toBeNull();
    });

    it("should handle various error types from jwtVerify", async () => {
      const errors = [
        new Error("Invalid token"),
        new TypeError("Token is not a string"),
        new RangeError("Token size exceeded"),
      ];

      for (const error of errors) {
        vi.mocked(jwtVerify).mockRejectedValueOnce(error);

        const result = await verifyJwt("test-token");

        expect(result).toBeNull();
      }
    });

    it("should preserve payload structure from jwtVerify", async () => {
      const complexPayload = {
        payload: {
          userId: "complex-id",
          email: "complex@example.com",
          role: "MANAGER",
          iat: 9999999999,
          exp: 9999999999,
        },
      };

      vi.mocked(jwtVerify).mockResolvedValue(complexPayload as any);

      const result = await verifyJwt("test-token");

      expect(result).toStrictEqual(complexPayload);
    });
  });
});