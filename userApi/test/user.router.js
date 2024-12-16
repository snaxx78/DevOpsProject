const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../src/index");
const db = require("../src/dbClient");
const userController = require("../src/controllers/user");

// Enable Chai to handle HTTP requests
chai.use(chaiHttp);

describe("User REST API", () => {
  // Clean the database before each test to ensure no residual data
  beforeEach(() => {
    db.flushdb();
  });

  // Close the app and database connection after all tests
  after(() => {
    app.close();
    db.quit();
  });

  describe("POST /user", () => {
    // Test to ensure a new user can be successfully created
    it("create a new user", (done) => {
      const user = {
        username: "snaxx",
        firstname: "thibault",
        lastname: "leonardon",
      };
      chai
        .request(app)
        .post("/user") // Send a POST request to create the user
        .send(user) // Pass the user data in the request body
        .then((res) => {
          // Expect the response to have a 201 status code (Created)
          chai.expect(res).to.have.status(201);
          // Verify the response indicates success
          chai.expect(res.body.status).to.equal("success");
          // Ensure the response is in JSON format
          chai.expect(res).to.be.json;
          done();
        })
        .catch((err) => {
          throw err;
        });
    });

    // Test to handle missing or incorrect parameters
    it("pass wrong parameters", (done) => {
      const user = {
        firstname: "thibault",
        lastname: "leonardon", // Missing the 'username' field
      };
      chai
        .request(app)
        .post("/user") // Send a POST request with incomplete data
        .send(user)
        .then((res) => {
          // Expect a 400 status code (Bad Request)
          chai.expect(res).to.have.status(400);
          // Verify the response indicates an error
          chai.expect(res.body.status).to.equal("error");
          // Ensure the response is in JSON format
          chai.expect(res).to.be.json;
          done();
        })
        .catch((err) => {
          throw err;
        });
    });
  });

  describe("GET /user/keys", () => {
    // Test to retrieve all user keys
    it("get keys", (done) => {
      const user = {
        username: "snaxx",
        firstname: "thibault",
        lastname: "leonardon",
      };
      // First, create a user
      userController.create(user, () => {
        // Retrieve all keys
        chai
          .request(app)
          .get("/user/keys")
          .then((res) => {
            // Expect a 200 status code (OK)
            chai.expect(res).to.have.status(200);
            // Verify the response indicates success
            chai.expect(res.body.status).to.equal("success");
            // Ensure the response is in JSON format
            chai.expect(res).to.be.json;
            done();
          })
          .catch((err) => {
            throw err;
          });
      });
    });
  });

  describe("GET /user", () => {
    // Test to retrieve an existing user by their username
    it("get an existing user", (done) => {
      const user = {
        username: "snaxx",
        firstname: "thibault",
        lastname: "leonardon",
      };
      // First, create the user
      userController.create(user, () => {
        // Then, fetch the user by their username
        chai
          .request(app)
          .get("/user/" + user.username)
          .then((res) => {
            // Expect a 200 status code (OK)
            chai.expect(res).to.have.status(200);
            // Verify the response indicates success
            chai.expect(res.body.status).to.equal("success");
            // Ensure the response is in JSON format
            chai.expect(res).to.be.json;
            done();
          })
          .catch((err) => {
            throw err;
          });
      });
    });

    // Test to handle fetching a non-existent user
    it("can not get a user when it does not exist", (done) => {
      chai
        .request(app)
        .get("/user/invalid") // Attempt to fetch a non-existent user
        .then((res) => {
          // Expect a 400 status code (Bad Request)
          chai.expect(res).to.have.status(400);
          // Verify the response indicates an error
          chai.expect(res.body.status).to.equal("error");
          // Ensure the response is in JSON format
          chai.expect(res).to.be.json;
          done();
        })
        .catch((err) => {
          throw err;
        });
    });
  });
  describe("PUT /Update", () => {
    // Test case to successfully update an existing user
    it("should update an existing user successfully", (done) => {
      const user = {
        username: "snaxx", // Original user data
        firstname: "Thibault",
        lastname: "Leonardon",
      };
      const updatedData = {
        username: "snaxx", // Same username for update
        firstname: "UpdatedFirstname",
        lastname: "UpdatedLastname",
      };

      // First, create the user in the database
      userController.create(user, (err, result) => {
        // Check if there was no error during user creation
        chai.expect(err).to.be.equal(null);
        chai.expect(result).to.be.equal("OK");

        // Now update the user with new data
        userController.update(updatedData, (err, res) => {
          // Check if there was no error during the update
          chai.expect(err).to.be.equal(null);
          chai.expect(res).to.be.equal("User updated successfully");

          // Fetch the user to verify the update
          userController.get(user.username, (err, result) => {
            // Check if there was no error while fetching the updated user
            chai.expect(err).to.be.equal(null);
            // Verify that the user data matches the updated values
            chai.expect(result).to.deep.equal({
              firstname: "UpdatedFirstname",
              lastname: "UpdatedLastname",
            });
            done(); // Finish the test
          });
        });
      });
    });

    // Test case to handle updating a non-existing user
    it("should return an error when trying to update a non-existing user", (done) => {
      const updatedData = {
        username: "invalidUser", // Username that does not exist
        firstname: "Firstname",
        lastname: "Lastname",
      };

      // Attempt to update a user that does not exist
      userController.update(updatedData, (err, res) => {
        // Ensure an error occurs
        chai.expect(err).to.not.be.equal(null);
        // Check if the error message indicates the user doesn't exist
        chai.expect(err.message).to.be.equal("User doesn't exist");
        // The result should be null since no update happened
        chai.expect(res).to.be.equal(null);
        done(); // Finish the test
      });
    });

    // Test case to handle invalid update data (missing necessary fields)
    it("should return an error when update data is invalid", (done) => {
      const user = {
        username: "snaxx",
        firstname: "Thibault",
        lastname: "Leonardon",
      };

      // First, create the user in the database
      userController.create(user, (err, result) => {
        // Ensure there is no error during user creation
        chai.expect(err).to.be.equal(null);
        chai.expect(result).to.be.equal("OK");

        // Now attempt to update with invalid data (missing 'firstname')
        const invalidUpdateData = {
          username: "snaxx",
          firstname: "", // Empty firstname is invalid
        };

        // Try updating the user with invalid data
        userController.update(invalidUpdateData, (err, res) => {
          // Ensure an error occurs due to invalid data
          chai.expect(err).to.not.be.equal(null);
          // Check if the error message indicates the issue with missing or empty fields
          chai
            .expect(err.message)
            .to.be.equal(
              "At least one field (firstname or lastname) must be provided"
            );
          // The result should be null since no update can proceed
          chai.expect(res).to.be.equal(null);
          done(); // Finish the test
        });
      });
    });
  });

  describe("DELETE /user", () => {
    // Test to delete an existing user by their username
    it("delete a user by their username", (done) => {
      const user = {
        username: "snaxx",
        firstname: "thibault",
        lastname: "leonardon",
      };
      // First, create the user
      userController.create(user, () => {
        // Then, delete the user by their username
        chai
          .request(app)
          .delete("/user/" + user.username)
          .then((res) => {
            // Expect a 200 status code (OK)
            chai.expect(res).to.have.status(200);
            // Verify the response indicates success
            chai.expect(res.body.status).to.equal("success");
            // Ensure the response is in JSON format
            chai.expect(res).to.be.json;
            done();
          })
          .catch((err) => {
            throw err;
          });
      });
    });

    // Test to handle deleting a non-existent user
    it("can't delete a user when they don't exist", (done) => {
      // Attempt to delete a non-existent user
      chai
        .request(app)
        .delete("/user/invalid")
        .then((res) => {
          // Expect a 400 status code (Bad Request)
          chai.expect(res).to.have.status(400);
          // Verify the response indicates an error
          chai.expect(res.body.status).to.equal("error");
          // Ensure the response is in JSON format
          chai.expect(res).to.be.json;
          done();
        })
        .catch((err) => {
          throw err;
        });
    });
  });
});
