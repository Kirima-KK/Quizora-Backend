import { describe, it, expect, beforeEach, vi } from "vitest";
import { ObjectId } from "mongodb";
import UserService from "../src/services/user.service.js";
import User from "../src/models/user.model.js";
import { verifyJwt } from "../src/utils/jwt-utils.js";
import UnauthenticatedError from "../src/errors/unauthenticated.error.js";
import UserNotFoundError from "../src/errors/user-not-found.error.js";

vi.mock("../src/models/user.model.js");
vi.mock("../src/utils/jwt-utils.js");

describe("UserService", () => {
  let userService: UserService;
  const mockUserId = "507f1f77bcf86cd799439011";
  const mockUser = {
    _id: new ObjectId(mockUserId),
    email: "user@example.com",
    firstName: "John",
    lastName: "Doe",
    password: "hashed-password",
    role: "USER",
    correctAnswers: 5,
    quizPassed: 2,
    createdAt: new Date(),
  };

  beforeEach(() => {
    userService = new UserService();
    vi.clearAllMocks();
  });

  describe("getAllUsers", () => {
    it("should return all users from database", async () => {
      const mockUsers = [mockUser, { ...mockUser, _id: new ObjectId() }];
      vi.mocked(User.find).mockResolvedValue(mockUsers as any);

      const result = await userService.getAllUsers();

      expect(result).toEqual(mockUsers);
      expect(User.find).toHaveBeenCalledWith({});
    });

    it("should call User.find with empty filter", async () => {
      vi.mocked(User.find).mockResolvedValue([mockUser] as any);

      await userService.getAllUsers();

      expect(User.find).toHaveBeenCalledWith({});
      expect(User.find).toHaveBeenCalledTimes(1);
    });

    it("should return empty array when no users exist", async () => {
      vi.mocked(User.find).mockResolvedValue([] as any);

      const result = await userService.getAllUsers();

      expect(result).toEqual([]);
    });

    it("should return multiple users", async () => {
      const users = Array.from({ length: 5 }, (_, i) => ({
        ...mockUser,
        _id: new ObjectId(),
        email: `user${i}@example.com`,
      }));
      vi.mocked(User.find).mockResolvedValue(users as any);

      const result = await userService.getAllUsers();

      expect(result).toHaveLength(5);
    });

    it("should handle database errors", async () => {
      const dbError = new Error("Database connection failed");
      vi.mocked(User.find).mockRejectedValue(dbError);

      await expect(userService.getAllUsers()).rejects.toThrow(
        "Database connection failed"
      );
    });
  });

  describe("getUserByEmail", () => {
    it("should return user when found by email", async () => {
      const email = "user@example.com";
      vi.mocked(User.findOne).mockResolvedValue(mockUser as any);

      const result = await userService.getUserByEmail(email);

      expect(result).toEqual(mockUser);
      expect(User.findOne).toHaveBeenCalledWith({ email: email });
    });

    it("should return null when user not found", async () => {
      vi.mocked(User.findOne).mockResolvedValue(null);

      const result = await userService.getUserByEmail("notfound@example.com");

      expect(result).toBeNull();
    });

    it("should call User.findOne with correct email filter", async () => {
      const email = "test@example.com";
      vi.mocked(User.findOne).mockResolvedValue(mockUser as any);

      await userService.getUserByEmail(email);

      expect(User.findOne).toHaveBeenCalledWith({ email: email });
      expect(User.findOne).toHaveBeenCalledTimes(1);
    });

    it("should be case-sensitive when searching by email", async () => {
      const email = "User@Example.com";
      vi.mocked(User.findOne).mockResolvedValue(null);

      const result = await userService.getUserByEmail(email);

      expect(User.findOne).toHaveBeenCalledWith({ email: email });
      expect(result).toBeNull();
    });

    it("should return user with all fields", async () => {
      vi.mocked(User.findOne).mockResolvedValue(mockUser as any);

      const result = await userService.getUserByEmail("user@example.com");

      expect(result).toHaveProperty("_id");
      expect(result).toHaveProperty("email");
      expect(result).toHaveProperty("firstName");
      expect(result).toHaveProperty("lastName");
      expect(result).toHaveProperty("password");
      expect(result).toHaveProperty("role");
    });

    it("should handle database errors", async () => {
      const dbError = new Error("Database query failed");
      vi.mocked(User.findOne).mockRejectedValue(dbError);

      await expect(
        userService.getUserByEmail("user@example.com")
      ).rejects.toThrow("Database query failed");
    });
  });

  describe("getCurrentUser", () => {
    const validToken = "valid-jwt-token";
    const validPayload = {
      payload: {
        userId: mockUserId,
        email: mockUser.email,
        role: mockUser.role,
      },
    };

    it("should return user when session is valid", async () => {
      vi.mocked(verifyJwt).mockResolvedValue(validPayload as any);
      vi.mocked(User.findOne).mockResolvedValue(mockUser as any);

      const result = await userService.getCurrentUser(validToken);

      expect(result).toEqual(mockUser);
    });

    it("should throw UnauthenticatedError when session is undefined", async () => {
      await expect(userService.getCurrentUser(undefined)).rejects.toThrow(
        UnauthenticatedError
      );
      await expect(userService.getCurrentUser(undefined)).rejects.toThrow(
        "Unauthenticated."
      );
    });

    it("should throw UnauthenticatedError with 401 status code", async () => {
      try {
        await userService.getCurrentUser(undefined);
      } catch (error: any) {
        expect(error.statusCode).toBe(401);
      }
    });

    it("should throw UnauthenticatedError when JWT verification fails", async () => {
      vi.mocked(verifyJwt).mockResolvedValue(null);

      await expect(userService.getCurrentUser(validToken)).rejects.toThrow(
        UnauthenticatedError
      );
      await expect(userService.getCurrentUser(validToken)).rejects.toThrow(
        "Unauthenticated."
      );
    });

    it("should throw UserNotFoundError when user not found in database", async () => {
      vi.mocked(verifyJwt).mockResolvedValue(validPayload as any);
      vi.mocked(User.findOne).mockResolvedValue(null);

      await expect(userService.getCurrentUser(validToken)).rejects.toThrow(
        UserNotFoundError
      );
      await expect(userService.getCurrentUser(validToken)).rejects.toThrow(
        "User not found."
      );
    });

    it("should throw UserNotFoundError with 404 status code", async () => {
      vi.mocked(verifyJwt).mockResolvedValue(validPayload as any);
      vi.mocked(User.findOne).mockResolvedValue(null);

      try {
        await userService.getCurrentUser(validToken);
      } catch (error: any) {
        expect(error.statusCode).toBe(404);
      }
    });

    it("should verify JWT with provided token", async () => {
      vi.mocked(verifyJwt).mockResolvedValue(validPayload as any);
      vi.mocked(User.findOne).mockResolvedValue(mockUser as any);

      await userService.getCurrentUser(validToken);

      expect(verifyJwt).toHaveBeenCalledWith(validToken);
    });

    it("should convert userId string to ObjectId for database query", async () => {
      vi.mocked(verifyJwt).mockResolvedValue(validPayload as any);
      vi.mocked(User.findOne).mockResolvedValue(mockUser as any);

      await userService.getCurrentUser(validToken);

      expect(User.findOne).toHaveBeenCalledWith({
        _id: expect.any(ObjectId),
      });
    });

    it("should extract userId from JWT payload correctly", async () => {
      const customPayload = {
        payload: {
          userId: mockUser._id,
          email: mockUser.email,
          role: mockUser.role
        },
      };

      vi.mocked(verifyJwt).mockResolvedValue(customPayload as any);
      vi.mocked(User.findOne).mockResolvedValue(mockUser as any);

      await userService.getCurrentUser(validToken);

      const findOneCall = vi.mocked(User.findOne).mock.calls[0][0] as any;
      expect(findOneCall?._id.toString()).toBe(
        mockUser._id.toString()
      );
    });

    it("should return user with all fields from database", async () => {
      vi.mocked(verifyJwt).mockResolvedValue(validPayload as any);
      vi.mocked(User.findOne).mockResolvedValue(mockUser as any);

      const result = await userService.getCurrentUser(validToken);

      expect(result).toHaveProperty("_id");
      expect(result).toHaveProperty("email");
      expect(result).toHaveProperty("firstName");
      expect(result).toHaveProperty("lastName");
      expect(result).toHaveProperty("role");
      expect(result).toHaveProperty("correctAnswers");
      expect(result).toHaveProperty("quizPassed");
    });

    it("should not call User.findOne when JWT verification fails", async () => {
      vi.mocked(verifyJwt).mockResolvedValue(null);

      await expect(userService.getCurrentUser(validToken)).rejects.toThrow();

      expect(User.findOne).not.toHaveBeenCalled();
    });

    it("should not call User.findOne when session is undefined", async () => {
      await expect(userService.getCurrentUser(undefined)).rejects.toThrow();

      expect(User.findOne).not.toHaveBeenCalled();
    });

    it("should handle empty string session", async () => {
      await expect(userService.getCurrentUser("")).rejects.toThrow(
        UnauthenticatedError
      );
    });

    it("should handle malformed JWT payload", async () => {
      const malformedPayload = { payload: {} } as any;
      vi.mocked(verifyJwt).mockResolvedValue(malformedPayload);
      vi.mocked(User.findOne).mockResolvedValue(null);

      await expect(userService.getCurrentUser(validToken)).rejects.toThrow();
    });

    it("should handle different user roles", async () => {
      const adminPayload = {
        payload: {
          userId: mockUserId,
          email: "admin@example.com",
          role: "ADMIN",
        },
      };

      const adminUser = { ...mockUser, role: "ADMIN" };
      vi.mocked(verifyJwt).mockResolvedValue(adminPayload as any);
      vi.mocked(User.findOne).mockResolvedValue(adminUser as any);

      const result = await userService.getCurrentUser(validToken);

      expect(result.role).toBe("ADMIN");
    });

    it("should throw error when verifyJwt rejects", async () => {
      const jwtError = new Error("JWT verification failed");
      vi.mocked(verifyJwt).mockRejectedValue(jwtError);

      await expect(userService.getCurrentUser(validToken)).rejects.toThrow(
        "JWT verification failed"
      );
    });

    it("should throw error when User.findOne rejects", async () => {
      const dbError = new Error("Database error");
      vi.mocked(verifyJwt).mockResolvedValue(validPayload as any);
      vi.mocked(User.findOne).mockRejectedValue(dbError);

      await expect(userService.getCurrentUser(validToken)).rejects.toThrow(
        "Database error"
      );
    });
  });
});