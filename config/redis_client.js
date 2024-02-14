const Redis = require("redis");

let redis;

(async function () {
  redis = Redis.createClient({
    url: `rediss://${process.env.REDIS_HOST_NAME}:6380`,
    password: process.env.REDIS_ACCESS_KEY,
  });

  try {
    await redis.connect();
  } catch (error) {
    console.error("Failed to connect to Redis", error);
  }
})();

module.exports = redis;
