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
  describe("PATCH /user", () => {
    // Test to ensure a new user can be successfully created
    it("should update an existing user successfully", (done) => {
      const user = {
        username: "snaxxxx", // Original user data
        firstname: "Thibault",
        lastname: "Leonardon",
      };
      const updatedData = {
        username: "snaxxxx", // Same username for update
        firstname: "UpdatedFirstname",
        lastname: "UpdatedLastname",
      };
      // First, create the user in the database
      userController.create(user, (err, result) => {
        // Check if there was no error during user creation
        chai.expect(err).to.be.equal(null);
        chai.expect(result).to.be.equal("OK");
        chai
          .request(app)
          .patch("/user") // Send a PATCH request to create the user
          .send(updatedData) // Pass the user data in the request body
          .then((res) => {
            // Expect the response to have a 201 status code (Created)
            chai.expect(res).to.have.status(200);
            chai.expect(err).to.be.equal(null);
            chai.expect(res.body.msg).to.be.equal("User updated successfully");
            // Ensure the response is in JSON format
            chai.expect(res).to.be.json;
            done();
          })
          .catch((err) => {
            throw err;
          });
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
        .patch("/user") // Send a PATCH request with incomplete data
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
