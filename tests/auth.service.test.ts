import { describe, it, expect, beforeEach, vi } from "vitest";
import AuthService from "../src/services/auth.service.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../src/models/user.model.js";
import authConfig from "../src/config/auth.config.js";
import InvalidCredentialError from "../src/errors/invalid-credential.error.js";
import UserAlreadyExistError from "../src/errors/user-already-exist.error.js";

vi.mock("bcrypt");
vi.mock("jsonwebtoken");
vi.mock("../src/models/user.model.js", () => {
  const MockUserClass = vi.fn().mockImplementation(function (data) {
    return {
      ...data,
      _id: "6a265e47843abfcf17bc8d9b",
      createdAt: new Date(),
      save: vi.fn().mockResolvedValue({}),
    };
  });

  (MockUserClass as any).findOne = vi.fn();

  return {
    default: MockUserClass
  };
});

vi.mock("../src/config/auth.config.js");

describe("AuthService", () => {
  let authService: AuthService;
  const mockJwtSecret = "test-secret-key";
  const mockJwtExpires = "7d";

  beforeEach(() => {
    authService = new AuthService();
    vi.clearAllMocks();

    (authConfig as any).jwtSecret = mockJwtSecret;
    (authConfig as any).jwtTokenExpires = mockJwtExpires;
  });

  describe("register", () => {
    const registerData = {
      email: "newuser@example.com",
      firstName: "John",
      lastName: "Doe",
      password: "password123",
      role: "USER",
    };

    it("should throw UserAlreadyExistError when user already exists", async () => {
      vi.mocked(User.findOne).mockResolvedValue({ email: "newuser@example.com" } as any);

      await expect(authService.register(registerData)).rejects.toThrow(
        UserAlreadyExistError
      );
      await expect(authService.register(registerData)).rejects.toThrow(
        "User already exist."
      );
    });

    it("should hash password with bcrypt before saving", async () => {
      const mockSalt = "test-salt";
      const mockHash = "hashed-password";

      vi.mocked(User.findOne).mockResolvedValue(null);
      vi.mocked(bcrypt.genSalt).mockResolvedValue(mockSalt as any);
      vi.mocked(bcrypt.hash).mockResolvedValue(mockHash as any);
      vi.mocked(jwt.sign).mockReturnValue("test-token" as any);

      const token = await authService.register(registerData);

      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith(registerData.password.toString(), mockSalt);
      expect(token).toBe("test-token");
    });

    it("should create new user with correct data", async () => {
      const mockSalt = "test-salt";
      const mockHash = "hashed-password";

      vi.mocked(User.findOne).mockResolvedValue(null);
      vi.mocked(bcrypt.genSalt).mockResolvedValue(mockSalt as any);
      vi.mocked(bcrypt.hash).mockResolvedValue(mockHash as any);
      vi.mocked(jwt.sign).mockReturnValue("test-token" as any);

      await authService.register(registerData);

      expect(User).toHaveBeenCalledWith(
        expect.objectContaining({
          email: registerData.email,
          firstName: registerData.firstName,
          lastName: registerData.lastName,
          role: registerData.role,
          password: mockHash,
          createdAt: expect.any(Date),
        })
      )
    });

    it("should sign JWT token with correct payload", async () => {
      const mockSalt = "test-salt";
      const mockHash = "hashed-password";

      vi.mocked(User.findOne).mockResolvedValue(null);
      vi.mocked(bcrypt.genSalt).mockResolvedValue(mockSalt as any);
      vi.mocked(bcrypt.hash).mockResolvedValue(mockHash as any);
      vi.mocked(jwt.sign).mockReturnValue("test-token" as any);

      await authService.register(registerData);

      const createdInstance = vi.mocked(User).mock.results[0].value;
      const actualGeneratedId = createdInstance._id;

      expect(jwt.sign).toHaveBeenCalledWith(
        {
          user: {
            id: actualGeneratedId,
            role: registerData.role,
          },
        },
        mockJwtSecret,
        { expiresIn: Number(mockJwtExpires) }
      );
    });

    it("should return JWT token on successful registration", async () => {
      const mockSalt = "test-salt";
      const mockHash = "hashed-password";
      const expectedToken = "jwt-token-123";

      vi.mocked(User.findOne).mockResolvedValue(null);
      vi.mocked(bcrypt.genSalt).mockResolvedValue(mockSalt as any);
      vi.mocked(bcrypt.hash).mockResolvedValue(mockHash as any);
      vi.mocked(jwt.sign).mockReturnValue(expectedToken as any);

      const token = await authService.register(registerData);

      expect(token).toBe(expectedToken);
    });

    it("should throw InvalidCredentialError when JWT signing fails", async () => {
      const mockSalt = "test-salt";
      const mockHash = "hashed-password";

      vi.mocked(User.findOne).mockResolvedValue(null);
      vi.mocked(bcrypt.genSalt).mockResolvedValue(mockSalt as any);
      vi.mocked(bcrypt.hash).mockResolvedValue(mockHash as any);
      vi.mocked(jwt.sign).mockReturnValue(null as any);

      await expect(authService.register(registerData)).rejects.toThrow(
        InvalidCredentialError
      );
      await expect(authService.register(registerData)).rejects.toThrow(
        "Invalid Credentials."
      );
    });
  });

  describe("login", () => {
    const loginData = {
      email: "user@example.com",
      password: "password123",
    };

    it("should throw InvalidCredentialError when user not found", async () => {
      vi.mocked(User.findOne).mockResolvedValue(null);

      await expect(authService.login(loginData)).rejects.toThrow(
        InvalidCredentialError
      );
      await expect(authService.login(loginData)).rejects.toThrow(
        "Invalid Credentials."
      );
    });

    it("should throw InvalidCredentialError when password does not match", async () => {
      const mockUser = {
        _id: "user-123",
        email: loginData.email,
        password: "hashed-password",
        role: "USER",
      };

      vi.mocked(User.findOne).mockResolvedValue(mockUser as any);
      vi.mocked(bcrypt.compare).mockResolvedValue(false as any);

      await expect(authService.login(loginData)).rejects.toThrow(
        InvalidCredentialError
      );
      await expect(authService.login(loginData)).rejects.toThrow(
        "Invalid Credentials."
      );
    });

    it("should compare password using bcrypt", async () => {
      const mockUser = {
        _id: "user-123",
        email: loginData.email,
        password: "hashed-password",
        role: "USER",
      };

      vi.mocked(User.findOne).mockResolvedValue(mockUser as any);
      vi.mocked(bcrypt.compare).mockResolvedValue(true as any);
      vi.mocked(jwt.sign).mockReturnValue("test-token" as any);

      await authService.login(loginData);

      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginData.password,
        mockUser.password
      );
    });

    it("should sign JWT token with correct payload on successful login", async () => {
      const mockUser = {
        _id: "user-123",
        email: loginData.email,
        password: "hashed-password",
        role: "ADMIN",
      };

      vi.mocked(User.findOne).mockResolvedValue(mockUser as any);
      vi.mocked(bcrypt.compare).mockResolvedValue(true as any);
      vi.mocked(jwt.sign).mockReturnValue("test-token" as any);

      await authService.login(loginData);

      expect(jwt.sign).toHaveBeenCalledWith(
        {
          userId: "user-123",
          email: loginData.email,
          role: "ADMIN",
        },
        mockJwtSecret,
        { expiresIn: Number(mockJwtExpires) }
      );
    });

    it("should return JWT token on successful login", async () => {
      const expectedToken = "jwt-login-token-456";
      const mockUser = {
        _id: "user-123",
        email: loginData.email,
        password: "hashed-password",
        role: "USER",
      };

      vi.mocked(User.findOne).mockResolvedValue(mockUser as any);
      vi.mocked(bcrypt.compare).mockResolvedValue(true as any);
      vi.mocked(jwt.sign).mockReturnValue(expectedToken as any);

      const token = await authService.login(loginData);

      expect(token).toBe(expectedToken);
    });

    it("should throw InvalidCredentialError when JWT signing fails", async () => {
      const mockUser = {
        _id: "user-123",
        email: loginData.email,
        password: "hashed-password",
        role: "USER",
      };

      vi.mocked(User.findOne).mockResolvedValue(mockUser as any);
      vi.mocked(bcrypt.compare).mockResolvedValue(true as any);
      vi.mocked(jwt.sign).mockReturnValue(null as any);

      await expect(authService.login(loginData)).rejects.toThrow(
        InvalidCredentialError
      );
      await expect(authService.login(loginData)).rejects.toThrow(
        "Invalid Credentials."
      );
    });

    it("should find user by email", async () => {
      const mockUser = {
        _id: "user-123",
        email: loginData.email,
        password: "hashed-password",
        role: "USER",
      };

      vi.mocked(User.findOne).mockResolvedValue(mockUser as any);
      vi.mocked(bcrypt.compare).mockResolvedValue(true as any);
      vi.mocked(jwt.sign).mockReturnValue("test-token" as any);

      await authService.login(loginData);

      expect(User.findOne).toHaveBeenCalledWith({ email: loginData.email });
    });
  });
});