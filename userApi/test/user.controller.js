const { expect } = require('chai');
const userController = require('../src/controllers/user');
const db = require('../src/dbClient');

describe('User', () => {
  
  // Clear the database before each test to ensure no data conflicts
  beforeEach(() => {
    db.flushdb();
  });
  
  describe('Create', () => {
    
    // Test to check the creation of a new user
    it('create a new user', (done) => {
      const user = {
        username: 'snaxx',
        firstname: 'thibault',
        lastname: 'leonardon'
      };
      userController.create(user, (err, result) => {
        // Ensure no error occurs during creation
        expect(err).to.be.equal(null);
        // Verify the result is "OK"
        expect(result).to.be.equal('OK');
        done();
      });
    });

    // Test to handle invalid user parameters
    it('passing wrong user parameters', (done) => {
      const user = {
        firstname: 'Thibault',
        lastname: 'Leonardon' // Missing the 'username' field
      };
      userController.create(user, (err, result) => {
        // Check that an error is returned
        expect(err).to.not.be.equal(null);
        // Ensure the result is null
        expect(result).to.be.equal(null);
        done();
      });
    });

    // Test to avoid creating a duplicate user
    it('avoid creating an existing user', (done) => {
      const user = {
        username: 'snaxx',
        firstname: 'Thibault',
        lastname: 'Leonardon'
      };
      // Create a user
      userController.create(user, () => {
        // Attempt to create the same user again
        userController.create(user, (err, result) => {
          // Ensure an error is returned
          expect(err).to.not.be.equal(null);
          // Ensure the result is null
          expect(result).to.be.equal(null);
          done();
        });
      });
    });
  });

  describe('Get', () => {

    // Test to fetch an existing user by username
    it('get a user by username', (done) => {
      const user = {
        username: 'snaxx',
        firstname: 'Thibault',
        lastname: 'Leonardon'
      };
      // Create a user
      userController.create(user, () => {
        // Retrieve the user by username
        userController.get(user.username, (err, result) => {
          // Ensure no error occurs
          expect(err).to.be.equal(null);
          // Verify the fetched user details match the created user
          expect(result).to.be.deep.equal({
            firstname: 'Thibault',
            lastname: 'Leonardon'
          });
          done();
        });
      });
    });
  
    // Test to handle fetching a non-existent user
    it('can not get a user when it does not exist', (done) => {
      userController.get('invalid', (err, result) => {
        // Ensure an error is returned
        expect(err).to.not.be.equal(null);
        // Ensure the result is null
        expect(result).to.be.equal(null);
        done();
      });
    });
  });

  describe('Delete', () => {

    // Test to delete an existing user by username
    it('delete a user by username', (done) => {
      const user = {
        username: 'snaxx',
        firstname: 'thibault',
        lastname: 'leonardon'
      };
      userController.create(user, (err, result) => {
        // Ensure the user is successfully created
        expect(err).to.be.equal(null);
        expect(result).to.be.equal("OK");
        // Delete the created user
        userController.delete(user.username, (err, result) => {
          // Ensure no error occurs during deletion
          expect(err).to.be.equal(null);
          // Verify the result indicates successful deletion
          expect(result).to.be.equal(1);
          done();
        });
      });
    });

    // Test to prevent deleting a user that does not exist
    it('prevent deleting a user that did not exist', (done) => {
      userController.delete('test', (err, result) => {
        // Ensure an error is returned
        expect(err).to.not.be.equal(null);
        // Ensure the result is null
        expect(result).to.be.equal(null);
        done();
      });
    });
  });
});
