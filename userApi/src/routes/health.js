const express = require("express");
const db = require("../dbClient");

const healthRouter = express.Router();

healthRouter
/**
 * @swagger
 * /health:
 *   get:
 *     summary: Check the health status of the application
 *     description: Returns the health status, uptime, and timestamp of the application. It also checks the health of the Redis database.
 *     responses:
 *       200:
 *         description: Application and database are healthy
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
 *                   example: OK
 *                 timestamp:
 *                   type: integer
 *                   description: Current timestamp in milliseconds
 *                   example: 1700000000000
 *       503:
 *         description: Application or database is not healthy
 */
  .get("/", async (req, res, next) => {
    const healthcheck = {
      uptime: process.uptime(),
      status: "OK",
      timestamp: Date.now(),
    };

    try {
      if (db.server_info.aof_last_write_status === "ok")
        res.status(200).send(healthcheck);
      else {
        healthcheck.status = error;
        res.status(503).send();
      }
    } catch (error) {
      healthcheck.status = error;
      res.status(503).send();
    }
  });

module.exports = healthRouter;