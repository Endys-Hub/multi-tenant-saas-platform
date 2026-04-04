import { RedisOptions } from "ioredis";

export const redisConnection = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  tls: {}, // Upstash
  maxRetriesPerRequest: null, // no crash
};
