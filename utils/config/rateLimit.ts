import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { getUserIp } from "../cookies/cookies.server";
import { ERROR_CODES } from "../errors";

function getRedisClient() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    if (process.env.NODE_ENV === "development")
      return console.warn(
        "UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN not found. Rate limiting will be disabled."
      );

    throw new Error(
      "UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN are required"
    );
  }

  return new Redis({
    url,
    token,
  });
}

function getLimiter(identifier: string, redis: Redis) {
  switch (true) {
    case identifier.startsWith("auth"):
      return new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, "10 s"),
      });
    default:
      return new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(60, "1 m"),
      });
  }
}

export async function checkRateLimit(identifier: string) {
  const isTesting = process.env.NEXT_PUBLIC_TESTING_MODE === "true";
  const shouldLimit = isTesting ? identifier === "authTestingMode" : true;

  if (shouldLimit) {
    const redis = getRedisClient();

    if (!redis) return;

    const ip = await getUserIp();
    const limiter = getLimiter(identifier, redis);
    const { success } = await limiter.limit(`${identifier}-${ip}`);

    if (!success) throw new Error(ERROR_CODES.TOO_MANY_REQUESTS);
  }
}
