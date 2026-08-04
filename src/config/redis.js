const { createClient } = require('redis');

let redisClient;

async function connectRedis() {
  redisClient = createClient({
    url: process.env.REDIS_URL,
  });

  redisClient.on('error', (err) => console.error('Redis error:', err));

  await redisClient.connect();
  console.log('Redis connected successfully');

  return redisClient;
}

function getRedis() {
  if (!redisClient) {
    throw new Error('Redis not connected. Call connectRedis first.');
  }
  return redisClient;
}

module.exports = { connectRedis, getRedis };