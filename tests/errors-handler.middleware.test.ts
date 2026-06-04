import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import ErrorHandler from "../src/middleware/errors-handler.middleware.js";
import { NextFunction, Request, Response } from "express";

describe("ErrorHandler middleware", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;
  let consoleErrorSpy: any;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    mockNext = vi.fn();
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("should log the error to console", () => {
    const testError = new Error("Test error");
    ErrorHandler(testError, mockReq as Request, mockRes as Response, mockNext);

    expect(consoleErrorSpy).toHaveBeenCalledWith(testError);
  });

  it("should use statusCode from error object if provided", () => {
    const customError = new Error("Custom error");
    (customError as any).statusCode = 404;

    ErrorHandler(customError, mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(404);
  });

  it("should default to 500 status code when statusCode is not provided", () => {
    const error = new Error("Server error");
    ErrorHandler(error, mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);
  });

  it("should include error message in response", () => {
    const error = new Error("Something went wrong");
    ErrorHandler(error, mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Something went wrong",
    });
  });

  it("should use default message when error has no message", () => {
    const error = { statusCode: 400 };
    ErrorHandler(error, mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Internal Server Error",
    });
  });

  it("should handle plain error objects without message property", () => {
    const error = {};
    ErrorHandler(error, mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Internal Server Error",
    });
  });

  it("should chain res.status().json() correctly", () => {
    const error = new Error("Test");
    (error as any).statusCode = 403;

    ErrorHandler(error, mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Test",
    });
  });

  it("should handle various HTTP status codes", () => {
    const statusCodes = [400, 401, 403, 404, 422, 500, 503];

    statusCodes.forEach((code) => {
      mockRes.status = vi.fn().mockReturnThis();
      mockRes.json = vi.fn().mockReturnThis();

      const error = new Error(`Error ${code}`);
      (error as any).statusCode = code;

      ErrorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(code);
    });
  });

  it("should not call next() function", () => {
    const error = new Error("Test error");
    ErrorHandler(error, mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should handle errors with empty message string", () => {
    const error = { statusCode: 400, message: "" };
    ErrorHandler(error, mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Internal Server Error",
    });
  });

  it("should handle null or undefined error objects gracefully", () => {
    ErrorHandler(null, mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Internal Server Error",
    });
  });
});