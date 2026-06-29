import { getRedisClient, isRedisConnected } from '../db/redis.js';

export const getFromCache = async <T>(key: string): Promise<T | null> => {
  if (!isRedisConnected()) return null;

  try {
    const client = getRedisClient();
    if (!client) return null;

    const value = await client.get<T>(key);
    return value ?? null;
  } catch (error) {
    console.error(`Cache get error for key ${key}:`, error);
    return null;
  }
};

export const setInCache = async (
  key: string,
  value: unknown,
  ttl?: number
): Promise<boolean> => {
  if (!isRedisConnected()) return false;

  try {
    const client = getRedisClient();
    if (!client) return false;

    if (ttl) {
      await client.set(key, value, { ex: ttl });
    } else {
      await client.set(key, value);
    }

    return true;
  } catch (error) {
    console.error(`Cache set error for key ${key}:`, error);
    return false;
  }
};

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

export const invalidateCachePattern = async (pattern: string): Promise<number> => {
  if (!isRedisConnected()) return 0;

  try {
    const client = getRedisClient();
    if (!client) return 0;

    const keys = await client.keys(pattern);
    if (keys.length === 0) return 0;

    const deleted = await client.del(...keys);
    return deleted;
  } catch (error) {
    console.error(`Cache pattern invalidation error for pattern ${pattern}:`, error);
    return 0;
  }
};

export const isCacheAvailable = (): boolean => {
  return isRedisConnected();
};

export const withCache = async <T>(
  key: string,
  fn: () => Promise<T>,
  ttl?: number
): Promise<T> => {
  const cached = await getFromCache<T>(key);
  if (cached !== null) {
    return cached;
  }

  const result = await fn();
  await setInCache(key, result, ttl);
  return result;
};
