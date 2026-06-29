class RateLimiter {
  private store: Record<string, number[]> = {};
  private cleanupIntervalMs = 5 * 60 * 1000;
  private cleanupTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.startCleanup();
  }

  public isAllowed(key: string, limit: number, windowMs: number): { allowed: boolean; remaining: number; retryAfter: number } {
    const now = Date.now();
    const windowStart = now - windowMs;

    if (!this.store[key]) {
      this.store[key] = [];
    }

    this.store[key] = this.store[key].filter(timestamp => timestamp > windowStart);

    const allowed = this.store[key].length < limit;

    if (allowed) {
      this.store[key].push(now);
    }

    const retryAfter = this.store[key].length > 0
      ? Math.ceil((this.store[key][0] + windowMs - now) / 1000)
      : 1;

    const remaining = Math.max(0, limit - this.store[key].length);

    return { allowed, remaining, retryAfter };
  }

  public getCount(key: string): number {
    return this.store[key]?.length ?? 0;
  }

  public reset(key: string): void {
    if (this.store[key]) {
      this.store[key] = [];
    }
  }

  public clear(): void {
    this.store = {};
  }

  private startCleanup(): void {
    if (this.cleanupTimer) return;

    this.cleanupTimer = setInterval(() => {
      const now = Date.now();
      const tenMinutesAgo = now - 10 * 60 * 1000;
      const keysToDelete: string[] = [];

      for (const key in this.store) {
        this.store[key] = this.store[key].filter(timestamp => timestamp > tenMinutesAgo);

        if (this.store[key].length === 0) {
          keysToDelete.push(key);
        }
      }

      keysToDelete.forEach(key => delete this.store[key]);
    }, this.cleanupIntervalMs);
  }

  public stopCleanup(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }
}

export default new RateLimiter();
