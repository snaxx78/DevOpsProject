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

  describe('Update', () => {
    
    // Test case for updating an existing user
    it('update an existing user', (done) => {
      const user = {
        username: 'snaxx',
        firstname: 'Thibault',
        lastname: 'Leonardon'
      };
      const updatedData = {
        username: 'snaxx',
        firstname: 'tibo',
        lastname: 'leo'
      };

      // First, create a user
      userController.create(user, (err, result) => {
        // Ensure no error occurs during user creation
        expect(err).to.be.equal(null);
        expect(result).to.be.equal('OK');

        // Now, update the user with new data
        userController.update(updatedData, (err, result) => {
          // Ensure no error occurs during update
          expect(err).to.be.equal(null);
          expect(result).to.be.equal('User updated successfully');

          // Retrieve the user to verify the update
          userController.get(user.username, (err, result) => {
            // Ensure no error occurs when fetching the user
            expect(err).to.be.equal(null);
            // Ensure the user data matches the updated information
            expect(result).to.be.deep.equal({
              firstname: 'tibo',
              lastname: 'leo'
            });
            done(); // Finish the test
          });
        });
      });
    });

    // Test case for trying to update a non-existent user
    it('fail to update a non-existent user', (done) => {
      const updatedData = {
        username: 'nonexistent', // Username that doesn't exist
        firstname: 'tibo',
        lastname: 'leo'
      };

      // Attempt to update a non-existent user
      userController.update(updatedData, (err, result) => {
        // Ensure an error occurs
        expect(err).to.not.be.equal(null);
        // Check that the error message specifies the user doesn't exist
        expect(err.message).to.be.equal("User doesn't exist");
        // The result should be null since no update can happen
        expect(result).to.be.equal(null);
        done(); // Finish the test
      });
    });

    // Test case for updating with invalid data (missing 'username')
    it('fail to update with invalid data', (done) => {
      const user = {
        username: 'snaxx',
        firstname: 'Thibault',
        lastname: 'Leonardon'
      };
      const invalidData = {
        firstname: 'tibo' // Missing the 'username' field
      };

      // First, create a user
      userController.create(user, (err, result) => {
        // Ensure no error occurs during user creation
        expect(err).to.be.equal(null);
        expect(result).to.be.equal('OK');

        // Attempt to update the user with invalid data
        userController.update(invalidData, (err, result) => {
          // Ensure an error occurs due to missing username
          expect(err).to.not.be.equal(null);
          // Check that the error message indicates that 'username' is required
          expect(err.message).to.be.equal('Username must be provided');
          // The result should be null since the update can't proceed
          expect(result).to.be.equal(null);
          done(); // Finish the test
        });
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
