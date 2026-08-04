const { getRedis } = require('../config/redis');

const BUCKET_CAPACITY = 10;
const REFILL_RATE = 1;
const REFILL_INTERVAL_SECONDS = 6;

async function checkRateLimit(apiKey) {
  const redis = getRedis();
  const key = `ratelimit:${apiKey}`;

  const now = Math.floor(Date.now() / 1000);

  const data = await redis.hGetAll(key);

  let tokens = data.tokens ? parseFloat(data.tokens) : BUCKET_CAPACITY;
  let lastRefill = data.lastRefill ? parseInt(data.lastRefill) : now;

  const secondsPassed = now - lastRefill;
  const tokensToAdd = Math.floor(secondsPassed / REFILL_INTERVAL_SECONDS) * REFILL_RATE;
  tokens = Math.min(BUCKET_CAPACITY, tokens + tokensToAdd);

  if (tokens < 1) {
    await redis.hSet(key, { tokens: tokens.toString(), lastRefill: now.toString() });
    return { allowed: false, remaining: Math.floor(tokens) };
  }

  tokens -= 1;

  await redis.hSet(key, { tokens: tokens.toString(), lastRefill: now.toString() });

  return { allowed: true, remaining: Math.floor(tokens) };
}

module.exports = { checkRateLimit };