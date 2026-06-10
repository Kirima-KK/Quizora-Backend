import { getRedisClient, isRedisConnected } from '../db/redis.js';

interface CacheOptions {
  ttl?: number;
}

/**
 * Get a value from cache
 * @param key Cache key
 * @returns Cached value or null
 */
export const getFromCache = async <T>(key: string): Promise<T | null> => {
  if (!isRedisConnected()) return null;

  try {
    const client = getRedisClient();
    if (!client) return null;

    const value = await client.get(key);
    if (!value) return null;

    return JSON.parse(value) as T;
  } catch (error) {
    console.error(`Cache get error for key ${key}:`, error);
    return null;
  }
};

/**
 * Set a value in cache
 * @param key Cache key
 * @param value Value to cache
 * @param ttl Time to live in seconds (optional)
 */
export const setInCache = async (
  key: string,
  value: any,
  ttl?: number
): Promise<boolean> => {
  if (!isRedisConnected()) return false;

  try {
    const client = getRedisClient();
    if (!client) return false;

    const serialized = JSON.stringify(value);

    if (ttl) {
      await client.setEx(key, ttl, serialized);
    } else {
      await client.set(key, serialized);
    }

    return true;
  } catch (error) {
    console.error(`Cache set error for key ${key}:`, error);
    return false;
  }
};

/**
 * Delete a cache key
 * @param key Cache key
 */
export const invalidateCache = async (key: string): Promise<boolean> => {
  if (!isRedisConnected()) return false;

  try {
    const client = getRedisClient();
    if (!client) return false;

    await client.del(key);
    return true;
  } catch (error) {
    console.error(`Cache invalidate error for key ${key}:`, error);
    return false;
  }
};

/**
 * Delete cache keys matching a pattern
 * @param pattern Pattern to match (e.g., "quiz:*")
 */
export const invalidateCachePattern = async (pattern: string): Promise<number> => {
  if (!isRedisConnected()) return 0;

  try {
    const client = getRedisClient();
    if (!client) return 0;

    const keys = await client.keys(pattern);
    if (keys.length === 0) return 0;

    const deleted = await client.del(keys);
    return deleted;
  } catch (error) {
    console.error(`Cache pattern invalidation error for pattern ${pattern}:`, error);
    return 0;
  }
};

/**
 * Check if Redis is available
 */
export const isCacheAvailable = (): boolean => {
  return isRedisConnected();
};

/**
 * Wrapper function to cache async operations
 * @param key Cache key
 * @param fn Async function to execute
 * @param ttl Time to live in seconds
 * @returns Result from cache or function execution
 */
export const withCache = async <T>(
  key: string,
  fn: () => Promise<T>,
  ttl?: number
): Promise<T> => {
  // Try to get from cache first
  const cached = await getFromCache<T>(key);
  if (cached !== null) {
    console.log(`Cache hit for key: ${key}`);
    return cached;
  }
  
  // Execute function and cache result
  console.log(`Cache miss for key: ${key}. Executing function...`);
  const result = await fn();
  await setInCache(key, result, ttl);
  return result;
};
