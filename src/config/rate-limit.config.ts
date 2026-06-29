export const rateLimitConfig = {
  publicEndpoints: {
    limit: 10,
    windowMs: 60 * 1000,
  },

  authenticatedEndpoints: {
    limit: 60,
    windowMs: 60 * 1000,
  },
};
