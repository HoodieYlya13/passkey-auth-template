import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { SERVERLESS } from "@/utils/config/config.client";
import { prisma } from "@/utils/config/prisma";
import { Redis } from "@upstash/redis";

export async function GET() {
  try {
    const headersList = await headers();
    const authHeader = headersList.get("Authorization");

    const cronSecret = process.env.CRON_SECRET;
    if (!cronSecret)
      return NextResponse.json(
        { error: "CRON_SECRET environment variable is not configured." },
        { status: 500 },
      );

    if (authHeader !== `Bearer ${cronSecret}`)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const results: {
      postgres?: string;
      redis?: string;
      cleanup?: string;
    } = {};

    const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (redisUrl && redisToken) {
      try {
        const redis = new Redis({ url: redisUrl, token: redisToken });
        await redis.ping();
        results.redis = "Redis pinged successfully.";
      } catch (err: unknown) {
        if (err instanceof Error)
          results.redis = `Redis ping failed: ${err.message}`;
        else results.redis = "Redis ping failed: Unknown error";
      }
    } else results.redis = "Redis credentials not found, ping skipped.";

    if (SERVERLESS) {
      try {
        await prisma.$queryRaw`SELECT 1`;
        results.postgres = "Postgres pinged successfully.";
      } catch (err: unknown) {
        if (err instanceof Error)
          results.postgres = `Postgres ping failed: ${err.message}`;
        else results.postgres = "Postgres ping failed: Unknown error";
      }

      try {
        const unconfirmedCutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const deleteResult = await prisma.user.deleteMany({
          where: {
            username: null,
            createdAt: {
              lt: unconfirmedCutoff,
            },
            credentials: {
              none: {},
            },
          },
        });

        results.cleanup = `Wiped ${deleteResult.count} unconfirmed/inactive users.`;
      } catch (err: unknown) {
        if (err instanceof Error)
          results.cleanup = `Cleanup failed: ${err.message}`;
        else results.cleanup = "Cleanup failed: Unknown error";
      }
    } else {
      results.postgres = "Postgres ping skipped (not in Serverless mode).";
      results.cleanup = "Cleanup skipped (not in Serverless mode).";
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      results,
    });
  } catch (error: unknown) {
    if (error instanceof Error)
      return NextResponse.json(
        { error: "Internal Server Error", details: error.message },
        { status: 500 },
      );
    return NextResponse.json(
      { error: "Internal Server Error", details: "Unknown error" },
      { status: 500 },
    );
  }
}
