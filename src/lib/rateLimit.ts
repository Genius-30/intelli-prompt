import { NextRequest, NextResponse } from "next/server";

import { redis } from "./redis";

const MAX_TOKENS = 10;
const REFILL_RATE = 1;
const INTERVAL = 1000;

export async function rateLimit(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";
  const key = `rate-limit:${ip}`;

  const tokenData = await redis.hgetall(key);
  let tokens = parseInt(tokenData.tokens || `${MAX_TOKENS}`);
  let lastRefill = parseInt(tokenData.lastRefill || `${Date.now()}`);
  const now = Date.now();

  const elapsed = now - lastRefill;
  const refillAmount = Math.floor(elapsed / INTERVAL);

  tokens = Math.min(MAX_TOKENS, tokens + refillAmount);
  lastRefill = now;

  if (tokens > 0) {
    await redis.hmset(key, { tokens: tokens - 1, lastRefill });
    return null;
  } else {
    return NextResponse.json(
      { error: "Too many requests, slow down!" },
      { status: 429 }
    );
  }
}
