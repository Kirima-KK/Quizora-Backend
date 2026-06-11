/**
 * Rate limiting configuration for different endpoint types
 */

export const rateLimitConfig = {
  /**
   * Public endpoints (register, login, logout)
   * 10 requests per minute per IP
   */
  publicEndpoints: {
    limit: 10,
    windowMs: 60 * 1000, // 1 minute
  },

  /**
   * Authenticated endpoints (quiz, quiz-history, user)
   * 60 requests per minute per user
   */
  authenticatedEndpoints: {
    limit: 60,
    windowMs: 60 * 1000, // 1 minute
  },
};
