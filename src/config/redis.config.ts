import dotenv from 'dotenv';

dotenv.config();

const redisConfig = {
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  ttl: {
    quiz: Number(process.env.CACHE_TTL_QUIZ) || 30 * 60, // 30 minutes
    user: Number(process.env.CACHE_TTL_USER) || 15 * 60, // 15 minutes
    history: Number(process.env.CACHE_TTL_HISTORY) || 10 * 60, // 10 minutes
    session: Number(process.env.SESSION_TTL) || 24 * 60 * 60, // 24 hours
  },
  options: {
    socket: {
      reconnectStrategy: (retries: number) => {
        if (retries > 10) return new Error('Redis retries exceeded');
        return Math.min(retries * 50, 500);
      },
    },
  },
};

export default redisConfig;
