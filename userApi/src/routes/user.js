const express = require('express')
const userController = require('../controllers/user')

const userRouter = express.Router()

userRouter
/**
 * @swagger
 * /user:
 *   post:
 *     summary: Create a new user
 *     description: Create a new user in the database
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The unique username of the user
 *                 example: snaxx
 *               firstname:
 *                 type: string
 *                 description: The first name of the user
 *                 example: Thibault
 *               lastname:
 *                 type: string
 *                 description: The last name of the user
 *                 example: Leonardon
 *             required:
 *                - username
 *                - firstname
 *                - lastname
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request, missing parameters or user exists
 */
  .post('/', (req, resp) => {
    userController.create(req.body, (err, res) => {
      let respObj
      if (err) {
        respObj = {
          status: "error",
          msg: err.message
        }
        return resp.status(400).json(respObj)
      }
      respObj = {
        status: "success",
        msg: res
      }
      resp.status(201).json(respObj)
    })
  })

  /**
 * @swagger
 * /user/keys:
 *   get:
 *     summary: Get all user keys
 *     description: Retrieve all keys from the database
 *     responses:
 *       200:
 *         description: Keys retrieved successfully
 *       400:
 *         description: Error retrieving keys
 */
  .get("/keys", (req, resp, next) => {
    userController.get_keys((err, res) => {
      let respObj;
      if (err) {
        respObj = {
          status: "error",
          msg: err.message,
        };
        return resp.status(400).json(respObj);
      }
      respObj = {
        status: "success",
        msg: res,
      };
      resp.status(200).json(respObj);
    });
  })
/**
 * @swagger
 * /user/{username}:
 *   get:
 *     summary: Get user by username
 *     description: Retrieve a user from the database by their username
 *     parameters:
 *       - name: username
 *         in: path
 *         required: true
 *         description: The username of the user to retrieve
 *         schema:
 *           type: string
 *           example: user
 *     responses:
 *       200:
 *         description: User found
 *       400:
 *         description: User does not exist
 */
  .get("/:username", (req, resp, next) => {
    const username = req.params.username;
    userController.get(username, (err, res) => {
      let respObj;
      if (err) {
        respObj = {
          status: "error",
          msg: err.message,
        };
        return resp.status(400).json(respObj);
      }
      respObj = {
        status: "success",
        msg: res,
      };
      resp.status(200).json(respObj);
    });
  })



/**
 * @swagger
 * /user/{username}:
 *   delete:
 *     summary: Delete a user by username
 *     description: Remove a user from the database by their username
 *     parameters:
 *       - name: username
 *         in: path
 *         required: true
 *         description: The username of the user to delete
 *         schema:
 *           type: string
 *           example: user
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Error deleting user or user does not exist
 */
  .delete("/:username", (req, resp, next) => {
    const username = req.params.username;
    userController.delete(username, (err, res) => {
      let respObj;
      if (err) {
        respObj = {
          status: "error",
          msg: err.message,
        };
        return resp.status(400).json(respObj);
      }
      respObj = {
        status: "success",
        msg: res,
      };
      resp.status(200).json(respObj);
    });
  });

module.exports = userRouter
