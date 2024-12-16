const db = require("../dbClient");

module.exports = {
  create: (user, callback) => {
    // Check parameters
    if (!user.username)
      return callback(new Error("Wrong user parameters"), null);
    // Create User schema
    const userObj = {
      firstname: user.firstname,
      lastname: user.lastname,
    };
    // Check if user already exists
    db.hgetall(user.username, function (err, res) {
      if (err) return callback(err, null);
      if (!res) {
        // Save to DB
        db.hmset(user.username, userObj, (err, res) => {
          if (err) return callback(err, null);
          callback(null, res); // Return callback
        });
      } else {
        callback(new Error("User already exists"), null);
      }
    });
  },
  get: (username, callback) => {
    if (!username)
      return callback(new Error("Username must be provided"), null);
    db.hgetall(username, function (err, res) {
      if (err) return callback(err, null);
      if (res) callback(null, res);
      else callback(new Error("User doesn't exists"), null);
    });
  },
  update: (user, callback) => {
    if (!user.username)
      return callback(new Error("Username must be provided"), null);
    if (!user.firstname && !user.lastname)
      return callback(
        new Error(
          "At least one field (firstname or lastname) must be provided"
        ),
        null
      );

    db.hgetall(user.username, function (err, res) {
      if (err) return callback(err, null);

      if (res) {
        const updatedUser = {
          firstname: user.firstname || res.firstname,
          lastname: user.lastname || res.lastname,
        };

        db.hmset(user.username, updatedUser, (err, res) => {
          if (err) return callback(err, null);
          callback(null, "User updated successfully");
        });
      } else {
        callback(new Error("User doesn't exist"), null);
      }
    });
  },
  delete: (username, callback) => {
    if (!username)
      return callback(new Error("Username must be provided"), null);
    db.del(username, function (err, res) {
      if (err) return callback(err, null);
      if (res) callback(null, res);
      else callback(new Error("User doesn't exists"), null);
    });
  },
  get_keys: (callback) => {
    db.keys("*", function (err, res) {
      if (err) return callback(err, null);
      if (res) callback(null, res);
      else callback(new Error("Problem retrieving keys"), null);
    });
  },
};
