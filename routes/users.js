const errors = require('restify-errors');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const generateHash = password => new Promise((resolve, reject) => {
  bcrypt.genSalt(10, (saltError, salt) => {
    if (saltError) {
      return reject(saltError.message);
    }

    return bcrypt.hash(password, salt, (hashError, hash) => {
      if (hashError) {
        return reject(hashError);
      }

      return resolve(hash);
    });
  });
});

module.exports = {
  // Register User
  create: (req, res, next) => {
    const { email, password } = req.body || {};

    generateHash(password)
      .then((hashedPassword) => {
        const user = new User({
          email,
          password: hashedPassword,
        });

        return user.save();
      })
      .then(() => {
        res.send(201);
        return next();
      })
      .catch(error => next(new errors.InternalError(error.message)));
  },
};
