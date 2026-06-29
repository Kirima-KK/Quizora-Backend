import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import {
  getFromCache,
  setInCache,
  invalidateCache,
  withCache,
  isCacheAvailable,
} from '../src/utils/cache.util.js';
import { initializeRedis, closeRedis } from '../src/db/redis.js';

vi.mock('../src/db/redis.js', () => {
  const mockStore = new Map<string, unknown>();
  const mockClient = {
    get: vi.fn(async (key: string) => mockStore.get(key) ?? null),
    set: vi.fn(async (key: string, val: unknown) => { mockStore.set(key, val); }),
    del: vi.fn(async (...keys: string[]) => {
      keys.forEach(k => mockStore.delete(k));
      return keys.length;
    }),
    keys: vi.fn(async () => Array.from(mockStore.keys())),
  };
  return {
    initializeRedis: vi.fn(),
    closeRedis: vi.fn(),
    getRedisClient: () => mockClient,
    isRedisConnected: () => true,
  };
});

describe('Cache Utility', () => {
  beforeAll(async () => {
    await initializeRedis();
  });

  afterAll(async () => {
    await closeRedis();
  });

  it('should set and get a value from cache', async () => {
    const key = 'test:key';
    const value = { message: 'test value', data: [1, 2, 3] };

    await setInCache(key, value, 60);
    const cached = await getFromCache(key);

    expect(cached).toEqual(value);

    await invalidateCache(key);
  });

  it('should return null for non-existent keys', async () => {
    const cached = await getFromCache('non:existent:key');
    expect(cached).toBeNull();
  });

  it('should invalidate a cache key', async () => {
    const key = 'test:key:to:delete';
    const value = { test: 'data' };

    await setInCache(key, value, 60);
    expect(await getFromCache(key)).toEqual(value);

    await invalidateCache(key);
    expect(await getFromCache(key)).toBeNull();
  });

  it('should use withCache wrapper to cache async operations', async () => {
    const key = 'test:wrapper:key';
    let executionCount = 0;

    const asyncFn = async () => {
      executionCount++;
      return { value: 'computed', count: executionCount };
    };

    const result1 = await withCache(key, asyncFn, 60);
    expect(result1.count).toBe(1);

    const result2 = await withCache(key, asyncFn, 60);
    expect(result2.count).toBe(1);
    expect(result2).toEqual(result1);

    await invalidateCache(key);
  });

  it('should return cache availability status', () => {
    const available = isCacheAvailable();
    expect(typeof available).toBe('boolean');
  });
});
