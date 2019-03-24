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
  show: async (req, res, next) => {
    const { id } = req.params;
    const { user: { _id: currentUserId } } = req;

    if (id !== currentUserId) {
      return next(new errors.UnauthorizedError('Invalid user id provided'));
    }

    return User.findById(req.params.id)
      .then((user) => {
        res.send(user);
        return next();
      })
      .catch(() => next(new errors.ResourceNotFoundError(`There is no customer with the id of ${id}`)));
  },
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
