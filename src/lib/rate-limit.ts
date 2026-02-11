import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

// 6 requests per IP per day (24 hours)
export const chatLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(6, "86400 s"),
  prefix: "ratelimit:chat",
});

// 5 requests per IP per hour
export const leadsLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(5, "3600 s"),
  prefix: "ratelimit:leads",
});
