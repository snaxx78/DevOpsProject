const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../src/index");

// Enable Chai to handle HTTP requests
chai.use(chaiHttp);

describe("Health REST API", () => {
  // Close the app and database connection after all tests
  after(() => {
    app.close();
  });

  describe("GET /health/api", () => {
    // Test to retrieve all user keys
    it("should be healthy", (done) => {
      chai
        .request(app)
        .get("/health/api")
        .then((res) => {
          // Expect a 200 status code (OK)
          chai.expect(res).to.have.status(200);
          // Verify the response indicates success
          chai.expect(res.body.status).to.equal("API OK");
          // Ensure the response is in JSON format
          chai.expect(res).to.be.json;
          done();
        })
        .catch((err) => {
          throw err;
        });
    });
  });

  describe("GET /health/redis", () => {
    // Test to retrieve all user keys
    it("should be healthy", (done) => {
      chai
        .request(app)
        .get("/health/redis")
        .then((res) => {
          // Expect a 200 status code (OK)
          chai.expect(res).to.have.status(200);
          // Verify the response indicates success
          chai.expect(res.body.status).to.equal("REDIS OK");
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
