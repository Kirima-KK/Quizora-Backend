import dotenv from 'dotenv';

dotenv.config();

const redisConfig = {
  url: process.env.KV_REST_API_URL || '',
  token: process.env.KV_REST_API_TOKEN || '',
  ttl: {
    quiz: Number(process.env.CACHE_TTL_QUIZ) || 30 * 60,
    user: Number(process.env.CACHE_TTL_USER) || 15 * 60,
    history: Number(process.env.CACHE_TTL_HISTORY) || 10 * 60,
    session: Number(process.env.SESSION_TTL) || 24 * 60 * 60,
  },
};

export default redisConfig;
