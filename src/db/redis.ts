import { Redis } from '@upstash/redis';
import redisConfig from '../config/redis.config.js';

let redisClient: Redis | null = null;

export const initializeRedis = () => {
  try {
    if (!redisConfig.url || !redisConfig.token) {
      console.warn('Upstash Redis credentials not configured — caching disabled');
      return;
    }

    redisClient = new Redis({
      url: redisConfig.url,
      token: redisConfig.token,
    });

    console.log('Upstash Redis client initialized');
  } catch (error) {
    console.error('Failed to initialize Upstash Redis:', error);
    redisClient = null;
  }
};

export const getRedisClient = (): Redis | null => redisClient;

export const isRedisConnected = (): boolean => redisClient !== null;

export const closeRedis = () => {
  redisClient = null;
};
