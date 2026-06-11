/**
 * In-memory rate limiter using sliding window algorithm
 * Stores timestamps of requests per key and checks if new request exceeds limit
 */

interface RateLimitStore {
  [key: string]: number[]; // Array of request timestamps in milliseconds
}

class RateLimiter {
  private store: RateLimitStore = {};
  private cleanupIntervalMs = 5 * 60 * 1000; // 5 minutes
  private cleanupTimer: NodeJS.Timeout | null = null;

  constructor() {
    // Start periodic cleanup of expired entries
    this.startCleanup();
  }

  /**
   * Check if a request is allowed under the rate limit
   * @param key - Unique identifier (IP, user ID, etc.)
   * @param limit - Max requests allowed
   * @param windowMs - Time window in milliseconds
   * @returns Object with allowed boolean and remaining count
   */
  public isAllowed(key: string, limit: number, windowMs: number): { allowed: boolean; remaining: number; retryAfter: number } {
    const now = Date.now();
    const windowStart = now - windowMs;

    // Initialize key if not exists
    if (!this.store[key]) {
      this.store[key] = [];
    }

    // Remove timestamps outside the window (sliding window cleanup)
    this.store[key] = this.store[key].filter(timestamp => timestamp > windowStart);

    // Check if limit exceeded
    const currentCount = this.store[key].length;
    const allowed = currentCount < limit;

    if (allowed) {
      // Add current request timestamp
      this.store[key].push(now);
    }

    // Calculate retry-after time (seconds until oldest request exits the window)
    const retryAfter = this.store[key].length > 0 
      ? Math.ceil((this.store[key][0] + windowMs - now) / 1000)
      : 1;

    const remaining = Math.max(0, limit - this.store[key].length);

    return { allowed, remaining, retryAfter };
  }

  /**
   * Get current request count for a key
   */
  public getCount(key: string): number {
    return this.store[key]?.length ?? 0;
  }

  /**
   * Reset rate limit for a key
   */
  public reset(key: string): void {
    if (this.store[key]) {
      this.store[key] = [];
    }
  }

  /**
   * Clear all rate limit data
   */
  public clear(): void {
    this.store = {};
  }

  /**
   * Start periodic cleanup of all expired entries
   */
  private startCleanup(): void {
    if (this.cleanupTimer) return;

    this.cleanupTimer = setInterval(() => {
      const now = Date.now();
      let keysToDelete: string[] = [];

      // Scan all keys and clean up old timestamps
      for (const key in this.store) {
        // Remove very old entries (older than 10 minutes to be safe)
        const tenMinutesAgo = now - 10 * 60 * 1000;
        this.store[key] = this.store[key].filter(timestamp => timestamp > tenMinutesAgo);

        // Mark empty keys for deletion
        if (this.store[key].length === 0) {
          keysToDelete.push(key);
        }
      }

      // Delete empty keys
      keysToDelete.forEach(key => delete this.store[key]);
    }, this.cleanupIntervalMs);
  }

  /**
   * Stop cleanup timer (useful for testing)
   */
  public stopCleanup(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }
}

// Export singleton instance
export default new RateLimiter();
