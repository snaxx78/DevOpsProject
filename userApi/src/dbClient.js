var redis = require("redis");
const configure = require("./configure");

const config = configure();
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

// Capture error event
db.on("error", function (err) {
  console.error("Redis connection error: " + err);
});

process.on("SIGINT", function () {
  db.quit();
});

module.exports = db;
