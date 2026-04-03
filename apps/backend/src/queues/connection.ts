import { RedisOptions } from "ioredis";

export const redisConnection: RedisOptions = {
  host: process.env.REDIS_HOST || "redis",
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
};
