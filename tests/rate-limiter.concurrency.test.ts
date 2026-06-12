import { describe, it, expect, beforeEach } from "vitest";
import rateLimiter from "../src/utils/rate-limiter.js";

describe("Rate Limiter Concurrency & Burst Checks", () => {
  beforeEach(() => {
    rateLimiter.clear();
  });

  it("should accurately handle a synchronous burst execution loop without over-allocating tokens", async () => {
    const key = "burst-client";
    const limit = 10;
    const windowMs = 30000;

    // Simulate 15 requests fired simultaneously within the same event loop tick
    const requests = Array.from({ length: 15 }).map(() => {
      return rateLimiter.isAllowed(key, limit, windowMs);
    });

    const allowedCount = requests.filter(r => r.allowed === true).length;
    const blockedCount = requests.filter(r => r.allowed === false).length;

    expect(allowedCount).toBe(10);
    expect(blockedCount).toBe(5);
    expect(rateLimiter.getCount(key)).toBe(10);
  });

  it("should preserve accurate window state integrity across multi-tiered parallel promises", async () => {
    const key = "concurrent-async-client";
    const limit = 50;
    const windowMs = 50000;

    // Wrap execution blocks inside asynchronous execution chains to verify 
    // memory arrays cleanly process stacked tasks without race/mutation anomalies.
    const runRateLimitCheck = async () => {
      return rateLimiter.isAllowed(key, limit, windowMs);
    };

    // Spin up 60 unresolved asynchronous promises executing concurrently
    const promises = Array.from({ length: 60 }).map(() => runRateLimitCheck());
    const results = await Promise.all(promises);

    const allowedResults = results.filter(res => res.allowed);
    const blockedResults = results.filter(res => !res.allowed);

    expect(allowedResults.length).toBe(50);
    expect(blockedResults.length).toBe(10);
    expect(rateLimiter.getCount(key)).toBe(50);
  });
});