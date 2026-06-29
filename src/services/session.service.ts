import { getRedisClient, isRedisConnected } from '../db/redis.js';
import { randomUUID } from 'crypto';
import redisConfig from '../config/redis.config.js';

export interface SessionData {
  userId: string;
  role: string;
  createdAt: string;
}

export const createSession = async (
  userId: string,
  role: string
): Promise<string | null> => {
  if (!isRedisConnected()) return null;

  try {
    const client = getRedisClient();
    if (!client) return null;

    const sessionId = randomUUID();
    const sessionData: SessionData = {
      userId,
      role,
      createdAt: new Date().toISOString(),
    };

    const key = `session:${sessionId}`;
    await client.set(key, sessionData, { ex: redisConfig.ttl.session });

    return sessionId;
  } catch (error) {
    console.error('Error creating session:', error);
    return null;
  }
};

export const getSession = async (sessionId: string): Promise<SessionData | null> => {
  if (!isRedisConnected()) return null;

  try {
    const client = getRedisClient();
    if (!client) return null;

    const key = `session:${sessionId}`;
    const data = await client.get<SessionData>(key);

    return data ?? null;
  } catch (error) {
    console.error(`Error getting session ${sessionId}:`, error);
    return null;
  }
};

export const destroySession = async (sessionId: string): Promise<boolean> => {
  if (!isRedisConnected()) return false;

  try {
    const client = getRedisClient();
    if (!client) return false;

    const key = `session:${sessionId}`;
    await client.del(key);

    return true;
  } catch (error) {
    console.error(`Error destroying session ${sessionId}:`, error);
    return false;
  }
};

export const refreshSession = async (sessionId: string): Promise<boolean> => {
  if (!isRedisConnected()) return false;

  try {
    const client = getRedisClient();
    if (!client) return false;

    const key = `session:${sessionId}`;
    const exists = await client.exists(key);
    if (!exists) return false;

    await client.expire(key, redisConfig.ttl.session);
    return true;
  } catch (error) {
    console.error(`Error refreshing session ${sessionId}:`, error);
    return false;
  }
};
