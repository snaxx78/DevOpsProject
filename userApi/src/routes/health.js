const express = require("express");
const db = require("../dbClient");

const healthRouter = express.Router();

healthRouter
  /**
   * @swagger
   * /health/api:
   *   get:
   *     summary: Check the health status of the application
   *     description: Returns the health status, uptime, and timestamp of the application.
   *     responses:
   *       200:
   *         description: Application is healthy
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 uptime:
   *                   type: number
   *                   description: Time (in seconds) the application has been running
   *                   example: 3600
   *                 status:
   *                   type: string
   *                   description: Status of the application
   *                   example: API OK
   *                 timestamp:
   *                   type: integer
   *                   description: Current timestamp in milliseconds
   *                   example: 1700000000000
   *       503:
   *         description: Application is not healthy
   */
  .get("/api", async (req, res, next) => {
    const healthcheck = {
      uptime: process.uptime(),
      status: "API OK",
      timestamp: Date.now(),
    };

    try {
      if (process.uptime()) res.status(200).send(healthcheck);
      else {
        healthcheck.status = error;
        res.status(503).send();
      }
    } catch (error) {
      healthcheck.status = error;
      res.status(503).send();
    }
  })

  /**
   * @swagger
   * /health/redis:
   *   get:
   *     summary: Check the health status of redis
   *     description: Returns the health status, uptime, and current timestamp of redis.
   *     responses:
   *       200:
   *         description: Redis database is healthy
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 uptime:
   *                   type: number
   *                   description: Time (in seconds) the application has been running
   *                   example: 3600
   *                 status:
   *                   type: string
   *                   description: Status of the application
   *                   example: REDIS OK
   *                 timestamp:
   *                   type: integer
   *                   description: Current timestamp in milliseconds
   *                   example: 1700000000000
   *       503:
   *         description: Redis database is not healthy
   */
  .get("/redis", async (req, res, next) => {
    const healthcheck = {
      uptime: process.uptime(),
      status: "REDIS OK",
      timestamp: Date.now(),
    };

    try {
      if (db.server_info.aof_last_write_status === "ok") {
        res.status(200).send(healthcheck);
      } else {
        healthcheck.status = error;
        res.status(503).send();
      }
    } catch (error) {
      healthcheck.status = error;
      res.status(503).send();
    }
  });

module.exports = healthRouter;
