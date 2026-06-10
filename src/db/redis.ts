import { createClient, RedisClientType } from 'redis';
import redisConfig from '../config/redis.config.js';

let redisClient: RedisClientType | null = null;
let isConnected = false;

export const initializeRedis = async () => {
  try {
    redisClient = createClient({
      url: redisConfig.url,
      ...redisConfig.options,
    }) as RedisClientType;

    redisClient.on('error', (err) => console.error('Redis Client Error:', err));
    redisClient.on('connect', () => console.log('Redis Client Connected'));
    redisClient.on('reconnecting', () => console.log('Redis Client Reconnecting'));

    await redisClient.connect();
    isConnected = true;
    console.log('Redis initialized and connected');
  } catch (error) {
    console.error('Failed to initialize Redis:', error);
    isConnected = false;
  }
};

export const getRedisClient = (): RedisClientType | null => redisClient;

export const isRedisConnected = (): boolean => isConnected;

export const closeRedis = async () => {
  if (redisClient) {
    await redisClient.quit();
    isConnected = false;
    console.log('Redis connection closed');
  }
};
