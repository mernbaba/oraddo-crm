// config/redisClient.js
const redis = require("redis");

const redisClient = redis.createClient({
    url: "redis://localhost:6379", // Update with your Redis server URL
});

redisClient.connect()
    .then(() => console.log("Connected to Redis"))
    .catch((err) => console.error("Redis connection error:", err));

module.exports = redisClient;
