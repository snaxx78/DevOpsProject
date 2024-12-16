const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/index');
const db = require('../src/dbClient');
const userController = require('../src/controllers/user');

// Enable Chai to handle HTTP requests
chai.use(chaiHttp);

describe('User REST API', () => {
  
  // Clean the database before each test to ensure no residual data
  beforeEach(() => {
    db.flushdb();
  });

  // Close the app and database connection after all tests
  after(() => {
    app.close();
    db.quit();
  });

  describe('POST /user', () => {

    // Test to ensure a new user can be successfully created
    it('create a new user', (done) => {
      const user = {
        username: 'snaxx',
        firstname: 'thibault',
        lastname: 'leonardon',
      };
      chai
        .request(app)
        .post('/user') // Send a POST request to create the user
        .send(user) // Pass the user data in the request body
        .then((res) => {
          // Expect the response to have a 201 status code (Created)
          chai.expect(res).to.have.status(201);
          // Verify the response indicates success
          chai.expect(res.body.status).to.equal('success');
          // Ensure the response is in JSON format
          chai.expect(res).to.be.json;
          done();
        })
        .catch((err) => {
          throw err;
        });
    });

    // Test to handle missing or incorrect parameters
    it('pass wrong parameters', (done) => {
      const user = {
        firstname: 'thibault',
        lastname: 'leonardon', // Missing the 'username' field
      };
      chai
        .request(app)
        .post('/user') // Send a POST request with incomplete data
        .send(user)
        .then((res) => {
          // Expect a 400 status code (Bad Request)
          chai.expect(res).to.have.status(400);
          // Verify the response indicates an error
          chai.expect(res.body.status).to.equal('error');
          // Ensure the response is in JSON format
          chai.expect(res).to.be.json;
          done();
        })
        .catch((err) => {
          throw err;
        });
    });
  });

  describe('GET /user/keys', () => {
    
    // Test to retrieve all user keys
    it('get keys', (done) => {
      const user = {
        username: 'snaxx',
        firstname: 'thibault',
        lastname: 'leonardon',
      };
      // First, create a user
      userController.create(user, () => {
        // Retrieve all keys
        chai
          .request(app)
          .get('/user/keys')
          .then((res) => {
            // Expect a 200 status code (OK)
            chai.expect(res).to.have.status(200);
            // Verify the response indicates success
            chai.expect(res.body.status).to.equal('success');
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

  describe('GET /user', () => {
    
    // Test to retrieve an existing user by their username
    it('get an existing user', (done) => {
      const user = {
        username: 'snaxx',
        firstname: 'thibault',
        lastname: 'leonardon',
      };
      // First, create the user
      userController.create(user, () => {
        // Then, fetch the user by their username
        chai
          .request(app)
          .get('/user/' + user.username)
          .then((res) => {
            // Expect a 200 status code (OK)
            chai.expect(res).to.have.status(200);
            // Verify the response indicates success
            chai.expect(res.body.status).to.equal('success');
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
    it('can not get a user when it does not exist', (done) => {
      chai
        .request(app)
        .get('/user/invalid') // Attempt to fetch a non-existent user
        .then((res) => {
          // Expect a 400 status code (Bad Request)
          chai.expect(res).to.have.status(400);
          // Verify the response indicates an error
          chai.expect(res.body.status).to.equal('error');
          // Ensure the response is in JSON format
          chai.expect(res).to.be.json;
          done();
        })
        .catch((err) => {
          throw err;
        });
    });
  });
  describe('PUT /Update', () => {

    // Test pour la mise à jour réussie d'un utilisateur
    it('should update an existing user successfully', (done) => {
      const user = {
        username: 'snaxx',
        firstname: 'Thibault',
        lastname: 'Leonardon'
      };
      const updatedData = {
        username: 'snaxx',
        firstname: 'UpdatedFirstname',
        lastname: 'UpdatedLastname'
      };

      // Créer d'abord l'utilisateur
      userController.create(user, (err, result) => {
        chai.expect(err).to.be.equal(null);
        chai.expect(result).to.be.equal('OK');

        // Mettre à jour l'utilisateur
        userController.update(updatedData, (err, res) => {
          chai.expect(err).to.be.equal(null); // Aucune erreur
          chai.expect(res).to.be.equal('User updated successfully'); // Message de succès

          // Vérifier que les données sont mises à jour
          userController.get(user.username, (err, result) => {
            chai.expect(err).to.be.equal(null);
            chai.expect(result).to.deep.equal({
              firstname: 'UpdatedFirstname',
              lastname: 'UpdatedLastname'
            });
            done();
          });
        });
      });
    });

    // Test pour la mise à jour d'un utilisateur qui n'existe pas
    it('should return an error when trying to update a non-existing user', (done) => {
      const updatedData = {
        username: 'invalidUser',
        firstname: 'Firstname',
        lastname: 'Lastname'
      };

      userController.update(updatedData, (err, res) => {
        chai.expect(err).to.not.be.equal(null); // Une erreur est attendue
        chai.expect(err.message).to.be.equal("User doesn\'t exist"); // Message d'erreur attendu
        chai.expect(res).to.be.equal(null);
        done();
      });
    });

    // Test pour des paramètres invalides dans la mise à jour
    it('should return an error when update data is invalid', (done) => {
      const user = {
        username: 'snaxx',
        firstname: 'Thibault',
        lastname: 'Leonardon'
      };

      // Créer l'utilisateur d'abord
      userController.create(user, (err, result) => {
        chai.expect(err).to.be.equal(null);
        chai.expect(result).to.be.equal('OK');

        // Envoyer des données invalides
        const invalidUpdateData = {
          username: 'snaxx',
          firstname: '' // Champ vide (invalide)
        };

        userController.update(invalidUpdateData, (err, res) => {
          chai.expect(err).to.not.be.equal(null); // Erreur attendue
          chai.expect(err.message).to.be.equal('At least one field (firstname or lastname) must be provided'); // Message d'erreur
          chai.expect(res).to.be.equal(null);
          done();
        });
      });
    });
  });

  describe('DELETE /user', () => {

    // Test to delete an existing user by their username
    it('delete a user by their username', (done) => {
      const user = {
        username: 'snaxx',
        firstname: 'thibault',
        lastname: 'leonardon',
      };
      // First, create the user
      userController.create(user, () => {
        // Then, delete the user by their username
        chai
          .request(app)
          .delete('/user/' + user.username)
          .then((res) => {
            // Expect a 200 status code (OK)
            chai.expect(res).to.have.status(200);
            // Verify the response indicates success
            chai.expect(res.body.status).to.equal('success');
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
        .delete('/user/invalid')
        .then((res) => {
          // Expect a 400 status code (Bad Request)
          chai.expect(res).to.have.status(400);
          // Verify the response indicates an error
          chai.expect(res.body.status).to.equal('error');
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
