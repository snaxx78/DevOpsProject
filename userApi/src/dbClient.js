var redis = require("redis");
const configure = require("./configure");

const config = configure();

console.log("Searching redis:", process.env.REDIS_HOST, process.env.REDIS_PORT);

var db = redis.createClient({
  host: process.env.REDIS_HOST || config.redis.host,
  port: process.env.REDIS_PORT || config.redis.port,
  retry_strategy: () => {
    console.log("Retrying connection to Redis...");
    return new Error("Retry time exhausted");
  },
});

// Capture connection event
db.on("connect", function () {
  console.log("Connected to Redis successfully");
});

process.on("SIGINT", function () {
  console.log("Closing Redis connection...");
  db.quit();
  process.exit();
});

process.on("SIGTERM", function () {
  console.log("Closing Redis connection...");
  db.quit();
  process.exit();
});

module.exports = db;
